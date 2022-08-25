import {Router}  from "express";
import { loginUser } from "../controllers/loginController"


const router = Router();


router.get('/',(req,res) =>{
        res.status(200).json({success: "Login Page loaded"})
    })
 
router.post('/',loginUser)


export default router;    