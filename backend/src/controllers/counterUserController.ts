import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Counter } from "../models/Counter"
import { Issue } from "../models/Issue"


export const counterClose =async (req:Request,res:Response) =>{
    
    try {

        const userIdentity = req.body.userId
       
        const skipcounter = await AppDataSource.getRepository(Counter) 
        .createQueryBuilder("counter")
        .where("counter.userId = :id", { id: userIdentity })
        .getOne()


        const onlineavail = await AppDataSource.getRepository(Counter) 
        .createQueryBuilder("counter")
        .select("COUNT(counter.id)","count")
        .where("isOnline = :online", { online: true })
        .getRawOne()

        console.log(onlineavail.count)

        if(onlineavail.count>1){
            const counterRepository = await AppDataSource.getRepository(Counter)     
            .createQueryBuilder("counter")
            .update(Counter)
            .set({ isOnline: false, currentNum: 0, nextNum: 1 })
            .where("counter.userId = :user", { user: userIdentity })
            .execute()

            let countissue:number[]=[]
   
            for (let i = 1; i <=3 ; i++) {
                
            const checkcounter = await AppDataSource.getRepository(Counter) 
            .createQueryBuilder("counter")
            .where("id = :id", { id: i })
            .getOne()
        
                let conline : boolean = checkcounter!.isOnline

                if(conline){

                    const checkissues = await AppDataSource.getRepository(Issue) 
                    .createQueryBuilder("issue")
                    .select("COUNT(issue.id)","count")
                    .where("issue.counter = :counter", { counter: i })
                    .andWhere("issue.isDone = :isDone", { isDone: false })
                    .getRawOne()

                    countissue[i-1]=checkissues.count 
                    
                }else{
                    countissue[i-1]=Infinity
                }
            }
        
            let freequeue:number=0;

            let a: number = countissue[0]
            let b: number = countissue[1]
            let c: number = countissue[2] 

            if((a==Infinity && b==Infinity && c==Infinity)){
                return  res.status(500).json({message:'No counter available'})
            }
    
            if(a<=b && a<=c)
            {    
                freequeue=1
            }else if(b<=c){
                freequeue=2
            }else{
                freequeue=3
            }       

            const freeCounter = await Counter.findOne({where:{id: freequeue}})
            

            const changingIssues = await AppDataSource.getRepository(Issue)
            .createQueryBuilder("issue")
            .where("issue.counterId = :id",{id: skipcounter?.id})
            .andWhere("issue.isDone = :done",{done: false})
            .getManyAndCount()

            console.log(changingIssues)
            
            for(let n=0; n< changingIssues[1];n++){
            
                let issueIdentity = changingIssues[0][n].id

                const issueRepository = await AppDataSource.getRepository(Issue) 
                .createQueryBuilder("issue")
                .select("MAX(issue.queueNo)","max")
                .where("issue.counter = :counter", { counter: freequeue })
                .getRawOne()
            
                if(issueRepository.max==null){
                    issueRepository.max =1
                }else{
                    issueRepository.max+=1;
                } 
                
                const updateIssue = await AppDataSource.getRepository(Issue)
                .createQueryBuilder("issue")
                .update(Issue)
                .set({queueNo: issueRepository.max, counter: freeCounter! })
                .where("issue.id = :isId",{isId : issueIdentity})
                .execute()

            }

            const remDoneIssues = await AppDataSource.getRepository(Issue)
            .createQueryBuilder()
            .delete()
            .from(Issue)
            .where("issue.counterId = :id", {id: skipcounter?.id})
            .andWhere("issue.isDone = :done", {done: true})
            .execute()
                
            return res.json({message:"closed"})

        }else{

            const havingCounterIssues = await AppDataSource.getRepository(Issue)
            .createQueryBuilder("issue")
            .select("COUNT(issue.id)","count")
            .where("issue.counterId = :id",{id: skipcounter?.id})
            .andWhere("issue.isDone = :done",{done: false})
            .getRawOne()

            if(havingCounterIssues.count<1){
                const counterRepository = await AppDataSource.getRepository(Counter)     
                .createQueryBuilder("counter")
                .update(Counter)
                .set({ isOnline: false, currentNum: 0, nextNum: 1 })
                .where("counter.userId = :user", { user: userIdentity })
                .execute()

                const remDoneIssues = await AppDataSource.getRepository(Issue)
                .createQueryBuilder()
                .delete()
                .from(Issue)
                .where("issue.counterId = :id", {id: skipcounter?.id})
                .andWhere("issue.isDone = :done", {done: true})
                .execute()

                return res.json({message:"closed"})
            }else{
                return  res.status(500).json({message:'No counter available'})
            }
    
        }
    
    } catch (error) {
     
         return res.status(500).json({message:error.message})

    }

}



export const getcurrentnext1 =async (): Promise<Counter[]> =>{
    
    try {
        const issueRepository = await AppDataSource.getRepository(Counter) 
    
        .createQueryBuilder("counter")
        .where("counter.id = :id", { id: 1 })
        .getRawOne();
        
        return(issueRepository)

    } catch (error) {

        return[]

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
        .getRawOne()
        
        return(issueRepository)

    } catch (error) {

      return[]

    }
    
}