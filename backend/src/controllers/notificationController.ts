import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Notification } from "../models/Notification"


export const getNotifications =async (req:Request,res:Response) =>{
    
    try{
        const currentIssue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.userId = :user", {user: req.body.userId})
        .andWhere("issue.isDone = :done", {done : 0})
        .getOne()

        const notificationRepository = await AppDataSource.getRepository(Notification)
        .createQueryBuilder("notification")
        .where("notification.userId = :user", { user: req.body.userId })
        .where("notification.issueId = :issue", { issue: currentIssue?.id})
        .orderBy("notification.id", "DESC")
        .getManyAndCount()
        
        res.json({
            notifications: notificationRepository
        })
 

    } catch (error) {
 
        res.status(500).json({message:error.message})
    }

}
