"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.AppDataSource = void 0;
require("reflect-metadata");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const Role_1 = require("./models/Role");
const User_1 = require("./models/User");
const Notification_1 = require("./models/Notification");
const Issue_1 = require("./models/Issue");
const Counter_1 = require("./models/Counter");
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const counterUserRoutes_1 = __importDefault(require("./routes/counterUserRoutes"));
const normalUserRoutes_1 = __importDefault(require("./routes/normalUserRoutes"));
const verifyJWT_1 = require("./middleware/verifyJWT");
const socket_io_1 = require("socket.io");
const counterUserController_1 = require("./controllers/counterUserController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "queueapp_db",
    entities: [Role_1.Role, User_1.User, Notification_1.Notification, Issue_1.Issue, Counter_1.Counter],
    synchronize: true,
    logging: false,
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', loginRoute_1.default);
app.use('/cuser', verifyJWT_1.ValidateToken, counterUserRoutes_1.default);
app.use('/nuser', verifyJWT_1.ValidateToken, normalUserRoutes_1.default);
exports.AppDataSource.initialize()
    .then(() => {
    console.log('db connected and synched');
})
    .catch((error) => console.log(error));
exports.io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:3000" } });
let onlineUsers = [];
const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
        onlineUsers.push({ username, socketId });
};
const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
};
exports.io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
    });
    console.log('online users', onlineUsers);
    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };
    socket.on("sendNotification", ({ receiverName, type, id }) => {
        const receiver = getUser(receiverName);
        console.log(getUser(receiverName));
        exports.io.to(receiver.socketId).emit("getNotification", {
            id,
            type
        });
    });
    setInterval(function () {
        (0, counterUserController_1.getcurrentnext2)().then((Counter) => {
            exports.io.emit('getqueuenum1', Counter);
        });
        (0, counterUserController_1.getcurrentnext3)().then((Counter) => {
            exports.io.emit('getqueuenum2', Counter);
        });
        (0, counterUserController_1.getcurrentnext4)().then((Counter) => {
            exports.io.emit('getqueuenum3', Counter);
        });
    }, 1000);
    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});
server.listen(8000, () => {
    console.log('app runing on server 8000');
});
//# sourceMappingURL=index.js.map