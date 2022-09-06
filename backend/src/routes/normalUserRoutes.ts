import {Router}  from "express"
import {genarateQueueNum} from "../middleware/GenerateQueue"
import { createIssue,cancelIssue, getIssueQueueDetails} from "../controllers/issueController"
import { havingIssue } from "../controllers/normalUserController"
import { getNotifications } from "../controllers/notificationController"


const router = Router();


 router.get('/havingIssue',havingIssue)

 router.post('/createIssue',genarateQueueNum,createIssue)

 router.get('/getQueueDetails',getIssueQueueDetails)

 router.delete('/cancelIssue',cancelIssue)

 router.get('/getNotifications',getNotifications)

 
export default router;        