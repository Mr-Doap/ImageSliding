const express = require('express')
const { captured, focused, requested, postRegion, getFocusing } = require('../models/region.models')
const router = express.Router()

router.get('/captured', (req, res) => {
    res.json(captured);
});

router.get('/request', (req, res) => {
    res.json(requested);
});

router.get('/focused', (req, res) => {
    res.json(focused);
});

router.get('/focusing', (req, res) => {
    res.json(getFocusing());
});

router.post('/move', (req, res) => {
    res.json(postRegion(req.body));
});

module.exports = router;