import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Counter } from "../models/Counter"
import { Notification } from "../models/Notification"


export const createIssue =async (req:Request,res:Response) =>{
    
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



 export const getIssueQueueDetails =async (req:Request,res:Response) =>{
    
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



 export const cancelIssue =async (req:Request,res:Response) =>{
   
    try {

        const result = await Issue.delete({user: req.body.userId})

        if(result.affected ===0){
            return res.status(404).json({ message: "user does not exists"})
        } 
        
        res.cookie('jwt','',{ maxAge: 1 })

        req.body.userId = null

       return  res.json({message:"deleted"})
    
 
    } catch (error) {

        return  res.status(500).json({
            message:error.message
        })
        
    }
    
}



export const getCounterIssues =async (req:Request,res:Response) =>{
    
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



export const getSingleIssue =async (req:Request,res:Response) =>{
    
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



export const issueCalled =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params;
        
        const issue = await  AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("issue.id = :id", { id:  parseInt(req.params.id) })
        .getOne()

        if(!issue)  return res.status(404).json({ message: "issue does not exists"})

        const notifycall = new Notification()
        notifycall.message = "Please proceed to the Counter "+issue.counter+" now"
        notifycall.issue = issue
        notifycall.user = issue.user
    
        const savedissue = await notifycall.save()

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
            const notifynext = new Notification()
            notifynext.message = "Please proceed to the Counter "+getNextIssue.counter+" now"
            notifynext.issue = getNextIssue
            notifynext.user = getNextIssue.user
        
            const savedissue = await notifycall.save()

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



export const issueDone =async (req:Request,res:Response) =>{
    
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



export const getDoneNextIssue =async (req:Request,res:Response) =>{
    
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
        .where("counter.userId = :user", { user: req.body.userId })       
        .getOne()

        console.log(counterRepository)
 
        const nextcall = await AppDataSource.getRepository(Issue)             
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("queueNo = :queueNo", { queueNo: counterRepository?.nextNum})
        .andWhere("counterId = :counter", { counter:counterRepository?.id})
        .execute()
        
        
        const nextissue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.queueNo = :queueNo", { queueNo:counterRepository?.nextNum })
        .andWhere("issue.counterId = :counter", { counter:counterRepository?.id })
        .getOne()
                
                
        const nextnum = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .select("MIN(issue.queueNo)","min")
        .where("issue.counterId = :counter", { counter:counterRepository?.id})
        .andWhere("issue.isCalled = :isCalled", { isCalled: false })
        .andWhere("issue.isDone = :isDone", { isDone: false }) 
        .getRawOne()
                
        let nextnumber=nextnum.min
        const current =counterRepository?.nextNum
 
        if(nextnumber==null){
            nextnumber=0
        }
        
        console.log(nextnumber)
        console.log(current)
 
        const counterassign = await AppDataSource.getRepository(Counter)
        .createQueryBuilder()
        .update(Counter)
        .set({ currentNum:current, nextNum:nextnumber})
        .where("counter.id = :id", { id: counterRepository?.id })
        .execute()
                
        console.log(counterassign)
             
        res.json(nextissue)
        
     } catch (error) {
 
        res.status(500).json({message:error.message})

     }
      
}




