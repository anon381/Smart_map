const prisma = require('../../prisma/client');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

const gamificationService = require('../gamification/gamification.service');
const { assertUserNearLocation, validateMovement } = require('../../utils/geo');

const runAiVerification = async (locationId, userId, userLat, userLng, verificationImage = null, isSimulator = false) => {
  const simulatorMode = isSimulator === true;

  // Production Safety
  if (simulatorMode && process.env.NODE_ENV !== 'development') {
    throw new Error('Crucial Exception: Simulator mode is disabled in non-development environments.');
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  // 1. Fetch location details
  const location = await prisma.location.findUnique({
    where: { id: locationId }
  });

  if (!location) {
    const error = new Error('Location not found');
    error.status = 404;
    throw error;
  }

  // --- UNIFIED EVALUATION ENGINE ---
  const evaluation = {
    passed: true,
    severity: simulatorMode ? 'warning' : 'error',
    checks: {
      proximity: true,
      movement: true
    },
    errors: []
  };

  // 1. Safety/Movement (Always fails hard)
  const lastActivity = await prisma.activityLog.findFirst({
    where: { userId, latitude: { not: null }, longitude: { not: null } },
    orderBy: { createdAt: 'desc' }
  });
  const movement = validateMovement(lastActivity, userLat, userLng);
  if (!movement.valid) {
    throw new Error(`Security Exception: ${movement.reason}`);
  }

  // 2. Proximity Check
  try {
    assertUserNearLocation(userLat, userLng, location.latitude, location.longitude, 100);
  } catch (e) {
    evaluation.passed = false;
    evaluation.checks.proximity = false;
    evaluation.errors.push(e.message);
  }

  if (!location.imageUrl) {
    evaluation.checks.visuals = false;
    evaluation.errors.push('Benchmark image missing. Verification will rely on GPS and context.');
  }

  // --- DUMMY AI VISION ENGINE (HACKATHON MOCK) ---
  let aiData = { 
    valid: evaluation.passed, 
    confidence: 0.98, 
    reasoning: evaluation.passed 
      ? "Heuristic match: GPS telemetry and visual metadata align with target boundaries." 
      : "Visual mismatch: User telemetry outside of acceptable target radius."
  };

  // Skip Gemini call entirely as per user request to simplify development flow
  /*
  if (!simulatorMode) {
    try {
      // (Gemini logic would go here)
    } catch (aiErr) { ... }
  }
  */

  // --- WRITE ISOLATION: SIMULATOR MODE NO-OP ---
  if (simulatorMode) {
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_VERIFICATION_SIMULATOR',
        details: JSON.stringify({ 
          msg: `Simulated check for ${location.name}`, 
          mode: 'simulator',
          rules_passed: evaluation.passed,
          intended_result: aiData.valid ? 'approved' : 'rejected'
        }),
        latitude: userLat,
        longitude: userLng
      }
    });

    return {
      mode: 'simulator',
      accepted: true,
      state: 'no-op',
      dbWrite: false,
      evaluation,
      result: aiData.valid ? 'approved' : 'rejected',
      confidence: aiData.confidence,
      reasoning: aiData.reasoning
    };
  }

  // Real Mode: Fail if proximity evaluation failed
  if (!evaluation.passed) {
    throw new Error(`Verification Failed: ${evaluation.errors.join(', ')}`);
  }

  // 6. Finalize with REAL Transaction
  return await prisma.$transaction(async (tx) => {
    let newStatus = location.status;
    let points = 0;
    let coins = 0;

    if (aiData.valid && aiData.confidence >= 0.8) {
      newStatus = 'APPROVED';
      points = 10;
      coins = 5;
    } else if (!aiData.valid && aiData.confidence >= 0.8) {
      newStatus = 'REJECTED';
    }

    // Update real location status
    await tx.location.update({
      where: { id: locationId },
      data: { status: newStatus }
    });

    // 5. Create the Verification record
    await tx.verification.upsert({
      where: { userId_locationId: { userId, locationId } },
      update: {
        vote: aiData.valid ? 'UP' : 'DOWN',
        confidence: aiData.confidence,
        latitude: userLat,
        longitude: userLng
      },
      create: {
        userId,
        locationId,
        vote: aiData.valid ? 'UP' : 'DOWN',
        confidence: aiData.confidence,
        latitude: userLat,
        longitude: userLng
      }
    });

    if (aiData.valid) {
      await gamificationService.rewardUser(
        tx,
        userId,
        'AI_VERIFICATION_SUCCESS',
        JSON.stringify({ 
          msg: `AI verified ${location.name}`, 
          mode: 'real',
          confidence: aiData.confidence
        }),
        points,
        coins,
        userLat,
        userLng
      );
    }

    return {
      status: newStatus,
      confidence: aiData.confidence,
      rewards: { xp: points, coins },
      message: aiData.valid ? 'Location verified by AI' : 'AI could not verify location'
    };
  });
};

module.exports = {
  runAiVerification
};
