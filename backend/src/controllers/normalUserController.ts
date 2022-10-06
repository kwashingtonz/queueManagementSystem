import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"


export const havingIssue =async (req:Request,res:Response) =>{
    
    try {
     const {id}= req.body.userId
    
     let haveIssue
     const havingissue = await AppDataSource.getRepository(Issue) 
     .createQueryBuilder("issue")
     .loadAllRelationIds()
     .where("userId = :id", { id: req.body.userId })
     .andWhere("isDone = 0")
     .getOne()
     
    if(havingissue){
        haveIssue = 1
    }else{
        haveIssue = 0
    }

     res.json({havingIssue:haveIssue,issue:havingissue})  
 
     } catch (error) {
 
        res.status(500).json({message:error.message})
     }
     
 }