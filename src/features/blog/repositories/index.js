import Blog from "../../../Schema/Blog.js";
import User from "../../../Schema/User.js";
import ApiError from "../../../services/ApiError.js";

class BlogRepository {
  /**
   * @description Get all blogs
   * @returns {Promise<Blog[]>}
   */
  async getBlogs() {
    return await Blog.find();
  }

  /**
   * @description Create a blog resource
   * @param {*} req
   * @returns
   */
  createBlog(req) {
    try {
      const blog = new Blog(req.body);

      return blog;
    } catch (error) {
      throw ApiError.badRequest(error.message);
    }
  }
}

export default new BlogRepository();
