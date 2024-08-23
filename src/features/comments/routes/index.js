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

// like comment or reply
// router.post("/:commentId/like", guard(), CommentController.likeComment());
// router.post("/:commentId/dislike", guard(), CommentController.unlikeComment());

// Report comment or reply
// router.post("/:commentId/report", guard(), CommentController.reportComment());
router.delete("/:commentId", guard(), CommentController.deleteComment());

export default router;
