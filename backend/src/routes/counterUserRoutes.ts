import {Router}  from "express";
import {getcounterissues, getsingleissue, issuecalled, issuedone, getnextissue, nextissuecalled} from "../controllers/issueController"
import {counterclose} from "../controllers/counterUserController"


const router = Router();


router.post('/getcounterissues',getcounterissues);

router.get('/issue/:id',getsingleissue);

router.put('/issuecalled/:id',issuecalled);

router.put('/issuedone/:id',issuedone);

router.put('/nextissuecalled/:id',nextissuecalled);

router.put('/getnextissue/:id',getnextissue);

router.put('/counterclose',counterclose);


export default router;        