
import { Issue } from '../models/Issue';
import {Request,Response,NextFunction} from 'express'
import { AppDataSource } from "../index"
import { Counter } from '../models/Counter';



export const GenarateQueueNum = async (req:Request,res:Response,next:NextFunction) =>{

    try {

        const countissue:number[]=[];
   
        for (let i = 0; i < 3; i++) {
            
           let j=i+2
           const checkcounter = await AppDataSource.getRepository(Counter) 
         
           .createQueryBuilder("counter")
           .where("counter.id = :id", { id: j })
           .getRawOne();
    
            let conline:boolean=checkcounter.counter_isOnline==1
              console.log(conline)

                if(conline){
            
                const checkissues = await AppDataSource.getRepository(Issue) 
                .createQueryBuilder("issue")
                .select("COUNT(issue.id)","count")
                .where("issue.counter = :counter", { counter: j })
                .andWhere("issue.isDone = :isDone", { isDone: false })
                .getRawOne();
                countissue[i]=checkissues.count 
                }
                else{
                    countissue[i]=Infinity
                }
         }

             if((countissue[0]==Infinity && countissue[1]==Infinity && countissue[2]==Infinity))
             {
              return  res.status(500).json({message:'No counter available'})
          
             }
    
        let freequeue:number=0;
            console.log(countissue[0])
            console.log(countissue[1])
            console.log(countissue[2])
            let a:number=countissue[0]
            let b=countissue[1]
            console.log(a<b)
        
             if(countissue[0]<countissue[1] && countissue[0]<countissue[2])
            {
    
                   freequeue=2
            }
            
           else if(countissue[1]<countissue[2] )
            {
    
                   freequeue=3
            }
    
           else
            {
    
                   freequeue=4
            } 
           

          
        
        
         //console.log(freequeue)
    
        const issueRepository = await AppDataSource.getRepository(Issue) 
         
        .createQueryBuilder("issue")
        .select("MAX(issue.queue_num)","max")
        .where("issue.counter = :counter", { counter: freequeue })
        .getRawOne();
    
         if(issueRepository.max==null)
         {
            issueRepository.max =1
         }
         else {
             issueRepository.max+=1;
         }
    
        //res.json(issueRepository.max)
        req.body.queue_num=issueRepository.max
        req.body.counter= freequeue
    
        return next();
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }

   
}