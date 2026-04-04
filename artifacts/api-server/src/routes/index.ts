import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import eventsRouter from "./events";
import bookingsRouter from "./bookings";
import authRouter from "./auth";
import adminRouter from "./admin";
import seedRouter from "./seed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(eventsRouter);
router.use(bookingsRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(seedRouter);

export default router;
