import { Router } from "express";
const router = Router();

//render handlebars view on page load
router.get("/", async (req, res) => {
  res.render("about", {
    loggedIn: req.session.loggedIn,
    loggedInUserData: req.session.loggedInUserData,
  });
});

export default router;
