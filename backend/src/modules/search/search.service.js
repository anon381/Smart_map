const prisma = require('../../prisma/client');
const { GoogleGenAI } = require('@google/genai');

const { calculateDistance } = require('../../utils/geo');

const ragSearch = async (query, userLat, userLng) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Retrieve Candidate Locations (Approved only)
  const allLocations = await prisma.location.findMany({
    where: { status: 'APPROVED' },
    select: {
      name: true,
      category: true,
      description: true,
      latitude: true,
      longitude: true
    }
  });

  // 2. Spatial Pre-Filtering (Radius: 5km)
  const nearbyLocations = allLocations
    .map(loc => ({
      ...loc,
      distance: calculateDistance(userLat, userLng, loc.latitude, loc.longitude)
    }))
    .filter(loc => loc.distance <= 5000) // 5km limit
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10); // Top-K Relevance: Focus Gemini on most reachable 10 spots

  if (nearbyLocations.length === 0) {
    return {
      answer: "I couldn't find any verified SmartMap locations near your current position.",
      sourceLocationsSearched: 0
    };
  }

  // 3. Build Detailed Spatio-Context
  let contextStr = 'Verified locations within 5km of the user:\n';
  nearbyLocations.forEach((loc, index) => {
    contextStr += `\n[${index + 1}] ${loc.name} (${loc.category}) - ${Math.round(loc.distance)}m away\n`;
    contextStr += `   Description: ${loc.description || 'Verified spot'}\n`;
  });

  const prompt = `
System: You are SmartMap AI. Answer the user based ONLY on the nearby locations provided. 
Inform the user about distances (in meters) to make the response actionable.

Context:
${contextStr}

User Question: ${query}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return {
    answer: response.text,
    sourceLocationsSearched: nearbyLocations.length,
    geofenced: true
  };
};

module.exports = {
  ragSearch
};
