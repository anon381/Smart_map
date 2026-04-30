const prisma = require('../../prisma/client');

const getActiveAds = async (placement) => {
  const now = new Date();
  const where = {
    status: 'ACTIVE',
    AND: [
      {
        OR: [
          { startAt: { lte: now } },
          { startAt: null }
        ]
      },
      {
        OR: [
          { endAt: { gte: now } },
          { endAt: null }
        ]
      }
    ]
  };

  if (placement) {
    where.placement = placement;
  }

  return prisma.ad.findMany({
    where,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  });
};

const getAdById = async (id) => {
  const ad = await prisma.ad.findUnique({
    where: { id }
  });

  if (!ad) {
    throw new Error('Ad not found');
  }

  return ad;
};

const createAd = async (data, adminId) => {
  if (data.startAt && data.endAt && new Date(data.endAt) < new Date(data.startAt)) {
    throw new Error('endAt must be after startAt');
  }

  return prisma.ad.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl,
      placement: data.placement,
      status: data.status,
      priority: data.priority,
      startAt: data.startAt || null,
      endAt: data.endAt || null,
      createdById: adminId
    }
  });
};

const updateAd = async (id, data) => {
  const existing = await prisma.ad.findUnique({ where: { id } });

  if (!existing) {
    throw new Error('Ad not found');
  }

  if (data.startAt && data.endAt && new Date(data.endAt) < new Date(data.startAt)) {
    throw new Error('endAt must be after startAt');
  }

  return prisma.ad.update({
    where: { id },
    data: {
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      imageUrl: data.imageUrl ?? existing.imageUrl,
      targetUrl: data.targetUrl ?? existing.targetUrl,
      placement: data.placement ?? existing.placement,
      status: data.status ?? existing.status,
      priority: data.priority ?? existing.priority,
      startAt: data.startAt !== undefined ? data.startAt : existing.startAt,
      endAt: data.endAt !== undefined ? data.endAt : existing.endAt
    }
  });
};

const deleteAd = async (id) => {
  const existing = await prisma.ad.findUnique({ where: { id } });

  if (!existing) {
    throw new Error('Ad not found');
  }

  await prisma.ad.delete({ where: { id } });
};

const trackImpression = async (adId, userId) => {
  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error('Ad not found');
  }

  return prisma.adImpression.create({
    data: {
      adId,
      userId,
    }
  });
};

const trackClick = async (adId, userId) => {
  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error('Ad not found');
  }

  return prisma.adClick.create({
    data: {
      adId,
      userId,
    }
  });
};

module.exports = {
  getActiveAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  trackImpression,
  trackClick,
};
