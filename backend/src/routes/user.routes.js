import {loginUser, logoutUser, registerUser,updateProfile} from '../controllers/user.controller.js';

import Router from 'express';
import jwt from 'jsonwebtoken'
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router=Router();


router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    }]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/update-profile").put(verifyJWT,updateProfile);

export default router;