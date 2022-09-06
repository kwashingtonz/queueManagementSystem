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
exports.getDoneNextIssue = exports.issueDone = exports.issueCalled = exports.getSingleIssue = exports.getCounterIssues = exports.cancelIssue = exports.getIssueQueueDetails = exports.createIssue = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Counter_1 = require("../models/Counter");
const Notification_1 = require("../models/Notification");
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, telephone, email, issue, counter, userId, queueNo } = req.body;
        const issues = new Issue_1.Issue();
        issues.name = name;
        issues.telephone = telephone;
        issues.email = email;
        issues.issue = issue;
        issues.user = userId;
        issues.counter = counter;
        issues.queueNo = queueNo;
        const savedissue = yield issues.save();
        res.json(savedissue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createIssue = createIssue;
const getIssueQueueDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.user = :user", { user: req.body.userId })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getOne();
        const counterDetails = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :counter", { counter: issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.counter })
            .getOne();
        console.log(counterDetails);
        if ((issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.queueNo) == (counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.nextNum)) {
            res.json({
                counterNo: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.id,
                message: "You're Next"
            });
        }
        else {
            res.json({
                counterNo: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.id,
                currentNo: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.currentNum,
                nextNo: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.nextNum,
                myNo: issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.queueNo
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getIssueQueueDetails = getIssueQueueDetails;
const cancelIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Issue_1.Issue.delete({ user: req.body.userId });
        if (result.affected === 0) {
            return res.status(404).json({ message: "user does not exists" });
        }
        res.cookie('jwt', '', { maxAge: 1 });
        req.body.userId = null;
        return res.json({ message: "successfully deleted and logged out" });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.cancelIssue = cancelIssue;
const getCounterIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const skip = (page - 1) * perPage;
    try {
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.user = :user", { user: req.body.userId })
            .getRawOne();
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.counter = :counter", { counter: counterRepository.counter_id })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .orderBy("issue.queueNo", "ASC")
            .limit(perPage)
            .offset(skip)
            .getManyAndCount();
        res.json({
            issues: issueRepository[0],
            page: page,
            totalIssues: issueRepository[1],
            lastPage: Math.ceil(issueRepository[1] / perPage)
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCounterIssues = getCounterIssues;
const getSingleIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.id = :id", { id: parseInt(id) })
            .getOne();
        res.json(issueRepository);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSingleIssue = getSingleIssue;
const issueCalled = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.id = :id", { id: parseInt(req.params.id) })
            .getOne();
        if (!issue)
            return res.status(404).json({ message: "issue does not exists" });
        const notifycall = new Notification_1.Notification();
        notifycall.message = "Please proceed to the Counter " + issue.counter + " now";
        notifycall.issue = issue;
        notifycall.user = issue.user;
        const savedissue = yield notifycall.save();
        const getNextIssue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.queueNo > :qN", { qN: issue.queueNo })
            .andWhere("issue.isCalled = :called", { called: false })
            .andWhere("issue.isDone = :done", { done: false })
            .andWhere("issue.counterId = :counter", { counter: issue.counter })
            .getOne();
        if (!getNextIssue) {
            const updateCounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({ currentNum: issue.queueNo, nextNum: 0 })
                .where("id = :cid", { cid: issue.counter })
                .execute();
        }
        else {
            const notifynext = new Notification_1.Notification();
            notifynext.message = "Please proceed to the Counter " + getNextIssue.counter + " now";
            notifynext.issue = getNextIssue;
            notifynext.user = getNextIssue.user;
            const savedissue = yield notifycall.save();
            const updateCounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({ currentNum: issue.queueNo, nextNum: getNextIssue === null || getNextIssue === void 0 ? void 0 : getNextIssue.queueNo })
                .where("id = :cid", { cid: issue.counter })
                .execute();
        }
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isCalled: true })
            .where("id = :id", { id: id })
            .execute();
        return res.json({ message: "successfully updated" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.issueCalled = issueCalled;
const issueDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Issue_1.Issue.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: "issue does not exists" });
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id })
            .execute();
        return res.json({ message: "successfully updated" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.issueDone = issueDone;
const getDoneNextIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id })
            .execute();
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.userId = :user", { user: req.body.userId })
            .getOne();
        console.log(counterRepository);
        const nextcall = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isCalled: true })
            .where("queueNo = :queueNo", { queueNo: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.nextNum })
            .andWhere("counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .execute();
        const nextissue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.queueNo = :queueNo", { queueNo: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.nextNum })
            .andWhere("issue.counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .getOne();
        const nextnum = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .select("MIN(issue.queueNo)", "min")
            .where("issue.counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .andWhere("issue.isCalled = :isCalled", { isCalled: false })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();
        let nextnumber = nextnum.min;
        const current = counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.nextNum;
        if (nextnumber == null) {
            nextnumber = 0;
        }
        console.log(nextnumber);
        console.log(current);
        const counterassign = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder()
            .update(Counter_1.Counter)
            .set({ currentNum: current, nextNum: nextnumber })
            .where("counter.id = :id", { id: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .execute();
        console.log(counterassign);
        res.json(nextissue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDoneNextIssue = getDoneNextIssue;
//# sourceMappingURL=issueController.js.map