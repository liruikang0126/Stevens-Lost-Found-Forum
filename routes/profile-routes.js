import { Router } from "express";
const router = Router();
import { User } from "../data/index.js";
import withAuth from "../utils/middleware.js";

router.get("/:id", async (req, res) => {
  try {
    const user = await User.getByAuthorId(req.params.id);
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
