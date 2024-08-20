import CRUDRepository from "../../../repository/crud-repository.js";
import User from "../../../Schema/User.js";

class UserController extends CRUDRepository {
  constructor() {
    super(User);
  }

  readOne() {
    return async (req, res, next) => {
      const { id } = req.params;
      try {
        const user = await User.find({
          "personal_info.username": id,
        }).select("-personal_info.password -updatedAt -__v -google_auth");
        return res.status(200).json({ data: user });
      } catch (error) {
        console.log("Error", error);
        return next(error);
      }
    };
  }
}

export default new UserController();
