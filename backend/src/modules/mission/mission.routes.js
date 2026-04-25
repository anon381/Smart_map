const express = require('express');
const router = express.Router();
const missionController = require('./mission.controller');
const protect = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { createMissionSchema, completeMissionSchema } = require('./mission.validation');

router.get('/', missionController.getAllMissions);

// Expose the frontend "Mission Log" which actually maps verified locations
router.get('/log', protect, missionController.getMissionLog);

// Only admins can create missions
router.post('/', protect, requireRole('ADMIN'), validate(createMissionSchema), missionController.createMission);

// Users interact with missions
router.post('/:id/start', protect, missionController.startMission);
router.post('/:id/complete', [protect, validate(completeMissionSchema)], missionController.completeMission);

module.exports = router;
