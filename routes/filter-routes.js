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
      const lostOrFound = helper.checkLOF(req.query.lostOrFound);
      const category = helper.checkCategory(req.query.category);
      const date1 = helper.checkDate(req.query.date1);
      const date2 = helper.checkDate(req.query.date2);
      const location = helper.checkLocation(req.query.location);

      posts = await Post.getByFilter(
        lostOrFound,
        category,
        date1,
        date2,
        location
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
