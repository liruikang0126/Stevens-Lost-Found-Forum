import { Router } from "express";
const router = Router();
import Post from "../data/Post.js";

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

//claim
router.post('/:id/claim', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user._id; // 假设用户ID存储在session中

    // 调用 claimPost 函数处理认领
    const result = await claimPost(postId, userId);
    if (result.isCompleted) {
      res.render("claimSuccess", {  // 假设有一个用于显示认领成功的视图
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        postData: result
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





export default router;
