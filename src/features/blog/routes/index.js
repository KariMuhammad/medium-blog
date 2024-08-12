import { Router } from "express";

import { guard } from "../../../shared/auth-middleware.js";

import blog from "../controllers/index.js";
import validation from "../validation/index.js";

const router = Router();

router.get("/", blog.getBlogs());
router.post("/", guard(), validation.create(), blog.createBlog());

export default router;
