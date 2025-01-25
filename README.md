
# Bike Shop
## Bike Management System

A Bike Management System built with Express.js, MongoDB, and TypeScript that allows users to manage bike information including CRUD operations such as creating, reading, updating, and deleting bikes, as well as searching bikes by various parameters.

## Features

- **Create Bike**: Add new bikes to the system with necessary details such as name, brand, and category.
- **Get All Bikes**: Fetch a list of bikes with optional search filtering by name, brand, or category.
- **Get Bike by ID or Model Number**: Retrieve a specific bike's information using either its unique ID or model number.
- **Update Bike**: Modify existing bike information.
- **Delete Bike**: Soft delete a bike from the system (mark as deleted).
- **Search Functionality**: Flexible search filtering that allows users to search bikes by name, brand, or category.
  
## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod (for bike data validation)
- **TypeScript**: TypeScript is used for type safety across the application.

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (locally or use MongoDB Atlas)

## Installation

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/bike-management-system.git
cd bike-management-system
```

### Step 2: Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of the project. This file will contain sensitive information like your MongoDB connection string.

Here’s an example `.env` file:

```
MONGO_URI=mongodb://localhost:27017/bike-management
PORT=5000
```

- `MONGO_URI`: Your MongoDB connection URI (use your local or Atlas database connection string).
- `PORT`: The port on which the server will run (default is `5000`).

### Step 4: Run the Project

Start the server with:

```bash
npm start
```

The server will be running on `http://localhost:5000`.

### Step 5: Access the API Endpoints

Once the server is up, you can access the following API endpoints:

- **POST** `/api/bikes` – Create a new bike
- **GET** `/api/bikes` – Get all bikes (with optional search query)
- **GET** `/api/bikes/:bikeId` – Get a specific bike by its ID or model number
- **PUT** `/api/bikes/:bikeId` – Update a bike by its ID
- **DELETE** `/api/bikes/:bikeId` – Soft delete a bike

## API Documentation

1. **Create Bike**  
   - **Endpoint**: `POST /api/bikes`
   - **Body**:  
     ```json
     {
       "bike": {
         "name": "Mountain Bike",
         "brand": "Xtreme",
         "category": "Mountain",
         "price": 300,
         "isDeleted": false
       }
     }
     ```
   - **Response**:  
     ```json
     {
       "success": true,
       "message": "Bike created successfully",
       "data": {
         "_id": "bikeId",
         "name": "Mountain Bike",
         "brand": "Xtreme",
         "category": "Mountain",
         "price": 300,
         "isDeleted": false
       }
     }
     ```

2. **Get All Bikes**  
   - **Endpoint**: `GET /api/bikes`
   - **Query Parameters**:  
     - `searchTerm`: (Optional) String to search in bike name, brand, or category.
   - **Response**:  
     ```json
     {
       "success": true,
       "message": "Bikes fetched successfully",
       "data": [
         {
           "_id": "bikeId",
           "name": "Mountain Bike",
           "brand": "Xtreme",
           "category": "Mountain",
           "price": 300,
           "isDeleted": false
         }
       ]
     }
     ```

3. **Get Bike by ID or Model Number**  
   - **Endpoint**: `GET /api/bikes/:identifier`
   - **Response**:  
     ```json
     {
       "success": true,
       "message": "Bike retrieved successfully",
       "data": {
         "_id": "bikeId",
         "name": "Mountain Bike",
         "brand": "Xtreme",
         "category": "Mountain",
         "price": 300,
         "isDeleted": false
       }
     }
     ```

4. **Update Bike**  
   - **Endpoint**: `PUT /api/bikes/:bikeId`
   - **Body**:  
     ```json
     {
       "name": "Updated Bike Name",
       "brand": "Updated Brand",
       "category": "Updated Category",
       "price": 400,
       "isDeleted": false
     }
     ```
   - **Response**:  
     ```json
     {
       "success": true,
       "message": "Bike updated successfully",
       "data": {
         "_id": "bikeId",
         "name": "Updated Bike Name",
         "brand": "Updated Brand",
         "category": "Updated Category",
         "price": 400,
         "isDeleted": false
       }
     }
     ```

5. **Delete Bike**  
   - **Endpoint**: `DELETE /api/bikes/:bikeId`
   - **Response**:  
     ```json
     {
       "success": true,
       "message": "Bike deleted successfully",
       "data": {
         "_id": "bikeId",
         "name": "Deleted Bike",
         "isDeleted": true
       }
     }
     ```

## Running Tests

To run tests, use:

```bash
npm run test
```

Make sure to write tests for your endpoints using a testing framework such as Jest or Mocha.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Zod](https://github.com/colinhacks/zod) for validation.
- [Express.js](https://expressjs.com/) for building the API.
- [MongoDB](https://www.mongodb.com/) for database management.
