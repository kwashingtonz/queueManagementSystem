import {Router}  from "express"
import {getcounterissues, getsingleissue, issuecalled, issuedone, getnextissue} from "../controllers/issueController"
import {counterclose} from "../controllers/counterUserController"


const router = Router();


router.get('/getcounterissues',getcounterissues)

router.put('/issuecalled/:id',issuecalled)

router.get('/issue/:id',getsingleissue)

router.get('/issuedone/:id',issuedone)

router.put('/getnextissue/:id',getnextissue)

router.get('/counterclose',counterclose)


export default router;        