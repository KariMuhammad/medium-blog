import CRUDRepository from "../../../repository/crud-repository.js";
import Notification from "../../../Schema/Notification.js";
import ApiError from "../../../services/ApiError.js";

class NotificationRepository extends CRUDRepository {
  constructor() {
    super(Notification);
  }

  async read(request = {}) {
    try {
      const mongooseQuery = await super.read(
        Notification.find({
          notification_for: request.user.id,
          user: { $ne: request.user.id },
        })
          .sort({ createdAt: -1 })
          .populate("comment", "comment")
          .populate(
            "user",
            "personal_info.fullname personal_info.profile_img personal_info.username"
          )
          .populate(
            "notification_for",
            "personal_info.fullname personal_info.profile_img personal_info.username"
          )
          .populate("blog", "title blog_id")
          .populate("replied_on_comment", "comment")
          .populate("reply", "comment")
          .select("createdAt type seen"),
        request
      );

      const notifications = await mongooseQuery.query;
      console.log("USERID", request.user.id, "NOTIFICATIONS: ", notifications);
      const pagination = mongooseQuery.pagination;

      // update the notifications to seen
      await Notification.updateMany(
        { _id: { $in: notifications.map((notification) => notification._id) } },
        { seen: true }
      );

      return {
        notifications,
        pagination,
      };
    } catch (error) {
      console.log(error);
      throw ApiError.internal(error);
    }
  }
}

export default new NotificationRepository();
