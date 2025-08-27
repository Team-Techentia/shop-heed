const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event: String,
  payload: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
