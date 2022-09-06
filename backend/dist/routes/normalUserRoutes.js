"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenerateQueue_1 = require("../middleware/GenerateQueue");
const issueController_1 = require("../controllers/issueController");
const normalUserController_1 = require("../controllers/normalUserController");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.get('/havingIssue', normalUserController_1.havingIssue);
router.post('/createIssue', GenerateQueue_1.genarateQueueNum, issueController_1.createIssue);
router.get('/getQueueDetails', issueController_1.getIssueQueueDetails);
router.delete('/cancelIssue', issueController_1.cancelIssue);
router.get('/getNotifications', notificationController_1.getNotifications);
exports.default = router;
//# sourceMappingURL=normalUserRoutes.js.map