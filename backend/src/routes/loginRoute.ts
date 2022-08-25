import {Router}  from "express";
import { loginUser } from "../controllers/loginController"


const router = Router();


router.get('/',(req,res) =>{
        res.json({success: "Login Page loaded", status: 200})
    })
 
router.post('/',loginUser)


export default router;    