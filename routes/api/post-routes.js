import { Router } from "express";
export const router = Router();
import { Post } from "../../data/index.js";

//create post
router.post("/", async (req, res) => {
  try {
    const dbPostData = await Post.create(
      req.body.title,
      req.body.content,
      req.body.author_id
    );
    return res.status(200).json(dbPostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//update post
router.put("/:id", async (req, res) => {
  try {
    const updateResult = await Post.update(
      req.params.id,
      req.body.title,
      req.body.content,
      req.body.author_id
    );
    return res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const deletePostData = await Post.destroy(req.params.id);
    return res.status(200).json(deletePostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
export default router;
