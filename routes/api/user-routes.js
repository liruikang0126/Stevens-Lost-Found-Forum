import { Router } from "express";
export const router = Router();
import { User } from "../../data/index.js";
import withAuth from "../../utils/middleware.js";

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.is_admin
    );
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.loggedInUserData = dbUserData;
      return res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.getByEmail(req.body.email);

    if (!dbUserData) {
      res.status(400).json({
        message: "Incorrect email or password. Please try again!",
      });
      return;
    }
    //checks that password is valid
    const validPassword = await User.checkPassword(
      dbUserData,
      req.body.password
    );

    if (!validPassword) {
      res.status(400).json({
        message: "Incorrect email or password. Please try again!",
      });
      return;
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
router.post("/logout", withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
export default router;
