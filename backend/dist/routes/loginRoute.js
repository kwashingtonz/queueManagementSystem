"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controllers/loginController");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ success: "Login Page loaded", status: 200 });
});
router.post('/', loginController_1.loginUser);
exports.default = router;
//# sourceMappingURL=loginRoute.js.map