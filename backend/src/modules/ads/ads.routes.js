const express = require('express');
const router = express.Router();
const adsController = require('./ads.controller');
const protect = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { createAdSchema, updateAdSchema } = require('./ads.validation');

router.get('/', adsController.getAds);
router.get('/:id', adsController.getAdById);
router.post('/', protect, requireRole('ADMIN'), validate(createAdSchema), adsController.createAd);
router.put('/:id', protect, requireRole('ADMIN'), validate(updateAdSchema), adsController.updateAd);
router.delete('/:id', protect, requireRole('ADMIN'), adsController.deleteAd);
router.post('/:id/impressions', adsController.trackImpression);
router.post('/:id/clicks', adsController.trackClick);

module.exports = router;
