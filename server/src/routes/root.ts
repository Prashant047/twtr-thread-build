import { Router } from 'express';
import testRouter from './test';
import tweetRouter from './tweetRouter';

const rootRouter = Router();

rootRouter.use('/test', testRouter);
rootRouter.use('/tweet', tweetRouter);

export default rootRouter;


