"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = require("../controllers/issueController");
const counterUserController_1 = require("../controllers/counterUserController");
const router = (0, express_1.Router)();
router.get('/getCounterIssues', issueController_1.getCounterIssues);
router.put('/issueCalled/:id', issueController_1.issueCalled);
router.get('/issue/:id', issueController_1.getSingleIssue);
router.get('/issueDone/:id', issueController_1.issueDone);
router.put('/getDoneNextIssue/:id', issueController_1.getDoneNextIssue);
router.get('/counterClose', counterUserController_1.counterClose);
exports.default = router;
//# sourceMappingURL=counterUserRoutes.js.map