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

router.post(
  "/google-auth",
  guest(),
  validate.signWithGoogle(),
  auth.signWithGoogle()
);

router.post(
  "/change-password",
  guard(),
  validate.changePassword(),
  auth.changePassword()
);

// =========================================
router.patch(
  "/profile-image/edit",
  guard(),
  validate.updateImage(),
  auth.updateImage()
);

router.patch(
  "/profile/edit",
  guard(),
  validate.updateProfile(),
  auth.updateProfile()
);

export default router;
