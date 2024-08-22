import { Router } from "express";
import CommentController from "../controllers/index.js";
import { guard } from "../../../shared/auth-middleware.js";

const router = Router();

router
  .route("/:blogId")
  .get(CommentController.getComments())
  .post(guard(), CommentController.createComment());

// get comments
router
  .route("/:commentId/replies")
  .get(CommentController.getReplies())
  .post(guard(), CommentController.createReply());

export default router;
