import "reflect-metadata"
import http from 'http'
import express from "express"
import Cors from 'cors'
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Role } from "./models/Role"
import { User } from "./models/User"
import { Notification } from "./models/Notification" 
import { Issue } from "./models/Issue"
import { Counter } from "./models/Counter"
import loginRouter from "./routes/loginRoute"
import counterUserRouter from "./routes/counterUserRoutes"
import normalUserRouter from "./routes/normalUserRoutes"
import { ValidateToken } from "./middleware/verifyJWT"
import { Server } from 'socket.io'
import {getcurrentnext2,getcurrentnext3,getcurrentnext4} from './controllers/counterUserController'



dotenv.config()

const app = express()

const server = http.createServer(app)


//typeorm db config
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "queueapp_db",
    entities: [Role,User,Notification,Issue,Counter],
    synchronize: true,
    logging: false,
})


 //middleware
 app.use(Cors())
 app.use(express.json())
 app.use(express.urlencoded({extended: true}))

 //routes

//login router
app.use('/', loginRouter)
//counteruser routes
app.use('/cuser',ValidateToken,counterUserRouter)
//normaluser routes
app.use('/nuser',ValidateToken,normalUserRouter)


 //initialize
AppDataSource.initialize()
.then(() => {
  console.log('db connected and synched')
})
.catch((error) => console.log(error))

//socket.io
export const io = new Server(server,{cors: {origin:"http://localhost:3000"}})

let onlineUsers:any = []

const addNewUser = (username:any, socketId:any) => {
  !onlineUsers.some((user:any) => user.username === username) &&
    onlineUsers.push({ username, socketId })
}

const getUser = (username:any) => {
 return onlineUsers.find((user:any) => user.username === username)
}

    io.on("connection",(socket)=>{
     
        //add new user
        socket.on("newUser", (username) => {
            addNewUser(username, socket.id)
        })
        console.log('online users',onlineUsers)


        //remove user
        const removeUser = (socketId:any) => {
        onlineUsers = onlineUsers.filter((user:any) => user.socketId !== socketId)
        }

        //send notifications
        socket.on("sendNotification", ({ receiverName, type,id }) => {
            const receiver = getUser(receiverName)
            console.log(getUser(receiverName))
      
            io.to(receiver.socketId).emit("getNotification", {
                id,
                type
            })
        })


        //setInterval
        setInterval(function(){
      
            getcurrentnext2().then((Counter) => {
                io.emit('getqueuenum1', Counter)            
            })
  
            getcurrentnext3().then((Counter) => {
                io.emit('getqueuenum2', Counter)            
            })
  
            getcurrentnext4().then((Counter) => {
                io.emit('getqueuenum3', Counter)           
            })
            
        }, 1000) 
        
        socket.on('disconnect',()=>{
            removeUser(socket.id);
        })

    })


//running server
server.listen(8000, ()=>{
    console.log('app runing on server 8000')
})