"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = require("../controllers/issueController");
const counterUserController_1 = require("../controllers/counterUserController");
const router = (0, express_1.Router)();
router.post('/getcounterissues', issueController_1.getcounterissues);
router.put('/issuecalled/:id', issueController_1.issuecalled);
router.get('/issue/:id', issueController_1.getsingleissue);
router.put('/issuedone/:id', issueController_1.issuedone);
router.put('/nextissuecalled/:id', issueController_1.nextissuecalled);
router.put('/getnextissue/:id', issueController_1.getnextissue);
router.put('/counterclose', counterUserController_1.counterclose);
exports.default = router;
//# sourceMappingURL=counterUserRoutes.js.map