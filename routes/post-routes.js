import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";
import User from "../data/User.js";
import Comment from "../data/Comment.js";

// on post page load render post data
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.getByPostId(req.params.id);
    if (post) {
      res.render("post", {
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        postData: post,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
