import { Router } from "express";
const router = Router();
import { User } from "../data/index.js";

router.get("/:id", async (req, res) => {
  try {
    const user = await User.getByAuthorId(req.params.id);
    const data = [];
    for (let i = 0; i < user.friends.length; i++) {
      const user1 = await User.getByAuthorId(user.friends[i]);
      data.push(user1);
    }
    if (user) {
      res.render("user", {
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        userData: user,
        friends: data,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
