import CRUDRepository from "../../../repository/crud-repository.js";
import ApiError from "../../../services/ApiError.js";

import Blog from "../../../Schema/Blog.js";
import Notification from "../../../Schema/Notification.js";

class BlogRepository extends CRUDRepository {
  constructor() {
    super(Blog);
  }

  /**
   * @description Get all blogs
   * @returns {Promise<Blog[]>}
   */
  async read(requestQuery = {}) {
    const blogsQuery = await super.read(undefined, requestQuery);
    const blogs = await blogsQuery.query.populate(
      "author",
      "-_id -password -google_auth"
    );
    const pagination = blogsQuery.pagination;

    return {
      blogs,
      pagination,
    };
  }

  /**
   *
   * @param {*} id
   * @param {*} query
   * @returns {Promise<Blog>}
   */
  async readOne(id, requestQuery = {}) {
    const blog = await super.readOne(id, requestQuery);
    return blog;
  }

  /**
   * @description Create a blog resource
   * @param {*} req
   * @returns {Promise<Blog>}
   */
  create(req) {
    const blog = super.create(req.body);
    return blog;
  }

  /**
   * @description Update a blog resource
   * @param {*} req
   * @returns {Promise<Blog>}
   */
  async update(id, req) {
    const blog = await super.update(id, req.body);
    return blog;
  }

  /**
   * @description Delete a blog resource
   * @param {*} id
   * @returns {Promise<Blog>}
   */
  async delete(id) {
    const blog = await super.delete(id);
    return blog;
  }

  /**
   * @description Get latest blogs
   * documentFactory is a function that returns a query with mine specified conditions
   * we can replace this function with a query object itself
   * @returns {Promise<Blog[]>}
   */
  async latestBlogs(requestQuery = {}) {
    try {
      const _query = Blog.find()
        .populate({
          path: "author",
          select:
            "personal_info.fullname personal_info.username personal_info.profile_img -_id",
        })
        .sort({ publishedAt: -1 })
        .select(
          "-_id banner title description tags activity blog_id publishedAt"
        );

      requestQuery.draft = "false";

      const blogsQuery = await super.read(_query, requestQuery);
      const blogs = await blogsQuery.query;

      return {
        blogs,
        pagination: blogsQuery.pagination,
      };
    } catch (error) {
      console.log(error);
      throw ApiError.internal("Something went wrong in getting latest blogs!");
    }
  }

  async trendingBlogs(requestQuery = {}) {
    try {
      const _query = Blog.find()
        .populate("author", "personal_info.fullname personal_info.profile_img")
        .sort({
          "activity.total_likes": -1,
          "activity.total_reads": -1,
          publishedAt: -1,
        })
        .select("title blog_id publishedAt");
      requestQuery.draft = "false";
      requestQuery.limit = 5;

      const blogsQuery = await super.read(_query, requestQuery);
      const blogs = await blogsQuery.query;

      return blogs;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async search(reqQuery = {}) {
    const { q } = reqQuery;
    delete reqQuery.q;

    try {
      const _query = Blog.find({}).populate(
        "author",
        "personal_info.fullname personal_info.profile_img"
      );

      reqQuery.search = q;
      reqQuery.draft = "false";

      const blogsQuery = await super.read(_query, reqQuery);
      const blogs = await blogsQuery.query;

      return {
        blogs,
        pagination: blogsQuery.pagination,
      };
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async readByUser(request = {}) {
    try {
      const _query = Blog.find({ author: request.params.id })
        .where("draft", "false")
        .populate("author", "-google_auth -password -_id");

      const blogsQuery = await super.read(_query, request.query);
      const blogs = await blogsQuery.query;

      return {
        blogs,
        pagination: blogsQuery.pagination,
      };
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async readBySlug(request = {}) {
    try {
      const { blog_id } = request.params;

      const blog = await Blog.findOne({ blog_id })
        .populate(
          "author",
          "personal_info.fullname personal_info.username personal_info.profile_img personal_info.bio"
        )
        .select("-__v");

      return blog;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async like(blog_id, user_id) {
    console.log(blog_id, user_id);

    const [key, value] = Object.entries(blog_id)[0];

    try {
      // Check if user is already liked the blog
      if (
        await Notification.exists({ blog: value, user: user_id, type: "like" })
      ) {
        throw ApiError.badRequest("You have already liked this blog!");
      }
      const blog = await super.update(
        { [key]: value },
        {
          $inc: { "activity.total_likes": 1 },
        }
      );

      await Notification.create({
        blog: value,
        user: user_id,
        type: "like",
        notification_for: blog.author,
      });

      return blog;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async unlike(blog_id, user_id) {
    const [key, value] = Object.entries(blog_id)[0];

    try {
      // Check if user is already unliked the blog
      if (
        !(await Notification.exists({
          blog: value,
          user: user_id,
          type: "like",
        }))
      ) {
        throw ApiError.badRequest("You have already unliked this blog!");
      }

      const blog = await super.update(
        { [key]: value },
        {
          $inc: { "activity.total_likes": -1 },
        }
      );

      await Notification.deleteOne({
        blog: value,
        user: user_id,
        type: "like",
      });

      return blog;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }
}

export default new BlogRepository();

/**
 * async latestBlogs() {
    try {
      const blogs = await Blog.find({ draft: "false" })
        .populate({
          path: "author",
          select:
            "personal_info.fullname personal_info.username personal_info.profile_img -_id",
        })
        .sort({ publishedAt: -1 })
        .select(
          "-_id banner title description tags activity blog_id publishedAt"
        );
      return blogs;
    } catch (error) {
      console.log(error);
      throw ApiError.internal("Something went wrong in getting latest blogs!");
    }
  }
 */
