import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";
import { User } from "../data/index.js";

// on post page load render post data
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.getByPostId(req.params.id);
    let completer = { username: "" };
    if (post.isCompleted) {
      completer = await User.getByAuthorId(post.completer_id);
    }
    if (post) {
      res.render("post", {
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        postData: post,
        completer: completer.username,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
