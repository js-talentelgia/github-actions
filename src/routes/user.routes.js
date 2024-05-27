import { Router } from "express";
import { sendOtp, loggOutUser, loginUser, registerUser, refreshAccessToken, getCurrentUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfiyJwt } from "../middlewares/auth.middleware.js";
import { verfiyRole } from "../middlewares/role.middleware.js";
import {validation} from "../utils/validation.js";

const router = Router()
router.route('/send-otp').post(
    validation.registerRoles,
    validation.registerValidate,
    sendOtp
);
router.route('/registerOrLogin').post(
    validation.registerRoles,
    validation.registerValidate,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    verfiyRole,
    registerUser
);


router.route("/login").post(loginUser)
router.route("/getCurrentUser").post(verfiyJwt ,getCurrentUser)    
router.route("/logout").post(verfiyJwt ,loggOutUser)    
router.route("/refresh-token").post(refreshAccessToken)    

export default router