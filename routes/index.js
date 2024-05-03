import { Router } from "express";
const router = Router();
//api requires can also be done separately
import apiRoutes from "./api/index.js";
import indexRoutes from "./index-routes.js";
import loginRoutes from "./login-routes.js";
import postRoutes from "./post-routes.js";
import signupRoutes from "./signup-routes.js";
import logoutRoutes from "./logout-routes.js";
import dashboardRoutes from "./dashboard-routes.js";
import editRoutes from "./edit-routes.js";
import aboutRoutes from "./about-routes.js";
import profileRoutes from "./profile-routes.js";
import serviceRoutes from "./service-routes.js";
import filterRoutes from "./filter-routes.js";

//use each of the routes files in the routes folder
router.use("/", indexRoutes);
router.use("/api", apiRoutes);
router.use("/login", loginRoutes);
router.use("/post", postRoutes);
router.use("/signup", signupRoutes);
router.use("/logout", logoutRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/edit", editRoutes);
router.use("/about", aboutRoutes);
router.use("/profile", profileRoutes);
router.use("/service", serviceRoutes);
router.use("/filter", filterRoutes);
router.use("*", (req, res) => {
  res.sendStatus(404);
});
export default router;
