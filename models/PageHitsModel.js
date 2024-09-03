const mongoose = require('mongoose');

const PageHitsSchema = mongoose.Schema(
  {
    ipAddress: { type: String },
  },
  {
    timestamp: true,
  },
);

const PageHits = mongoose.model('PageHits', PageHitsSchema);

module.exports = PageHits;
