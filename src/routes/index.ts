import { Router } from "express";
import userRoutes from "./user";
import bookRoutes from "./book";

const rootRouter: Router = Router();

rootRouter.use('/', userRoutes);
rootRouter.use('/', bookRoutes);

export default rootRouter;
