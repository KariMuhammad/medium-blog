import CRUDRepository from "../../../repository/crud-repository.js";
import Comment from "../../../Schema/Comment.js";
import Notification from "../../../Schema/Notification.js";
import ApiError from "../../../services/ApiError.js";

const getAllComments = (blogId) => {
  return Comment.find({
    blog_id: blogId,
    isReply: false,
  })
    .populate({
      path: "commented_by",
      select: "personal_info.fullname personal_info.profile_img",
    })
    .populate({
      path: "children",
      populate: {
        path: "commented_by",
        select: "personal_info.fullname personal_info.profile_img",
      },
    })
    .populate({
      path: "children",
      populate: {
        path: "children",
        populate: {
          path: "commented_by",
          select: "personal_info.fullname personal_info.profile_img",
        },
      },
    })
    .populate({
      path: "children",
      populate: {
        path: "children",
        populate: {
          path: "children",
          populate: {
            path: "commented_by",
            select: "personal_info.fullname personal_info.profile_img",
          },
        },
      },
    });
};

class CommentRepository extends CRUDRepository {
  constructor() {
    super(Comment);
  }

  async read(request = {}) {
    try {
      const { blogId } = request.params;

      const commentsQuery = await super.read(getAllComments(blogId), request);
      const comments = await commentsQuery.query;
      const pagination = commentsQuery.pagination;

      return {
        comments,
        pagination,
      };
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async create(data) {
    try {
      const comment = await super.create(data);
      return comment;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async delete(commentId, userId) {
    try {
      const comment = await super.readOne(commentId);
      if (!comment) throw ApiError.notFound("Comment not found");

      if (comment.commented_by.toString() !== userId)
        throw ApiError.forbidden(
          "You are not authorized to delete this comment"
        );

      if (!comment.commented_by === userId)
        throw ApiError.forbidden(
          "You are not authorized to delete this comment"
        );

      await super.delete(commentId);
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) throw error;
      throw ApiError.internal(error.message);
    }
  }
}

export default new CommentRepository();

// ARCHIVE
/**
 *   async like(commentId, userId) {
    try {
      const comment = await super.readOne(commentId);
      if (!comment) throw ApiError.notFound("Comment not found");

      if (
        await Notification.exists({
          user: userId,
          comment: commentId,
          type: "like",
        })
      ) {
        throw ApiError.badRequest("You have already liked this comment");
      }

      Notification.create({
        user: userId,
        notification_for: comment.commented_by,
        type: "like",
        comment: commentId,
        blog: comment.blog_id, // this make the like will be on a blog as well, so it need to resolved with a separate table
      });

      await super.update(commentId, {
        $push: { "activity.total_likes": userId },
      });

      return comment;
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) throw error;
      throw ApiError.internal(error.message);
    }
  }

  async unlike(commentId, userId) {
    try {
      const comment = await super.readOne(commentId);
      if (!comment) throw ApiError.notFound("Comment not found");

      if (
        !(await Notification.exists({
          user: userId,
          comment: commentId,
          type: "like",
        }))
      ) {
        throw ApiError.badRequest("You have not liked this comment");
      }

      await super.update(commentId, {
        $pull: { "activity.total_likes": userId },
      });

      return comment;
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) throw error;
      throw ApiError.internal(error.message);
    }
  }
 */
