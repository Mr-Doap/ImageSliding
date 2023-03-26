const express = require('express')
const { captured, focusedButNotCaptured, requestedButNotFocused, postRegion } = require('../models/region.models')
const router = express.Router()

router.get('/captured', (req, res) => {
    res.json(captured);
});

router.get('/request', (req, res) => {
    if (req.query.focus) {
        res.json(focusedButNotCaptured);
    }
    else{
        res.json(requestedButNotFocused);
    }
});

router.post('/move', (req, res) => {
    res.json(postRegion(req.body));
});

module.exports = router;