import { Request,response,Response } from "express"
import { User } from "../models/User"
import jwt from "jsonwebtoken"
import { Counter } from "../models/Counter"
import { Issue } from "../models/Issue"
import { AppDataSource } from "../index"



export const loginUser =async (req:Request,res:Response) =>{
   
    try {
       const{username,password} = await req.body

       const user = await User.findOne({where:{username:username},relations:['role']})
       if(!user) return res.status(400).json('username or password is wrong')
 
       const correctPassword: boolean =await user.validatePassword(password)
       if(!correctPassword) return res.status(400).json('invalid password')
    
       const role = user.role.id
  
        if(role == 1){
             //counter info
            const counterinfo = await AppDataSource.getRepository(Counter) 
            .createQueryBuilder("counter")
            .where("counter.user = :user", { user: user.id })
            .andWhere("counter.isOnline = :online", { online: 0 })
            .getOne()
            

            if(!counterinfo){

                const newcounter = await AppDataSource.getRepository(Counter) 
                .createQueryBuilder("counter")
                .where("counter.isOnline = :online", { online: 0 })
                .getOne()

                if(!newcounter) return res.status(501).json({'message': 'no counters available'})

                const updateCounter = await AppDataSource
                .createQueryBuilder()
                .update(Counter)
                .set({
                    user : user,
                    isOnline : true
                    })
                .where("id = :counter", {counter: newcounter.id})
                .execute()
 
                newcounter.isOnline=true

                const token= jwt.sign({id :user.id }, process.env.TOKEN_SECRET|| 'tokentest')

                res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})

                req.body.counterId = newcounter.id

                return res.json({'accessToken':token,'roleType':'counterUser','counterinfo':newcounter})

            }else{

                 const updateCounter = await AppDataSource
                .createQueryBuilder()
                .update(Counter)
                .set({
                     user:user,
                     isOnline : true
                    })
                .where("id = :counter", {counter: counterinfo.id})
                .execute()

                counterinfo.isOnline=true
 
                const token= jwt.sign({id :user.id }, process.env.TOKEN_SECRET|| 'tokentest')

                res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})

                req.body.counterId = counterinfo.id

                return res.json({'accessToken':token,'roleType':'counterUser','counterinfo':counterinfo})
            
            }
        
        }else{
            
            //token
            const token= jwt.sign({id :user.id }, process.env.TOKEN_SECRECT|| 'tokentest')
       
            //issue info
            const issue = await AppDataSource.getRepository(Issue) 
     
            .createQueryBuilder("issue")
            .where("issue.user = :user", { user: user.id })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne()

            console.log(issue)
            if(issue){
                const queue_num=issue.issue_counterId
                console.log(queue_num)
                res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})
                return res.json({'accessToken':token,'roleType':'normalUser','counter':issue.issue_counterId,'queue_num':issue.issue_queueNo})
            }

            res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})
            return res.json({'accessToken':token,'roleType':'normalUser'})
   
        }    
 
    } catch (error) {
 
        return  res.status(500).json({
            message:error.message
        })
    }
    
 }