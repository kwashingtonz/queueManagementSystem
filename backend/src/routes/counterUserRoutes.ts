import {Router}  from "express"
import {getCounterIssues, getSingleIssue, issueCalled, issueDone, getDoneNextIssue} from "../controllers/issueController"
import {counterClose} from "../controllers/counterUserController"


const router = Router();


router.get('/getcounterissues',getCounterIssues)

router.put('/issuecalled/:id',issueCalled)

router.get('/issue/:id',getSingleIssue)

router.get('/issuedone/:id',issueDone)

router.put('/getnextissue/:id',getDoneNextIssue)

router.get('/counterclose',counterClose)


export default router;        