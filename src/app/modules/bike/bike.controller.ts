import { Request, Response } from 'express';
import { BikeServices } from './bike.service';
import bikeValidationSchema from './bike.validation';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// const createBike = async (req: Request, res: Response): Promise<Response> => {
const createBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bike: bikeData } = req.body;

        // Validate the incoming data using Zod
        const validatedData = bikeValidationSchema.parse(bikeData);

        // Save the bike to the database
        const result = await BikeServices.createBikeInDB(validatedData);
        // const result = await BikeServices.createBikeInDB(bikeData);

        // return res.status(200).json({
        res.status(200).json({
            success: true,
            message: 'Bike created successfully',
            data: result,
        });
    }
    catch (err) {
        // console.error(err);
        console.log(err);

        // Handle validation errors or unexpected errors
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: 'Error creating bike',
                error: err.message,
            });
        }

        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
            error: String(err),
        });
    }
};


// const getAllBikes = async (req: Request, res: Response): Promise<Response> => {
// const getAllBikes = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { searchTerm } = req.query;

//         // Define the type of the filter object
//         const filter: Record<string, unknown> = { isDeleted: false }; // Always exclude deleted bikes

//         if (searchTerm) {
//             const regex = new RegExp(searchTerm as string, 'i');
//             filter.$or = [
//                 { name: regex },
//                 { brand: regex },
//                 { category: regex },
//             ];
//         }

//         const bikes = await Bike.find(filter);

//         if (bikes.length === 0) {
//             res.status(404).json({
//                 success: false,
//                 message: "No bikes found matching the search criteria",
//                 data: [],
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Bikes fetched successfully",
//             data: bikes,
//         });
//     } catch (error) {
//         console.error("Error fetching bikes:", error);

//         // Explicitly return in the catch block to satisfy the compiler
//         res.status(500).json({
//             success: false,
//             message: "An error occurred while fetching bikes",
//         });
//     }
// };

const getAllBikes = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sortBy, sortOrder, searchTerm, category } = req.query;

    // Build filter object
    const filter: Record<string, unknown> = { isDeleted: false }; // Ensure only non-deleted bikes are fetched

    if (searchTerm) {
        filter.name = new RegExp(searchTerm as string, 'i'); // Search by bike name
    }

    if (category) {
        filter.category = category; // Filter by category if provided
    }

    // Construct query
    const query = {
        filter,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    };

    try {
        const result = await BikeServices.getAllBikesFromDB(query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Bikes fetched successfully',
            meta: {
                limit: query.limit,
                page: query.page,
                total: result.meta.total,
                totalPage: Math.ceil(result.meta.total / query.limit),
            },
            data: result.data,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error',
            data: null,
        });
    }
};

const getSingleBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bikeId } = req.params;

        const result = await BikeServices.getSingleBikeFromDB(bikeId);

        res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: result,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message || 'Something went wrong',
                error: err,
            });
        }
        // Unexpected error fallback
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};

// const getSingleBike = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await BikeServices.getSingleBikeFromDB(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Bike retrieved successfully',
//         data: result,
//     });
// });

const getBikeByIdOrModelNumber = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier } = req.params;

        const result = await BikeServices.getBikeByIdOrModelNumber(identifier);

        res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: result,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(404).json({
                success: false,
                message: err.message || 'Bike not found',
                error: err,
            });
        }
        // Unexpected error fallback
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};


// export const getBikeById = async (req: Request, res: Response): Promise<Response> => {
export const getBikeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const bike = await BikeServices.getBikeById(productId);

        if (!bike) {
            res.status(404).json({
                success: false,
                message: 'Bike not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: bike,
        });
    } catch (error) {
        // Narrow the type of error
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred',
                error: error.message,
            });
        }

        // Handle unexpected error types
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};

// const deleteBike = async (req: Request, res: Response): Promise<Response> => {
const deleteBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bikeId } = req.params;

        const result = await BikeServices.deleteBikeFromDB(bikeId);

        // res.status(200).json({
        //     success: true,
        //     message: 'Bike deleted successfully',
        //     data: result,
        // });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Bike deleted successfully',
            data: result,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message || 'Something went wrong',
                error: err,
            });
        }
        // Unexpected error fallback
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};



export const updateBikeHandler = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params; // Extract product ID from route params
    const updateData = req.body;     // Extract update data from request body

    try {
        // Call the service to update the bike
        const updatedBike = await BikeServices.updateBikeInDB(productId, updateData);

        // Respond with the updated bike details
        // res.status(200).json({
        //     success: true,
        //     data: updatedBike,
        // });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Bike is updated successfully',
            data: updatedBike,
        });
    } catch (error) {
        // Handle errors and send appropriate response
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Could not update the bike',
            });
        }

        // Handle unexpected error types
        res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
        });
    }
};


export const BikeControllers = {
    createBike,
    getAllBikes,
    getSingleBike,
    deleteBike,
    getBikeByIdOrModelNumber,
    getBikeById,
    updateBikeHandler,
    // createOrderHandler
};

