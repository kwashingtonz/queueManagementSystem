import {Router}  from "express"
import {getcounterissues, getsingleissue, issuecalled, issuedone, getnextissue, nextissuecalled} from "../controllers/issueController"
import {counterclose} from "../controllers/counterUserController"


const router = Router();


router.get('/getcounterissues',getcounterissues)

router.put('/issuecalled/:id',issuecalled)//call

router.get('/issue/:id',getsingleissue)

router.get('/issuedone/:id',issuedone)

router.put('/nextissuecalled/:id',nextissuecalled)//recall

router.put('/getnextissue/:id',getnextissue)//done and next issue

router.get('/counterclose',counterclose)


export default router;        