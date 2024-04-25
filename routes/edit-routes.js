import { Router } from "express";
const router = Router();
import { Post } from "../data/index.js";
import withAuth from "../utils/middleware.js";

//on /edit/{id} page load
router.get("/:id", withAuth, async (req, res) => {
  try {
    const post = await Post.getByPostId(req.params.id);
    if (post) {
      res.render("edit", {
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        postData: post,
      });
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
