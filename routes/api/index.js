import { Router } from "express";
const router = Router();

import userRoutes from "./user-routes.js";
import postRoutes from "./post-routes.js";
import commentRoutes from "./comment-routes.js";

//pass each API route to router
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);

export default router;
