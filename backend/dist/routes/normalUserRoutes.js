"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenerateQueue_1 = require("../middleware/GenerateQueue");
const issueController_1 = require("../controllers/issueController");
const normalUserController_1 = require("../controllers/normalUserController");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.get('/havingissue', normalUserController_1.havingissue);
router.post('/createissue', GenerateQueue_1.GenarateQueueNum, issueController_1.createissue);
router.get('/getissue', issueController_1.getissue);
router.delete('/deleteissue', issueController_1.deleteissue);
router.get('/getnotifications', notificationController_1.getNotifications);
exports.default = router;
//# sourceMappingURL=normalUserRoutes.js.map