import { Router } from "express";
const router = Router();
import { Comment } from "../../data/index.js";
import { Post } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";

//create comment
router.post("/", withAuth, async (req, res) => {
  try {
    if (req.session.loggedInUserData._id !== req.body.author_id)
      throw "Author_id provided is not same as that of the current user";
    const post = await Post.getByPostId(req.body.post_id);
    let comments = post.comments;
    comments = comments.filter((e) => {
      return e.author_id == req.body.author_id;
    });
    if (comments.length >= 1) {
      throw "You can create only one comment in each post.";
    }
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

//edit comment
router.put("/:id", withAuth, async (req, res) => {
  try {
    var comment = await Comment.getByCommentId(req.params.id);
  } catch (e) {
    return res.status(500).json(e);
  }
  const condition = req.session.loggedInUserData._id === comment.author_id;
  try {
    if (!condition) throw "You don't have the permission to edit the comment";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const editCommentData = await Comment.update(
      req.params.id,
      req.body.content
    );
    return res.status(200).json(editCommentData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
export default router;
