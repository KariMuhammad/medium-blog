import { Router } from "express";

import validate from "../validators/index.js";
import { guard, guest } from "../../../shared/auth-middleware.js";
import auth from "../controllers/index.js";

const router = Router();

// PROTECTED ROUTES
router.get("/profile", guard(), auth.profile());

// PUBLIC ROUTES
router.post("/sign-up", guest(), validate.sign_up(), auth.register());
router.post("/sign-in", guest(), validate.sign_in(), auth.login());

export default router;
