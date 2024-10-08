import { Router } from "express";

import { guard, isGuarded } from "../../../shared/auth-middleware.js";

import parameter from "../../../validations/parameter-validation.js";

import blog from "../controllers/index.js";

import validation from "../validation/index.js";

const router = Router();

router
  .route("/")
  .get(blog.read())
  .post(guard(), validation.create(), blog.create());

router.get("/dashboard", guard(), blog.readDashboardBlogs());
router.get("/latest", blog.latestBlogs());
router.get("/trending", blog.trendingBlogs());
router.get("/user/:id", blog.readByUser());
router.get("/blog/:blog_id", isGuarded(), blog.readBySlug());

router.delete("/:id", parameter.isValidBlogSlug({ id: "_id" }), blog.delete());

router
  .route("/:id")
  .all(parameter.isValidBlogSlug({}))
  .get(blog.readOne())
  .patch(blog.update());

router.route("/like/:id").patch(guard(), blog.like());
router.route("/unlike/:id").patch(guard(), blog.unlike());

export default router;
