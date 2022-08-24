import express from "express"
import Cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server, Socket } from 'socket.io'

dotenv.config()

const app = express()

const server = http.createServer(app)


 //middleware
 app.use(express.json())
 app.use(Cors())


app.get("/", (req,res): void =>{
    const message: string = "Hello World"

    res.json({ message: message })
})


server.listen(8000, ()=>{
    console.log('app runing on server 8000')
})