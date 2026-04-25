const missionService = require('./mission.service');
const prisma = require('../../prisma/client');

const getAllMissions = async (req, res, next) => {
  try {
    const missions = await missionService.getAllMissions();
    res.json(missions);
  } catch (error) {
    next(error);
  }
};

const getMissionLog = async (req, res, next) => {
  try {
    // Frontend expects "missions" but they are actually APPROVED locations
    const locations = await prisma.location.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' }
    });

    const missionLog = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      cat: loc.category,
      when: loc.createdAt,
      xp: 100, // Default baseline or read from verifications in real app
      coins: 50,
      ai: loc.verificationScore || 98.0, // Mocked confidence or pulled if added later
      gps: `${loc.latitude.toFixed(4)} N, ${loc.longitude.toFixed(4)} E`,
      tip: loc.description || "No tip provided.",
      tags: ["Verified"], // Mock tags for now
      photo: loc.imageUrl || "from-slate-500/30 to-zinc-700/20"
    }));

    res.json(missionLog);
  } catch (error) {
    next(error);
  }
};

const createMission = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const mission = await missionService.createMission(req.body, adminId);
    
    res.status(201).json({
      message: 'Mission created successfully',
      mission
    });
  } catch (error) {
    next(error);
  }
};

const startMission = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const userMission = await missionService.startMission(id, userId);

    res.status(201).json({
      message: 'Mission started',
      userMission
    });
  } catch (error) {
    next(error);
  }
};

const completeMission = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { userLat, userLng, isSimulator } = req.body;

    const userMission = await missionService.completeMission(id, userId, userLat, userLng, isSimulator);

    res.json({
      message: 'Mission completed successfully',
      userMission
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMissions,
  getMissionLog,
  createMission,
  startMission,
  completeMission
};
