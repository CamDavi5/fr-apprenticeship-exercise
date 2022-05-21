import * as express from 'express'
const router = express.Router();
import fetchRouter from './fetch';

router.use("/fetch", fetchRouter)

export default router;