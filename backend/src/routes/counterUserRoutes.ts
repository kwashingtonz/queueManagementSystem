import {Router}  from "express"
import {getCounterIssues, getSingleIssue, issueCalled, issueDone, getDoneNextIssue} from "../controllers/issueController"
import {counterClose} from "../controllers/counterUserController"


const router = Router();


router.get('/getCounterIssues',getCounterIssues)

router.put('/issueCalled/:id',issueCalled)

router.get('/issue/:id',getSingleIssue)

router.get('/issueDone/:id',issueDone)

router.put('/getDoneNextIssue/:id',getDoneNextIssue)

router.get('/counterClose',counterClose)


export default router;        