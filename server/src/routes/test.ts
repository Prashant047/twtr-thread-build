import { Router, Request, Response } from 'express';

import validateInput from '../middleware/validateInput';
import RequestWithBody from '../requestWithBody';
import { TestInput, TestInputSchema } from '../interface/rootInterface';

const testRouter = Router();

testRouter.get(
  '/',
  (req: Request, res: Response) => {
    res.json({
      data: {
        message: 'Well...its working'
      }
  });
});

testRouter.post(
  '/withData',
  validateInput(TestInputSchema),
  (req: RequestWithBody<TestInput>, res: Response) => {
    const { userName, age } = req.body;
    res.status(200).json({ data: { message: `Hello ${userName} of age ${age}`} });
  }
);

export default testRouter;

