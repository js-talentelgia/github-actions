import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

// Store generated OTP and expiration time
let otpData = {};
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return {accessToken,refreshToken}

    } catch (error) {
        console.log('---------generated Token error---------', error);
        // return error
        // throw new ApiError(500, "Something went wrong while generating refresh token and access token");
        return res.status(500).json(
            new ApiResponse(500,error, "Something went wrong while generating refresh token and access token",true)
        )
    }
}
const loginAdmin = async (req, res) => {

    try {
        const { email, password} = req.body;
        if ([email, password].some((field) => !field || field === "")) {
            return res.status(400).json(
                new ApiResponse(400, null, "Email and password is required", true)
            );
        }
        const user = await User.findOne({ email: email });
        
        if (!user) {
            // throw new ApiError(401, "User does not exist")
            return res.status(404).json(new ApiResponse(404,null,"Email not found", true));
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(404).json(new ApiResponse(404,null,"Invalid login credentials", true));

        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        if(!loggedInUser){
            return res.status(404).json(new ApiResponse(404,null,"Admin not logged in"));
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user: loggedInUser, accessToken, refreshToken },
                    "Admin logged in successfully")
            );
    } catch (error) {
         console.error("Error in loginUser:", error)
         return res.status(400).json(
             new ApiResponse(400,error, "Something went wrong!",true)
         )
    }
}

const loggOutAdmin = asyncHandler(async (req, res) => {

    try {

        console.log(req.user);
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true
        }
        )
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User logged out")
            );    
    } catch (error) {
        console.log('--------admin login error--------',error);
    }


    
})

const refreshAccessToken = asyncHandler(async (req, res) => {
        const incommingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
        if (!incommingRefreshToken) {
            throw new ApiError(400, "unauthenticated request");
        }
        try {
            const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id);
            if (!user) { 
                throw new ApiError(401, "invalid refresh token");
            }
            if(incommingRefreshToken !== user?.refreshToken){
                throw new ApiError(401, "Refresh token is expired or used");
            }
            const options = {
                httpOnly: true,
                secure: true
            }
            const {accessToken, newrefreshToken} = generateAccessTokenAndRefreshToken(user._id)

            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                        200,
                        { accessToken, refreshToken: newrefreshToken },
                        "Access token refreshed "
                    )
                )

        } catch (error) {
            
        }
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user?._id);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Password is incorrect");
        }
        user.password = newPassword;
        await user.save({validateBeforeSave: false});
        return res
                 .status(200)
                 .json(new ApiResponse(
                    200,
                    {},
                    "Password changed successfully"
                 ))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
       200,
       req.user,
       "Current user fetched successfully"
    ))
})

export { loginAdmin, loggOutAdmin, refreshAccessToken, changeCurrentPassword, 
         getCurrentUser }