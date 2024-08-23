import slugify from "slugify";
import BlogRepository from "../repositories/index.js";
import { nanoid } from "nanoid";
import User from "../../../Schema/User.js";
import Notification from "../../../Schema/Notification.js";
import ApiError from "../../../services/ApiError.js";

class BlogController {
  read() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.read(req);

        return res.status(200).json({ data: blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  readOne() {
    return async (req, res, next) => {
      try {
        const blog = await BlogRepository.readOne(req.params.id, req);
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

        const blog = await BlogRepository.create(req.body);

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
        const blog = await BlogRepository.update(
          { blog_id: req.params.id },
          req.body
        );
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

  latestBlogs() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.latestBlogs(req);
        return res.status(200).json({ blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  trendingBlogs() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.trendingBlogs(req);
        return res.status(200).json({ blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  readByUser() {
    return async (req, res, next) => {
      try {
        const blogs = await BlogRepository.readByUser(req);

        return res.status(200).json({ blogs });
      } catch (error) {
        return next(error);
      }
    };
  }

  readBySlug() {
    return async (req, res, next) => {
      try {
        const user = req.user ? req.user.id : null;
        let userLiked = false;

        const blog = await BlogRepository.readBySlug(req);

        if (user) {
          const current_user = await User.findById(user);
          if (!current_user.account_info.total_reads.includes(blog._id)) {
            current_user.updateOne({
              $push: { "account_info.total_reads": blog._id },
            });

            console.log("Incrementing total reads");

            // await blog.updateOne({ $inc: { "activity.total_reads": 1 } });

            // Check if user liked the blog
            if (
              await Notification.exists({
                blog: blog._id,
                user: user,
                type: "like",
              })
            )
              userLiked = true;
          }
        }
        console.log({ blog, liked: userLiked });

        return res.status(200).json({ blog: { ...blog, liked: userLiked } });
      } catch (error) {
        console.log(error.message);

        return ApiError.internal(error.message);
      }
    };
  }

  like() {
    return async (req, res, next) => {
      try {
        const {
          activity: { total_likes },
        } = await BlogRepository.like({ _id: req.params.id }, req.user.id);
        return res.status(200).json({
          status: 200,
          message: "Liked successfully!",
          data: total_likes,
        });
      } catch (error) {
        return next(error);
      }
    };
  }

  unlike() {
    return async (req, res, next) => {
      try {
        const {
          activity: { total_likes },
        } = await BlogRepository.unlike({ _id: req.params.id }, req.user.id);
        return res.status(200).json({
          status: 200,
          message: "Unliked successfully!",
          data: total_likes,
        });
      } catch (error) {
        return next(error);
      }
    };
  }
}

export default new BlogController();
