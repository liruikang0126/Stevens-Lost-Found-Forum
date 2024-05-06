import { Router } from "express";
export const router = Router();
import { User } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";
import multer from "multer";
import * as path from "path";
import helper from "../../utils/helpers.js";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });
// CREATE new user
router.post("/", async (req, res) => {
  try {
    req.body.username = helper.checkUsername(req.body.username);
    req.body.email = helper.checkEmail(req.body.email);
    req.body.password = helper.checkPassword(req.body.password);
    req.body.is_admin = helper.checkIsAdmin(req.body.is_admin);
  } catch (err) {
    res.status(400).json(err);
  }
  try {
    const dbUserData = await User.create(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.is_admin
    );
    return res.status(200).json(dbUserData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// PATCH the user's profile
router.patch("/:id", withAuth, upload.single("avatar"), async (req, res) => {
  try {
    req.body.username = helper.checkUsername(req.body.username);
    req.params.id = helper.checkId(req.params.id, "userId");
    req.body.phone = helper.checkPhone(req.body.phone);
    req.file = helper.checkImage(req.file);
    if (req.params.id !== req.session.loggedInUserData._id)
      throw "You are not allowed to edit this user's profile";
  } catch (err) {
    res.status(400).json(err);
  }
  try {
    const dbUserData = await User.update(
      req.params.id,
      req.body.username,
      req.body.phone,
      req.file
    );
    return res.status(200).json(dbUserData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// PATCH users' friend lists
router.patch("/", withAuth, async (req, res) => {
  try {
    req.session.loggedInUserData._id = helper.checkId(
      req.session.loggedInUserData._id,
      "userId"
    );
    req.body.id2 = helper.checkId(req.body.id2, "friendId");
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    let dbUserData;
    if (req.body.isAdd) {
      dbUserData = await User.addFriends(
        req.session.loggedInUserData._id,
        req.body.id2
      );
    } else {
      dbUserData = await User.deleteFriends(
        req.session.loggedInUserData._id,
        req.body.id2
      );
    }
    return res.status(200).json(dbUserData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    try {
      req.body.email = helper.checkEmail(req.body.email);

      req.body.password = helper.checkPassword(req.body.password);

      var dbUserData = await User.getByEmail(req.body.email);
      if (!dbUserData) throw "Incorrect email or password. Please try again!";
      //checks that password is valid
      const validPassword = await User.checkPassword(
        dbUserData,
        req.body.password
      );
      if (!validPassword)
        throw "Incorrect email or password. Please try again!";
    } catch (err) {
      return res.status(400).json(err);
    }

    //save data to session for use elsewhere
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.loggedInUserData = dbUserData;
      console.log("🚀", req.session.cookie);
      res.status(200).json({
        user: dbUserData,
        message: "You are now logged in!",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// User Logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
export default router;
