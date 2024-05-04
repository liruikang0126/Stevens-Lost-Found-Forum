import { Router } from "express";
export const router = Router();
import { Post } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";
import multer from "multer";
import * as path from "path";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });
//create post
router.post("/", withAuth, upload.single("image"), async (req, res) => {
  try {
    if (req.session.loggedInUserData._id !== req.body.author_id)
      throw "Author_id provided is not same as that of the current user";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const dbPostData = await Post.create(
      req.body.title,
      req.body.content,
      req.file,
      req.body.category,
      req.body.date,
      req.body.location,
      req.body.lostOrFound,
      req.body.author_id
    );
    return res.status(200).json(dbPostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//update post
router.put("/:id", withAuth, upload.single("image"), async (req, res) => {
  try {
    var post = await Post.getByPostId(req.params.id);
  } catch (e) {
    return res.status(500).json(e);
  }
  const condition =
    post.author_id === req.body.author_id &&
    (req.session.loggedInUserData._id === post.author_id ||
      req.session.loggedInUserData.isAdmin);

  try {
    if (!condition) throw "You don't have the permission to edit the post";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const updateResult = await Post.update(
      req.params.id,
      req.body.title,
      req.body.content,
      req.file,
      req.body.category,
      req.body.date,
      req.body.location,
      req.body.lostOrFound,
      req.body.author_id
    );
    return res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//complete post
router.patch("/:id", withAuth, async (req, res) => {
  const condition = req.session.loggedInUserData._id === req.body.completer_id;
  try {
    if (!condition) throw "Login info is different from provided author_id";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const updateResult = await Post.complete(
      req.params.id,
      req.body.completer_id
    );
    return res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    var post = await Post.getByPostId(req.params.id);
  } catch (e) {
    return res.status(500).json(e);
  }
  try {
    if (
      req.session.loggedInUserData._id !== post.author_id &&
      !req.session.loggedInUserData.isAdmin
    )
      throw "You are not allowed to delete the post";
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const deletePostData = await Post.destroy(req.params.id);
    return res.status(200).json(deletePostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
