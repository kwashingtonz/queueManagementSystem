import {Router}  from "express"
import {GenarateQueueNum} from "../middleware/GenerateQueue"
import { createissue,getissue,deleteissue} from "../controllers/issueController"
import { havingissue } from "../controllers/normalUserController"
import { getNotifications } from "../controllers/notificationController"


const router = Router();


 router.get('/havingissue',havingissue)

 router.post('/createissue',GenarateQueueNum,createissue)

 router.get('/getissue',getissue)

 router.delete('/deleteissue',deleteissue)

 router.get('/getnotifications',getNotifications)

 
export default router;        