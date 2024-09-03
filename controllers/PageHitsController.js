const PageHits = require('../models/PageHitsModel');
const requestIp = require('request-ip');

exports.pageHits = async (req, res, next) => {
  const ipAddress = requestIp.getClientIp(req);
  const hits = await PageHits.find();
  // Possibly make it unique
  const newIpAddress = new PageHits({
    ipAddress,
  });
  await newIpAddress.save();
  res.status(200).json({ success: true, hits });
};
