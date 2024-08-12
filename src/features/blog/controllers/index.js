import slugify from "slugify";
import BlogRepository from "../repositories/index.js";
import { nanoid } from "nanoid";
import User from "../../../Schema/User.js";

class BlogController {
  getBlogs() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.getBlogs();
        return res.status(200).json({ blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  createBlog() {
    return async (req, res, next) => {
      try {
        req.body["author"] = req.user.id;
        req.body["blog_id"] = slugify(`${req.body.title}-${nanoid()}`, {
          lower: true,
        });

        const blog = BlogRepository.createBlog(req);

        await blog.save().then(async (blog) => {
          await User.findByIdAndUpdate(req.body.author, {
            $push: { blogs: blog._id },
            $inc: { "account_info.total_posts": blog.draft ? 0 : 1 },
          });
        });

        return res.status(201).json({ blog });
      } catch (error) {
        return next(error);
      }
    };
  }
}

export default new BlogController();
