import {Router}  from "express"
import {GenarateQueueNum} from "../middleware/GenerateQueue"
import { createissue,getissue,deleteissue} from "../controllers/issueController"
import { havingissue } from "../controllers/normalUserController"


const router = Router();


 router.post('/createissue',GenarateQueueNum,createissue)

 router.post('/havingissue',havingissue)

 router.post('/getissue',getissue)

 router.delete('/deleteissue',deleteissue)

 
export default router;        