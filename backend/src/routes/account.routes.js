
import { Router } from "express";
import {addAccount, getAccounts} from '../controllers/account.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router();

router.route("/addAccount").post(verifyJWT,addAccount);
router.route("/getAccounts").get(verifyJWT,getAccounts);

export default router;