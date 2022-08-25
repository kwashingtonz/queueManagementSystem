"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controllers/loginController");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).json({ success: "Login Page loaded" });
});
router.post('/', loginController_1.loginUser);
exports.default = router;
//# sourceMappingURL=loginRoute.js.map