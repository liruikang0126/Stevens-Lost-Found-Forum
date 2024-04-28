import { Router } from "express";
const router = Router();
import { Comment } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";

//create comment
router.post("/", withAuth, async (req, res) => {
  try {
    if (req.session.loggedInUserData._id !== req.body.author_id)
      throw "Author_id provided is not same as that of the current user";
  } catch (err) {
    return res.status(400).json(err);
  }
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
router.delete("/:id", withAuth, async (req, res) => {
  try {
    var comment = await Comment.getByCommentId(req.params.id);
  } catch (e) {
    return res.status(500).json(e);
  }
  const condition =
    req.session.loggedInUserData._id === comment.author_id ||
    req.session.loggedInUserData.isAdmin;
  try {
    if (!condition) throw "You don't have the permission to delete the comment";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const deleteCommentData = await Comment.destroy(req.params.id);
    return res.status(200).json(deleteCommentData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
export default router;
