"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = require("../controllers/issueController");
const counterUserController_1 = require("../controllers/counterUserController");
const router = (0, express_1.Router)();
router.get('/getcounterissues', issueController_1.getcounterissues);
router.put('/issuecalled/:id', issueController_1.issuecalled);
router.get('/issue/:id', issueController_1.getsingleissue);
router.get('/issuedone/:id', issueController_1.issuedone);
router.put('/getnextissue/:id', issueController_1.getnextissue);
router.get('/counterclose', counterUserController_1.counterclose);
exports.default = router;
//# sourceMappingURL=counterUserRoutes.js.map