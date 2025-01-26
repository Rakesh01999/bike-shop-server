import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { BikeRoutes } from './app/modules/bike/bike.route';
import { OrderRoutes } from './app/modules/order/order.route';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());

// app.use(cors());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));


// /api/v1/bikes/create-bike
// /api/v1/products/create-bike

// application routes
// app.use('/api/v1/bikes', BikeRoutes);
app.use('/api/products', BikeRoutes);
app.use('/api', OrderRoutes);

const getAController = (req: Request, res: Response) => {
  //   res.send('Hello World!')
  // const a = 10;
  // res.send(a);
  res.sendStatus(200);
};

app.get('/', getAController);

// console.log(process.cwd()); // E:\web\Programming Hero\Level 2\Mission 01-Be A Typescript Technocrat\Module 8-Mastering The Core concept of Mongoose\first-project

export default app;

