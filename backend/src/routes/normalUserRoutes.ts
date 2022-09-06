import {Router}  from "express"
import {genarateQueueNum} from "../middleware/GenerateQueue"
import { createIssue,cancelIssue, getIssueQueueDetails} from "../controllers/issueController"
import { havingIssue } from "../controllers/normalUserController"
import { getNotifications } from "../controllers/notificationController"


const router = Router();


 router.get('/havingissue',havingIssue)

 router.post('/createissue',genarateQueueNum,createIssue)

 router.get('/getissue',getIssueQueueDetails)

 router.delete('/deleteissue',cancelIssue)

 router.get('/getnotifications',getNotifications)

 
export default router;        