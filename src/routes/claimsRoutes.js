const express = require('express');
const router = express.Router();

/* const claimController = require('../controllers/claimController'); */

const ClaimController = require('../controllers/claimController');

const claimController = new ClaimController();

router.post('/claim', claimController.postClaim);
router.get('/claims/:userId', claimController.getClaims);
router.patch('/claims/:userId', claimController.patchClaims);

module.exports = router;
