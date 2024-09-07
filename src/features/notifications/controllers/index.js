import ApiError from "../../../services/ApiError.js";
import Notification from "../../../Schema/Notification.js";
import NotificationRepository from "../repositories/index.js";

class NotificationsController {
  getStatusNotification() {
    return async (req, res, next) => {
      const user_id = req.user.id;

      //   returns first element matched filter, than go out
      Notification.exists({
        notification_for: user_id,
        seen: false,
        user: { $ne: user_id },
      })
        .then((result) => {
          return res.status(200).json({
            new_notifications: !!result,
          });
        })
        .catch((error) => {
          console.log(error);
          return next(ApiError.internal(error.message));
        });
    };
  }

  read() {
    return async (req, res, next) => {
      try {
        const { notifications, pagination } = await NotificationRepository.read(
          req
        );

        return res.status(200).json({
          notifications,
          pagination,
        });
      } catch (error) {
        return next(ApiError.internal(error.message));
      }
    };
  }
}

export default new NotificationsController();
