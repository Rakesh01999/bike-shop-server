import mongoose, { FilterQuery } from "mongoose";
import { TBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeInDB = async (bikeData: TBike) => {
    if (await Bike.isBikeExists(bikeData.modelNumber)) {
        throw new Error("Bike already exists");
    }
    const result = await Bike.create(bikeData);
    return result;
};

export const getAllBikesFromDB = async (filter: FilterQuery<TBike>) => {
    try {
        const bikes = await Bike.find(filter);
        return bikes;
    } catch (error: unknown) {
        console.error("Error fetching bikes:", error);
        throw new Error("Error fetching bikes from database");
    }
};

const getSingleBikeFromDB = async (id: string) => {
    const result = await Bike.aggregate([{ $match: { modelNumber: id } }]);
    return result;
};

const getBikeByIdOrModelNumber = async (identifier: string) => {
    const bike = await Bike.findOne({
        $or: [{ _id: identifier }, { modelNumber: identifier }],
    });

    if (!bike) {
        throw new Error("Bike not found");
    }
    return bike;
};

const getBikeById = async (productId: string) => {
    try {
        const bike = await Bike.findById(productId);
        return bike;
    } catch (error: unknown) {
        console.error("Error fetching bike by ID:", error);
        throw new Error("Invalid ID format or database error");
    }
};

const deleteBikeFromDB = async (_id: string) => {
    const result = await Bike.updateOne({ _id }, { isDeleted: true });
    return result;
};

const updateBikeInDB = async (productId: string, updateData: Partial<TBike>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("Invalid Product ID");
        }

        const updatedBike = await Bike.findByIdAndUpdate(
            productId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedBike) {
            throw new Error("Bike not found or could not be updated");
        }

        return updatedBike;
    } catch (error: unknown) {
        console.error("Error updating bike:", error);
        throw new Error("An error occurred while updating the bike");
    }
};

export const BikeServices = {
    createBikeInDB,
    getAllBikesFromDB,
    getSingleBikeFromDB,
    deleteBikeFromDB,
    getBikeByIdOrModelNumber,
    getBikeById,
    updateBikeInDB,
};
