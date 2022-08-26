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
exports.deleteissue = exports.getissue = exports.createissue = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const createissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, telephone, email, issue, counter } = req.body;
        const issues = new Issue_1.Issue();
        issues.name = name;
        issues.telephone = telephone;
        issues.email = email;
        issues.issue = issue;
        issues.user = req.body.userId;
        issues.counter = counter;
        issues.queueNo = req.body.queueNum;
        const savedissue = yield issues.save();
        res.json(savedissue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createissue = createissue;
const getissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.user = :user", { nuser: req.body.userId })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getMany();
        res.json(issueRepository.length);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getissue = getissue;
const deleteissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Issue_1.Issue.delete({ user: req.body.userId });
        if (result.affected === 0) {
            return res.status(404).json({ message: "user does not exists" });
        }
        return res.json({ message: "successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.deleteissue = deleteissue;
//# sourceMappingURL=issueController.js.map