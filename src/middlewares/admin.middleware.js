import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
export const verfiyJwt = asyncHandler(async (req, res, next) => {
    try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', '');
            if (!token) {
                // throw new ApiError(401, "Unauthorized request");
                return res.status(401).json(
                    new ApiResponse(401,null, "Unauthorized request",true)
                )
            }
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if (!user) {
                // NEXT_VIDEO: disuss about the frontend
                // throw new ApiError(401, "invalid access token");
                return res.status(401).json(
                    new ApiResponse(401,null, "invalid access token",true)
                )
            }
            req.user = user;
            next();
    } catch (error) {
        return res.status(401).json(
            new ApiResponse(401,null, "invalid access token",true)
        )
            // throw new ApiError(401, error?.message || "Invalid access token")
    }
})