import { Router } from "express";

import { guard } from "../../../shared/auth-middleware.js";

import parameter from "../../../validations/parameter-validation.js";

import blog from "../controllers/index.js";

import validation from "../validation/index.js";

import Blog from "../../../Schema/Blog.js";

const router = Router();

router
  .route("/")
  .get(blog.read())
  .post(guard(), validation.create(), blog.create());

router.get("/latest", blog.latestBlogs());
router.get("/trending", blog.trendingBlogs());

router
  .route("/:id")
  .all(parameter.isExistId(Blog))
  .get(blog.readOne())
  .patch(blog.update())
  .delete(blog.delete());

export default router;
