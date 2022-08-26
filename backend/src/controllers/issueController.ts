import { Request,Response } from "express";
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue";
import { Counter } from "../models/Counter";
import { User } from "../models/User";


export const createissue =async (req:Request,res:Response) =>{
    
    try {
 
        let{name,telephone,email,issue,counter} =req.body
    
        const issues = new Issue();
        issues.name =name
        issues.telephone =telephone
        issues.email =email
        issues.issue =issue
        issues.user =req.body.userId
        issues.counter =counter;
        issues.queueNo=req.body.queueNum;  
    
        const savedissue=await issues.save()
 
        /* const havingissue = await AppDataSource.getRepository(User)
                    .createQueryBuilder()
                    .update(User)
                    .set({ havingissue: true })
                    .where("id = :id", { id: req.body.userId })
                    .execute(); */
 
        res.json(savedissue)
 
    } catch(error) {
 
        res.status(500).json({message:error.message})
    }
     
 }



 export const getissue =async (req:Request,res:Response) =>{
    
    try {
    
        /*console.log(req.body.userId);
        const issue = await Issue.findOneBy({nuser: req.body.userId})
        res.json(issue)
        */
        const issueRepository = await AppDataSource.getRepository(Issue) 
     
        .createQueryBuilder("issue")
        .where("issue.user = :user", { nuser: req.body.userId })
        .andWhere("issue.isDone = :isDone", { isDone: false })
        .getMany();

        res.json(issueRepository.length)

    } catch (error) {
 
        res.status(500).json({message:error.message})
    }
 
 }



 export const deleteissue =async (req:Request,res:Response) =>{
   
    try {

        //const {id}= req.params;

        const result = await Issue.delete({user: req.body.userId})

        if(result.affected ===0){
            return res.status(404).json({ message: "user does not exists"});
        } 

   
       return  res.json({message:"successfully deleted"});
    
 
    } catch (error) {

        return  res.status(500).json({
            message:error.message
        })
        
    }
    
}