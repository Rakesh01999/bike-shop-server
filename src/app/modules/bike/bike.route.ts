import express from 'express';
// import { BikeControllers, updateBikeHandler } from './bike.controller';
import { BikeControllers } from './bike.controller';

const router = express.Router();

// Route to create a new bike
router.post('/create-bike', BikeControllers.createBike);

// Route to get all bikes
router.get('/', BikeControllers.getAllBikes);

// Route to get a single bike by ID
// router.get('/:bikeId', BikeControllers.getSingleBike);


// Route to delete a bike by ID
router.delete('/:bikeId', BikeControllers.deleteBike);




// Route to get a bike by _id or modelNumber
router.get('/bikes/:identifier', BikeControllers.getBikeByIdOrModelNumber);


// Get a specific bike by ID
// router.get('/products/:productId', BikeControllers.getBikeById);

router.get('/:productId', BikeControllers.getBikeById);



// Define the PUT endpoint
router.put('/:productId', BikeControllers.updateBikeHandler);


// ------------ Order
// Define the POST endpoint
// router.post('/api/orders', BikeControllers.createOrderHandler);




export const BikeRoutes = router;

