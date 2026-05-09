const PageHits = require('../models/PageHitsModel');
const requestIp = require('request-ip');

exports.pageHits = async (req, res, next) => {
  try {
    const ipAddress = requestIp.getClientIp(req);

    await PageHits.create({ ipAddress });
    const total = await PageHits.countDocuments();

    return res.status(200).json({ success: true, total });
  } catch (error) {
    return next(error);
  }
};
