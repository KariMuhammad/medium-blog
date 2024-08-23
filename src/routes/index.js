import { Router } from "express";
import BlogRepository from "../features/blog/repositories/index.js";
import User from "../Schema/User.js";

const router = Router();

router.get("/", async (req, res, next) => {
  const { q } = req.query;
  try {
    const blogs = await BlogRepository.search(req);
    const users = await User.find({
      "personal_info.fullname": { $regex: `.*${q}.*`, $options: "i" },
    }).limit(2);

    return res.status(200).json({ data: { blogs, users } });
  } catch (error) {
    console.log("Error", error);
    return next(error);
  }
});

router.get("/users", async (req, res, next) => {
  const { q } = req.query;
  try {
    const users = await User.find({
      name: { $regex: `.*${q}.*`, $options: "i" },
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    console.log("Error", error);
    return next(error);
  }
});

export default router;

// const blogs = BlogRepository.search(q);
