import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";
import helper from "../utils/helpers.js";

router.get("/", async (req, res) => {
  try {
    const posts = await Post.getAllHottest();
    /* const posts = await Post.getAllLatest(); */
    const packagedPosts = helper.arrayDealer(posts);
    //render to page and pass variables for handlebars to work with
    res.render("service", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: packagedPosts,
      new: false,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/new", async (req, res) => {
  try {
    const posts = await Post.getAllLatest();
    /* const posts = await Post.getAllLatest(); */
    const packagedPosts = helper.arrayDealer(posts);
    //render to page and pass variables for handlebars to work with
    res.render("service", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: packagedPosts,
      new: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
