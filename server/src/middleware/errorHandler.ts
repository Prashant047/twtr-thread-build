import { ErrorRequestHandler, Request, Response } from 'express';
import config from '../config';

const errorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next) => {
  console.error('API error',error);

  // res.status(500).json({
  //   error: config.nodeEnv === 'production' ?
  //     'unknown error' : error
  // });
  
  res.status(500).json({
    error
  });

}

export default errorHandler;

