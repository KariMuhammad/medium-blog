import { Router } from "express";
import { guard } from "../../../shared/auth-middleware.js";

import notification from "../controllers/index.js";

const router = Router();

router.get("/", guard(), notification.read());
router.get("/status", guard(), notification.getStatusNotification());

export default router;
