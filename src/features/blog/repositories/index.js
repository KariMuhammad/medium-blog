import CRUDRepository from "../../../repository/crud-repository.js";
import Blog from "../../../Schema/Blog.js";
import ApiError from "../../../services/ApiError.js";

class BlogRepository extends CRUDRepository {
  constructor() {
    super(Blog);
  }

  /**
   * @description Get all blogs
   * @returns {Promise<Blog[]>}
   */
  async read(query = {}) {
    console.log(query);
    const blogsQuery = await super.read(query);
    const blogs = await blogsQuery.query.populate("author", "-_id -password");
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
  async readOne(id, query = {}) {
    const blog = await super.readOne(id, query);
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
   * @returns {Promise<Blog[]>}
   */
  async latestBlogs(query = {}) {
    try {
      const blogsQuery = await super.read(query);
      const blogs = await blogsQuery.query
        .find({ draft: "false" })
        .populate({
          path: "author",
          select:
            "personal_info.fullname personal_info.username personal_info.profile_img -_id",
        })
        .sort({ publishedAt: -1 })
        .select(
          "-_id banner title description tags activity blog_id publishedAt"
        );

      return {
        blogs,
        pagination: blogsQuery.pagination,
      };
    } catch (error) {
      console.log(error);
      throw ApiError.internal("Something went wrong in getting latest blogs!");
    }
  }

  async trendingBlogs(query = {}) {
    try {
      const blogsQuery = await super.read(query);

      const blogs = await blogsQuery.query
        .find({ draft: "false" })
        .populate("author", "personal_info.fullname personal_info.profile_img")
        .sort({
          "activity.total_likes": -1,
          "activity.total_reads": -1,
          publishedAt: -1,
        })
        .select("title blog_id publishedAt")
        .limit(5);

      return blogs;
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
