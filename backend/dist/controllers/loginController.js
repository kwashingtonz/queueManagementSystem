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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Counter_1 = require("../models/Counter");
const Issue_1 = require("../models/Issue");
const index_1 = require("../index");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = yield req.body;
        const user = yield User_1.User.findOne({ where: { username: username }, relations: ['role'] });
        if (!user)
            return res.status(400).json('username or password is wrong');
        const correctPassword = yield user.validatePassword(password);
        if (!correctPassword)
            return res.status(400).json('invalid password');
        const role = user.role.id;
        if (role == 1) {
            const counterinfo = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder("counter")
                .where("counter.user = :user", { user: user.id })
                .getMany();
            console.log(counterinfo[0].id);
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN_SECRET || 'tokentest');
            return res.json({ 'accessToken': token, 'counterinfo': counterinfo });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN_SECRECT || 'tokentest');
            const issue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
                .createQueryBuilder("issue")
                .where("issue.user = :user", { user: user.id })
                .andWhere("issue.isDone = :isDone", { isDone: false })
                .getRawOne();
            console.log(issue);
            if (issue) {
                const counter = issue.issue_counterId;
                const queue_num = issue.issue_counterid;
                console.log(queue_num);
                return res.json({ 'accessToken': token, 'counter': issue.issue_counterId, 'queue_num': issue.issue_queue_num });
            }
            return res.json({ 'accessToken': token });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.loginUser = loginUser;
//# sourceMappingURL=loginController.js.map