import express from "express"
import Cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server, Socket } from 'socket.io'
import { DataSource } from "typeorm"
import { Role } from "./models/Role"
import { User } from "./models/User"
import { Notification } from "./models/Notification" 
import { Issue } from "./models/Issue"
import { Counter } from "./models/Counter"

dotenv.config()

const app = express()

const server = http.createServer(app)

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
 app.use(express.json())
 app.use(Cors())


 app.get("/", (req,res): void =>{
    const message: string = "Hello World"

    res.json({ message: message })
})


 //initialize
AppDataSource.initialize()
.then(() => {
  console.log('db connected')
  
})

.catch((error) => console.log(error))


server.listen(8000, ()=>{
    console.log('app runing on server 8000')
})