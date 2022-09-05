import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Counter } from "../models/Counter"


export const createissue =async (req:Request,res:Response) =>{
    
    try {
 
        let{name,telephone,email,issue,counter,userId,queueNo} =req.body
    
        const issues = new Issue()
        issues.name = name
        issues.telephone = telephone
        issues.email = email
        issues.issue = issue
        issues.user = userId
        issues.counter = counter
        issues.queueNo = queueNo  
    
        const savedissue = await issues.save()
 
        res.json(savedissue)
 
    } catch(error) {
 
        res.status(500).json({message:error.message})
    }
     
 }



 export const getissue =async (req:Request,res:Response) =>{
    
    try {
    
        const issueRepository = await AppDataSource.getRepository(Issue) 
        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("issue.user = :user", { user: req.body.userId })
        .andWhere("issue.isDone = :isDone", { isDone: false })
        .getOne()

        const counterDetails = await AppDataSource.getRepository(Counter)
        .createQueryBuilder("counter")
        .where("counter.id = :counter", {counter: issueRepository?.counter})
        .getOne()

        console.log(counterDetails)

        if(issueRepository?.queueNo == counterDetails?.nextNum)
        {
            res.json({
                counterNo: counterDetails?.id,
                message: "You're Next"
            })
        }else{
            res.json({
                counterNo: counterDetails?.id,
                currentNo: counterDetails?.currentNum,
                nextNo: counterDetails?.nextNum,
                myNo: issueRepository?.queueNo
            })
        } 

    } catch (error) {
 
        res.status(500).json({message:error.message})
    }
 
 }



 export const deleteissue =async (req:Request,res:Response) =>{
   
    try {

        const result = await Issue.delete({user: req.body.userId})

        if(result.affected ===0){
            return res.status(404).json({ message: "user does not exists"})
        } 
        
        res.cookie('jwt','',{ maxAge: 1 })

        req.body.userId = null

       return  res.json({message:"successfully deleted and logged out"})
    
 
    } catch (error) {

        return  res.status(500).json({
            message:error.message
        })
        
    }
    
}



export const getcounterissues =async (req:Request,res:Response) =>{
    
    const page: number = parseInt(req.query.page as any) || 1
    const perPage = 5
    const skip = (page-1) * perPage

    try{
        
        const counterRepository = await AppDataSource.getRepository(Counter) 
     
        .createQueryBuilder("counter")
        .where("counter.user = :user", { user: req.body.userId })
        .getRawOne()
          
        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.counter = :counter", { counter: counterRepository.counter_id })
        .andWhere("issue.isDone = :isDone", { isDone: false })
        .orderBy("issue.queueNo", "ASC")
        .limit(perPage)
        .offset(skip)
        .getManyAndCount()
        

        res.json({
            issues:issueRepository[0],
            page: page,
            totalIssues: issueRepository[1],
            lastPage: Math.ceil(issueRepository[1]/perPage)
        })
 

    } catch (error) {
 
        res.status(500).json({message:error.message})
    }

}



export const getsingleissue =async (req:Request,res:Response) =>{
    
    try {
  
        const {id}= req.params
        
        const issueRepository = await AppDataSource.getRepository(Issue) 
        .createQueryBuilder("issue")
        .where("issue.id = :id", { id: parseInt(id) })
        .getOne()
 
        res.json(issueRepository)
 
    } catch (error) {
        
        res.status(500).json({message:error.message})
    
    }
 
}



export const issuecalled =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params;
        
        const issue = await  AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("issue.id = :id", { id:  parseInt(req.params.id) })
        .getOne()

        if(!issue)  return res.status(404).json({ message: "issue does not exists"})

        const getNextIssue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.queueNo > :qN", {qN : issue.queueNo})
        .andWhere("issue.isCalled = :called",{called : false})
        .andWhere("issue.isDone = :done",{done : false})
        .andWhere("issue.counterId = :counter",{counter : issue.counter})
        .getOne()

        if(!getNextIssue){
            const updateCounter = await AppDataSource.getRepository(Counter)
            .createQueryBuilder()
            .update(Counter)
            .set({currentNum: issue.queueNo, nextNum: 0 })
            .where("id = :cid",{cid: issue.counter})
            .execute()
        }else{
            const updateCounter = await AppDataSource.getRepository(Counter)
            .createQueryBuilder()
            .update(Counter)
            .set({currentNum: issue.queueNo, nextNum:getNextIssue?.queueNo })
            .where("id = :cid",{cid: issue.counter})
            .execute()
        }

        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("id = :id", { id: id })
        .execute()

        return res.json({message:"successfully updated"})

     } catch (error) {
 
       return res.status(500).json({message:error.message})

     }
     
}



export const issuedone =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params
        //req.body.isCalled="true";
        const user = await Issue.findOneBy({id: parseInt(req.params.id)})

        if(!user)  return res.status(404).json({ message: "issue does not exists"})

        
        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isDone: true })
        .where("id = :id", { id: id })
        .execute()

        return res.json({message:"successfully updated"})

    } catch (error) {
 
       return res.status(500).json({message:error.message})
     
    }

}



export const getnextissue =async (req:Request,res:Response) =>{
    
    try {
 
        const {id}= req.params;
         
        const issueRepository = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isDone: true })
        .where("id = :id", { id: id })
        .execute()
 
 
        const counterRepository = await AppDataSource.getRepository(Counter)            
        .createQueryBuilder("counter")
        .where("counter.user = :user", { user: req.body.userId })       
        .getRawOne()
 
        const nextcall = await AppDataSource.getRepository(Issue)             
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("queueNo = :queueNo", { queueNo: counterRepository.counter_nextNum})
        .andWhere("counter = :counter", { counter:counterRepository.counter_id })
        .execute()
        
        
        const nextissue = await AppDataSource.getRepository(Issue)
                
        .createQueryBuilder("issue")
        .where("issue.queueNo = :queueNo", { queueNo:counterRepository.counter_nextNum })
        .andWhere("issue.counter = :counter", { counter:counterRepository.counter_id })
        .getOne()
                
        console.log(nextissue)
 
                
        const nextnum = await AppDataSource.getRepository(Issue)
                
        .createQueryBuilder("issue")
        .select("MIN(issue.queueNo)","min")
        .where("issue.counter = :counter", { counter:counterRepository.counter_id })
        .andWhere("issue.isCalled = :isCalled", { isCalled: false })
        .andWhere("issue.isDone = :isDone", { isDone: false }) 
        .getRawOne()
                
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
        .execute()
                
        console.log(counterassign)
             
        res.json(nextissue)
        
     } catch (error) {
 
        res.status(500).json({message:error.message})

     }
      
}




