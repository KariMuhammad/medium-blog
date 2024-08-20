import { Router } from "express";

import user from "../controllers/index.js";

const router = Router();

router.get("/:id", user.readOne());

export default router;
