import slugify from "slugify";
import BlogRepository from "../repositories/index.js";
import { nanoid } from "nanoid";
import User from "../../../Schema/User.js";

class BlogController {
  read() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.read(req.query);
        return res.status(200).json({ blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  readOne() {
    return async (req, res, next) => {
      try {
        const blog = await BlogRepository.readOne(req.params.id, req.query);
        return res.status(200).json({ blog });
      } catch (error) {
        return next(error);
      }
    };
  }

  create() {
    return async (req, res, next) => {
      try {
        req.body["author"] = req.user.id;
        req.body["blog_id"] = slugify(`${req.body.title}-${nanoid()}`, {
          lower: true,
        });

        const blog = await BlogRepository.create(req);

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

  update() {
    return async (req, res, next) => {
      try {
        const blog = await BlogRepository.update(req.params.id, req);
        return res.status(200).json({ blog });
      } catch (error) {
        return next(error);
      }
    };
  }

  delete() {
    return async (req, res, next) => {
      try {
        await BlogRepository.delete(req.params.id);
        return res.status(204).json({ message: "deleted!" });
      } catch (error) {
        return next(error);
      }
    };
  }
}

export default new BlogController();
