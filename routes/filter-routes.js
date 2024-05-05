import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";
import helper from "../utils/helpers.js";

router.get("/", async (req, res) => {
  try {
    let posts;
    if (!req.query.lostOrFound) {
      posts = await Post.getAllHottest();
    } else {
      posts = await Post.getByFilter(
        req.query.lostOrFound,
        req.query.category,
        req.query.date1,
        req.query.date2,
        req.query.location
      );
    }
    /* const posts = await Post.getAllLatest(); */
    const packagedPosts = helper.filterArray(posts);
    req.query.date1 = new Date(req.query.date1);
    req.query.date2 = new Date(req.query.date2);
    //render to page and pass variables for handlebars to work with
    res.render("filter", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: packagedPosts,
      query: req.query,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
