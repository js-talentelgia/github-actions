import { Router } from "express";
import { loggOutAdmin, loginAdmin, refreshAccessToken, getCurrentUser } from "../controllers/admin.controller.js";
import { verfiyJwt } from "../middlewares/admin.middleware.js";

const router = Router()

router.route("/login").post(loginAdmin)
router.route("/logout").post(verfiyJwt ,loggOutAdmin) 
router.route("/getCurrentUser").post(verfiyJwt ,getCurrentUser)    
router.route("/refresh-token").post(refreshAccessToken)    

export default router