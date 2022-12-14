"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Issue_1 = require("./Issue");
let Counter = class Counter extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Counter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Counter.prototype, "counterNum", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Counter.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Counter.prototype, "currentNum", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Counter.prototype, "nextNum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.counters),
    __metadata("design:type", User_1.User)
], Counter.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Issue_1.Issue, (issue) => issue.counter),
    __metadata("design:type", Array)
], Counter.prototype, "issues", void 0);
Counter = __decorate([
    (0, typeorm_1.Entity)()
], Counter);
exports.Counter = Counter;
//# sourceMappingURL=Counter.js.map