"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentIssue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.userId = :user", { user: req.body.userId })
            .andWhere("issue.isDone = :done", { done: 0 })
            .getOne();
        const notificationRepository = yield index_1.AppDataSource.getRepository(Notification)
            .createQueryBuilder("notification")
            .where("notification.userId = :user", { user: req.body.userId })
            .where("notification.issueId = :issue", { issue: currentIssue === null || currentIssue === void 0 ? void 0 : currentIssue.id })
            .orderBy("notification.id", "DESC")
            .getManyAndCount();
        res.json({
            notifications: notificationRepository
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNotifications = getNotifications;
//# sourceMappingURL=notificationController.js.map