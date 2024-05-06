import { Router } from "express";
export const router = Router();
import { Post } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";
import multer from "multer";
import * as path from "path";

// initialize multer
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
    // type check
    req.session.loggedInUserData._id = helper.checkId(
      req.session.loggedInUserData._id,
      "userId"
    );
    req.body.title = helper.checkString(req.body.title, 100, "title");
    req.body.content = helper.checkString(req.body.content, 2000, "content");
    req.file = helper.checkImage(req.file, "image");
    req.body.category = helper.checkCategory(req.body.category);
    req.body.date = helper.checkDate(req.body.date);
    req.body.location = helper.checkLocation(req.body.location);
    req.body.lostOrFound = helper.checkLOF(req.body.lostOrFound);
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
      req.session.loggedInUserData._id
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
    req.params.id = helper.checkId(req.params.id, "postId");
    var post = await Post.getByPostId(req.params.id);
  } catch (e) {
    return res.status(500).json(e);
  }
  const condition =
    req.session.loggedInUserData._id === post.author_id ||
    req.session.loggedInUserData.isAdmin;
  try {
    // type check
    req.body.title = helper.checkString(req.body.title, 100, "title");
    req.body.content = helper.checkString(req.body.content, 2000, "content");
    req.file = helper.checkImage(req.file, "image");
    req.body.category = helper.checkCategory(req.body.category);
    req.body.date = helper.checkDate(req.body.date);
    req.body.location = helper.checkLocation(req.body.location);
    req.body.lostOrFound = helper.checkLOF(req.body.lostOrFound);
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
      post.author_id
    );
    return res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//complete/patch post
router.patch("/:id", withAuth, async (req, res) => {
  try {
    // type check
    req.params.id = helper.checkId(req.params.id, "postId");
    req.session.loggedInUserData._id = helper.checkId(
      req.session.loggedInUserData._id,
      "completerId"
    );
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const updateResult = await Post.complete(
      req.params.id,
      req.session.loggedInUserData._id
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
    req.params.id = helper.checkId(req.params.id, "postId");
    var post = await Post.getByPostId(req.params.id);
    try {
      if (
        req.session.loggedInUserData._id !== post.author_id &&
        !req.session.loggedInUserData.isAdmin
      )
        throw "You are not allowed to delete the post";
    } catch (err) {
      return res.status(400).json(err);
    }
    const deletePostData = await Post.destroy(req.params.id);
    return res.status(200).json(deletePostData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
