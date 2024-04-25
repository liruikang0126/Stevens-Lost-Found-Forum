import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";

//on / (index) page load
router.get("/", async (req, res) => {
  try {
    const posts = await Post.getAll();
    // due to the HTML/CSS template for the blog, package the posts into a custom data structure
    // before sending to be rendered
    // posts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // packagedPosts: [ [ 0 ], [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9, 10 ] ]
    const packagedPosts = [];
    let currentPackage = [];
    for (let i = 0; i < posts.length; i++) {
      if (i == 0) {
        currentPackage.push(posts[i]);
        packagedPosts.push(currentPackage);
        currentPackage = [];
      } else {
        currentPackage.push(posts[i]);
      }
      //if i is odd or if 1 or less left
      if (i % 2 == 0 || posts.length - i <= 1) {
        if (currentPackage.length != 0) {
          packagedPosts.push(currentPackage);
        }
        currentPackage = [];
      }
    }
    //render to page and pass variables for handlebars to work with
    res.render("index", {
      loggedIn: req.session.loggedIn,
      loggedInUserData: req.session.loggedInUserData,
      posts: packagedPosts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
