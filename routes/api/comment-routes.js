import { Router } from "express";
const router = Router();
import { Comment } from "../../data/index.js";
import { Post } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";
import helper from "../../utils/helpers.js";

//create comment
router.post("/", withAuth, async (req, res) => {
  try {
    // type check
    req.session.loggedInUserData._id = helper.checkId(
      req.session.loggedInUserData._id,
      "authorId"
    );
    req.body.post_id = helper.checkId(req.body.post_id, "postId");
    req.body.comment = helper.checkString(req.body.comment, 2000, "comment");
    // check if the user have another comment in the post
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
      req.session.loggedInUserData._id,
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
    req.params.id = helper.checkId(req.params.id, "commentId");
    var comment = await Comment.getByCommentId(req.params.id);
    const condition =
      req.session.loggedInUserData._id === comment.author_id ||
      req.session.loggedInUserData.isAdmin;
    try {
      if (!condition)
        throw "You don't have the permission to delete the comment";
    } catch (err) {
      return res.status(400).json(err);
    }
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
    req.params.id = helper.checkId(req.params.id, "commentId");
    var comment = await Comment.getByCommentId(req.params.id);
    const condition = req.session.loggedInUserData._id === comment.author_id;
    try {
      req.body.content = helper.checkString(req.body.content, "comment");
      if (!condition) throw "You don't have the permission to edit the comment";
    } catch (err) {
      return res.status(400).json(err);
    }
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
