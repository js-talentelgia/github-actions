import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import roleList from "../helpers/role.js";
export const verfiyRole = asyncHandler(async (req, res, next) => {
    try {
        const { role } = req.body;
        const checkRole = getKeyByValue(roleList, role);
        if(checkRole === undefined) {
            return res.status(404).json(
                new ApiResponse(404,null,"Invalid role id",true)
            )
        }
        next();
    } catch (error) {
            console.log(error);
            return res.status(404).json(
                new ApiResponse(401,null, error?.message || "Invalid role id", true)
            )
    }
})

function getKeyByValue(object, value) {
    return Object.keys(object).find(key =>
        object[key] === value);
}
 