import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from './config';
import errorHandler from './middleware/errorHandler';
import rootRoute from './routes/root';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv]
}));

app.use('/', rootRoute);

app.use(errorHandler);


export default app;

