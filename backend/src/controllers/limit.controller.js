import asyncHandler from "../utils/asyncHandler.js";
import { Limit } from "../models/limit.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addLimit = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { amount, category, startDate, endDate } = req.body;
    const existingLimit = await Limit.findOne({
        user_id: req.user._id,
        category
    })
    if (existingLimit) {
        return res.status(401).json(new ApiResponse(401, "Limit Already exists"));
    }
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json(
            new ApiResponse(400, "End date must be after start date")
        );
    }
    // if(period!=="daily" && period!=="weekly" && period!=="monthly"){
    //     return res.status(400).json(
    //         new ApiResponse(400, "Invalid period")
    //     );
    // }
    const newLimit = await Limit.create({
        user_id: req.user._id,
        amount,
        // period,
        category,
        startDate,
        endDate
    })
    return res.status(201).json(new ApiResponse(201, "Limit added successfully"));
})


const getLimits = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized ");
    }
    const limits = await Limit.find({ user_id: userId }).populate('user_id');
    if (!limits) {
        return res.status(404).json(new ApiResponse(404, "No limits found"));
    }
    return res.status(200).json(new ApiResponse(200, "Limits found", limits));
})

const updateLimit = asyncHandler(async (req, res) => {
    console.log("body",req.body);
    const { limitId, amount, period, category, startDate, endDate } = req.body;

    if (!limitId) {
        return res.status(400).json(
            new ApiResponse(400, "Limit ID is required")
        );
    }

    const limit = await Limit.findOne({
        _id: limitId,
        user_id: req.user._id
    });

    if (!limit) {
        return res.status(404).json(
            new ApiResponse(404, "Limit not found")
        );
    }
    limit.amount = amount;
    limit.period = period;
    limit.category = category;
    limit.startDate = startDate;
    limit.endDate = endDate;
    await limit.save();
    return res.status(200).json(new ApiResponse(200, "Limit updated successfully"));
});

const deleteLimit = asyncHandler(async (req, res) => {
    const { limitId } = req.body;

    if (!limitId) {
        return res.status(400).json(
            new ApiResponse(400, "Limit ID is required")
        );
    }

    const limit = await Limit.findOneAndDelete({
        _id: limitId,
        user_id: req.user._id
    });

    if (!limit) {
        return res.status(404).json(
            new ApiResponse(404, "Limit not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Limit deleted successfully")
    );
});

export { addLimit, getLimits,updateLimit, deleteLimit };