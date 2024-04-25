import { Router } from "express";
const router = Router();
import { Post, User } from "../data/index.js";
import withAuth from "../utils/middleware.js";

router.get("/", withAuth, async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.render("dashboard", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
