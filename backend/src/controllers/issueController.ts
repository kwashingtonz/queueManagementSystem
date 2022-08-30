import { Request,Response } from "express";
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue";
import { Counter } from "../models/Counter";


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



export const getcounterissues =async (req:Request,res:Response) =>{
    
    try{
        
        const counterRepository = await AppDataSource.getRepository(Counter) 
     
        .createQueryBuilder("counter")
        .where("counter.user = :user", { user: req.body.userId })
        .getRawOne();

        console.log(counterRepository.counter_id)

          
        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.counter = :counter", { counter: counterRepository.counter_id })
        .andWhere("issue.isDone = :isDone", { isDone: false })
        .orderBy("issue.queueNo", "ASC")
        .getMany();
        
        res.json(issueRepository)
 

    } catch (error) {
 
        res.status(500).json({message:error.message})
    }

}



export const getsingleissue =async (req:Request,res:Response) =>{
    
    try {
    
        /*console.log(req.body.userId);
        const issue = await Issue.findOneBy({nuser: req.body.userId})
        res.json(issue)
        */ 
  
        const {id}= req.params
        
        const issueRepository = await AppDataSource.getRepository(Issue) 
     
        .createQueryBuilder("issue")
        .where("issue.id = :id", { id: parseInt(id) })
        .getOne();
 
        res.json(issueRepository)
 
    } catch (error) {
        
        res.status(500).json({message:error.message})
    
    }
 
}



export const issuecalled =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params;
        //req.body.isCalled="true";
        const user = await Issue.findOneBy({id: parseInt(req.params.id)})

        if(!user)  return res.status(404).json({ message: "issue does not exists"});

        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("id = :id", { id: id })
        .execute();

        return res.json({message:"successfully updated"});

     } catch (error) {
 
       return res.status(500).json({message:error.message})

     }
     
}



export const issuedone =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params;
        //req.body.isCalled="true";
        const user = await Issue.findOneBy({id: parseInt(req.params.id)})

        if(!user)  return res.status(404).json({ message: "issue does not exists"});

        
        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isDone: true })
        .where("id = :id", { id: id })
        .execute();

        return res.json({message:"successfully updated"});

    } catch (error) {
 
       return res.status(500).json({message:error.message})
     
    }

}



export const getnextissue =async (req:Request,res:Response) =>{
    
    try {
 
        const {id}= req.params;
        //req.body.isCalled="true";
 
         
        const issueRepository = await AppDataSource.getRepository(Issue)
        
        .createQueryBuilder()
        .update(Issue)
        .set({ isDone: true })
        .where("id = :id", { id: id })
        .execute();
 
        console.log(id)
        console.log(req.body.userId)
 
        const counterRepository = await AppDataSource.getRepository(Counter) 
                
        .createQueryBuilder("counter")
        .where("counter.user = :user", { user: req.body.userId })       
        .getRawOne();
                
        console.log(counterRepository.counter_next_num)
        //res.json(counterRepository.counter_id)
 
        const doiscalled = await AppDataSource.getRepository(Issue)
                 
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("queueNo = :queueNo", { queueNo: counterRepository.counter_nextNum})
        .andWhere("counter = :counter", { counter:counterRepository.counter_id })
        .execute();
        
        console.log(doiscalled)
        
        const nextissue = await AppDataSource.getRepository(Issue)
                
        .createQueryBuilder("issue")
        .where("issue.queueNo = :queueNo", { queueNo:counterRepository.counter_nextNum })
        .andWhere("issue.counter = :counter", { counter:counterRepository.counter_id })
        .getOne();
                
        console.log(nextissue)
 
                
        const nextnum = await AppDataSource.getRepository(Issue)
                
        .createQueryBuilder("issue")
        .select("MIN(issue.queueNo)","min")
        .where("issue.counter = :counter", { counter:counterRepository.counter_id })
        .andWhere("issue.isCalled = :isCalled", { isCalled: false })
        .andWhere("issue.isDone = :isDone", { isDone: false }) 
        .getRawOne();
                
        let nextnum1=nextnum.min
        const current =counterRepository.counter_next_num
 
        if(nextnum1==null){
            nextnum1=0
        }
        
        console.log(nextnum1)
        console.log(current)
 
        const counterassign = await AppDataSource.getRepository(Counter) 
        
        .createQueryBuilder()
        .update(Counter)
        .set({ currentNum:current, nextNum:nextnum1})
        .where("counter.id = :id", { id: counterRepository.counter_id })
        .execute();
                
        console.log(counterassign)
             
        res.json(nextissue)
        
     } catch (error) {
 
        res.status(500).json({message:error.message})

     }
      
}



export const nextissuecalled =async (req:Request,res:Response) =>{
    
    try {
      
        const counterRepository = await AppDataSource.getRepository(Counter) 
        .createQueryBuilder("counter")
        .where("counter.cuser = :cuser", { cuser: req.body.userId })
        .getRawOne();
        console.log(counterRepository.counter_id)
        //res.json(counterRepository.counter_id)
        
        const nextnum = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .select("MIN(issue.queue_num)","min")
        .where("issue.counter = :counter", { counter:counterRepository.counter_id })
        .andWhere("issue.isCalled = :isCalled", { isCalled: false })
        .andWhere("issue.isDone = :isDone", { isDone: false }) 
        .getRawOne();
        let nextnum1=nextnum.min
        const current =parseInt(req.params.id)

        if(nextnum1==null){
            nextnum1=0
        }
   
        const counterassign = await AppDataSource.getRepository(Counter) 
        .createQueryBuilder()
        .update(Counter)
        .set({ currentNum:current, nextNum:nextnum1})
        .where("counter.id = :id", { id: counterRepository.counter_id })
        .execute();

        res.json(counterassign)

     } catch (error) {
 
        res.status(500).json({message:error.message})

     }
     
}
