import { Router } from "express";
import { register, login } from "../controllers/AuthController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
