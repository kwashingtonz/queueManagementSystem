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
exports.counterclose = void 0;
const index_1 = require("../index");
const Counter_1 = require("../models/Counter");
const counterclose = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .update(Counter_1.Counter)
            .set({ isOnline: false })
            .where("counter.user = :user", { user: req.body.userId })
            .execute();
        res.json({ message: "Counter closed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.counterclose = counterclose;
//# sourceMappingURL=counterUserController.js.map