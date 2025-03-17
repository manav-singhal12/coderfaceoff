import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addLimit,updateLimit,deleteLimit,getLimits } from "../controllers/limit.controller.js";
const router = Router();

router.route("/addlimit").post(verifyJWT, addLimit);
router.route("/getlimits").get(verifyJWT, getLimits);
router.route("/updatelimit").put(verifyJWT, updateLimit);
router.route("/deletelimit").delete(verifyJWT, deleteLimit);

export default router;