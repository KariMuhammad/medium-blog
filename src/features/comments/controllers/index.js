import ApiError from "../../../services/ApiError.js";

import CommentsRepository from "../repositories/index.js";

import Notification from "../../../Schema/Notification.js";
import Comment from "../../../Schema/Comment.js";
import Blog from "../../../Schema/Blog.js";
import User from "../../../Schema/User.js";

class CommentController {
  getComments() {
    return async (req, res, next) => {
      try {
        req.query.sort = "-commentedAt";

        const comments = await CommentsRepository.read(req);

        return res.status(200).json({
          status: "success",
          message: "Comments fetched successfully",
          data: comments,
        });
      } catch (error) {
        console.log(error);

        return next(ApiError.internal(error.message));
      }
    };
  }

  getComment() {
    return async (req, res, next) => {};
  }

  createComment() {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const { blogId } = req.params;
        const { content } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return next(ApiError.notFound("Blog not found"));

        // create comment
        const comment = await CommentsRepository.create({
          blog_id: blogId,
          blog_author: blog.author,
          comment: content,
          commented_by: user.id,
          isReply: false,
        });

        // update blog
        await blog.updateOne({
          $push: { comments: comment._id },
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": 1,
          },
        });

        // create a notification
        await Notification.create({
          user: user.id,
          notification_for: blog.author,
          type: "comment",
          blog: blogId,
          comment: comment._id,
        });

        const pagination = (await CommentsRepository.read(req)).pagination;

        return res.status(201).json({
          status: "success",
          message: "Comment created successfully",
          data: {
            comment: { ...comment, commented_by: await User.findById(user.id) },
            pagination,
          },
        });
      } catch (error) {
        return next(ApiError.internal(error.message));
      }
    };
  }

  getReplies() {
    return async (req, res, next) => {
      try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return next(ApiError.notFound("Comment not found"));

        const replies = await comment.populate({
          path: "children",
          populate: {
            path: "commented_by",
            select: "personal_info.fullname personal_info.profile_img",
          },
          select: "comment commented_by",
        });

        return res.status(200).json({
          status: "success",
          message: "Replies fetched successfully",
          data: replies.children,
        });
      } catch (error) {
        return next(ApiError.internal(error.message));
      }
    };
  }

  createReply() {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const { commentId } = req.params;
        const { content } = req.body;

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) return next(ApiError.notFound("Comment not found"));

        const comment = await CommentsRepository.create({
          blog_id: parentComment.blog_id,
          blog_author: parentComment.blog_author,
          comment: content,
          commented_by: user.id,
          isReply: true,
          parent: commentId,
        });

        await parentComment.updateOne({
          $push: { children: comment._id },
          $inc: { "activity.total_replies": 1 },
        });

        await Notification.create({
          user: user.id,
          notification_for: parentComment.commented_by,
          type: "reply",
          blog: parentComment.blog_id,
          comment: parentComment._id,
          reply: comment._id,
          replied_on_comment: commentId,
        });

        await Blog.findByIdAndUpdate(parentComment.blog_id, {
          $inc: { "activity.total_comments": 1 },
        });

        return res.status(201).json({
          status: "success",
          message: "Reply created successfully",
          data: { ...comment, commented_by: await User.findById(user.id) },
        });
      } catch (error) {
        return next(ApiError.internal(error.message));
      }
    };
  }

  deleteComment() {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const { commentId } = req.params;

        const status = await CommentsRepository.delete(commentId, user.id);

        if (!status) return next(ApiError.notFound("Something went wrong!"));

        return res.status(200).json({
          status: "success",
          message: "Comment deleted successfully",
        });
      } catch (error) {
        return next(error);
      }
    };
  }
}

export default new CommentController();

// ARCHIVE
/**
 * likeComment() {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const { commentId } = req.params;
        const comment = await CommentsRepository.like(commentId, user.id);

        return res.status(200).json({
          status: "success",
          message: "Comment liked successfully",
          data: comment,
        });
      } catch (error) {
        return next(error);
      }
    };
  }

  unlikeComment() {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const { commentId } = req.params;
        const comment = await CommentsRepository.unlike(commentId, user.id);

        return res.status(200).json({
          status: "success",
          message: "Comment unliked successfully",
          data: comment,
        });
      } catch (error) {
        return next(error);
      }
    };
  }
 */
