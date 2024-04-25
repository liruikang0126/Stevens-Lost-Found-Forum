import { Router } from "express";
const router = Router();
import { Comment } from "../../data/index.js";

//create comment
router.post("/", async (req, res) => {
  try {
    const dbCommentData = await Comment.create(
      req.body.post_id,
      req.body.author_id,
      req.body.comment
    );
    return res.status(200).json(dbCommentData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//delete comment
router.delete("/:id", async (req, res) => {
  try {
    const deleteCommentData = await Comment.destroy(req.params.id);
    return res.status(200).json(deleteCommentData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
export default router;
