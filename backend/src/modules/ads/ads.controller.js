const adsService = require('./ads.service');

const getAds = async (req, res, next) => {
  try {
    const placement = req.query.placement;
    const ads = await adsService.getActiveAds(placement);
    res.json(ads);
  } catch (error) {
    next(error);
  }
};

const getAdById = async (req, res, next) => {
  try {
    const ad = await adsService.getAdById(req.params.id);
    res.json(ad);
  } catch (error) {
    next(error);
  }
};

const createAd = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const ad = await adsService.createAd(req.body, adminId);
    res.status(201).json(ad);
  } catch (error) {
    next(error);
  }
};

const updateAd = async (req, res, next) => {
  try {
    const ad = await adsService.updateAd(req.params.id, req.body);
    res.json(ad);
  } catch (error) {
    next(error);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    await adsService.deleteAd(req.params.id);
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const trackImpression = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const impression = await adsService.trackImpression(req.params.id, userId);
    res.status(201).json(impression);
  } catch (error) {
    next(error);
  }
};

const trackClick = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const click = await adsService.trackClick(req.params.id, userId);
    res.status(201).json(click);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  trackImpression,
  trackClick,
};
