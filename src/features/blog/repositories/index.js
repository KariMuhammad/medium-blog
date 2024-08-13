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
    const blogs = await super.read(query);
    return blogs;
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
}

export default new BlogRepository();
