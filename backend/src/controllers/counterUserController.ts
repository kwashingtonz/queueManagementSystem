import { Request,Response } from "express";
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue";
import { Counter } from "../models/Counter";
import { User } from "../models/User";

export const counterclose =async (req:Request,res:Response) =>{
    
    try {
     
       
        const counterRepository = await AppDataSource.getRepository(Counter) 
         
        .createQueryBuilder("counter")
        .update(Counter)
        .set({ isOnline: false })
        .where("counter.user = :user", { user: req.body.userId })
        .execute();
 
               
        res.json({message:"Counter closed"});
     
    
        } catch (error) {
     
            res.status(500).json({message:error.message})

        }

 }