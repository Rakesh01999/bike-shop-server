import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { BikeRoutes } from './app/modules/bike/bike.route';
import { OrderRoutes } from './app/modules/order/order.route';

const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

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

