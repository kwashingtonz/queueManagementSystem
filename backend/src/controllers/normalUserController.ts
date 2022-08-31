import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"


export const havingissue =async (req:Request,res:Response) =>{
    
    try {
     const {id}= req.body.userId
     console.log(req.body.userId)
     let haveIssue
     const havingissue = await AppDataSource.getRepository(Issue) 
     .createQueryBuilder("issue")
     .where("userId = :id", { id: req.body.userId })
     .getOne()
     
    if(havingissue){
        haveIssue = true
    }else{
        haveIssue = false
    }

     res.json({'havingIssue': haveIssue})  
 
     } catch (error) {
 
        res.status(500).json({message:error.message})
     }
     
 }