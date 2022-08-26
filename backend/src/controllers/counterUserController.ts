import { Request,Response } from "express";
import { AppDataSource } from "../index"
import { Counter } from "../models/Counter";


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



export const getcurrentnext2 =async (): Promise<Counter[]> =>{
    
    try {
        const issueRepository = await AppDataSource.getRepository(Counter) 
    
        .createQueryBuilder("counter")
        .where("counter.id = :id", { id: 2 })
        .getRawOne();
        
        return(issueRepository)

    } catch (error) {

        return[]

    }
  
}



export const getcurrentnext3 =async (): Promise<Counter[]> =>{
    
    try {
        const issueRepository = await AppDataSource.getRepository(Counter) 
    
        .createQueryBuilder("counter")
        .where("counter.id = :id", { id: 3 })
        .getRawOne();
        
        return(issueRepository)

    } catch (error) {

      return[]

    }

}



export const getcurrentnext4 =async (): Promise<Counter[]> =>{
    
    try {
        const issueRepository = await AppDataSource.getRepository(Counter) 
    
        .createQueryBuilder("counter")
        .where("counter.id = :id", { id: 4 })
        .getRawOne();
        
        return(issueRepository)

    } catch (error) {

      return[]

    }
    
}