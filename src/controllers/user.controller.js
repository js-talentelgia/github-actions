import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

const sendOtp = asyncHandler(async (req, res) => {
    try {
    const { phone_no } = req.body
    const OTP = await generateOtp();
    // console.log(OTP);
    const expirationTime = Date.now() + 60000; // 1 minute expiration time
    otpData[phone_no] = {
        OTP,
        expirationTime,
    };
    const data = {OTP: `${OTP}`}
    return res.status(200).json(
        new ApiResponse(200,data, "OTP sent successfully")
    )
    } catch (error) {
        console.log('---------send otp error: ', error);
        return res.status(400).json(
            new ApiResponse(400,error, "Something went wrong!",true)
        )
    }
})
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { phone_no, deviceType, deviceId, otp, role } = req.body
        const storedOTPData = otpData[phone_no];
        if (!storedOTPData || storedOTPData.expirationTime < Date.now()) {
            return res.status(400).json(
                new ApiResponse(400,null, "OTP has expired", true)
            )
        }    
        if (storedOTPData.OTP != otp) {
            return res.status(400).json(
                new ApiResponse(400,null, "Invalid OTP", true)
            )
        }

        const existedUser = await User.findOne({ phone_no: phone_no})
        if (existedUser) {
            delete otpData[phone_no];
            return await loginUser(existedUser, res)
        }

        if ([phone_no, otp, role, deviceType, deviceId].some((field) => !field || field === "")) {
            return res.status(400).json(
                new ApiResponse(400, null, "All fields are required", true)
            );
        }
        const deviceTypes = ["ios", "android"];
        const checkDeviceType = deviceTypes.includes(deviceType); // is true
        if(!checkDeviceType){
            return res.status(404).json(
                new ApiResponse(404,null, "Invalid device type", true)
            )
        }
        const user = await User.create({
            phone_no: phone_no,
            deviceType: deviceType,
            deviceId: deviceId,
            role: role,
            status: "Verified",

        })
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if (!createdUser) {
            return res.status(500).json(
                new ApiResponse(500, null, "Something went wrong while registering the user", true)
            )
        }
        delete otpData[phone_no];
        return await loginUser(user, res)
    } catch (error) {
        console.error("Error in registerUser:", error)
        return res.status(400).json(
            new ApiResponse(400,error, "Something went wrong!",true)
        )
    }
    
})
const loginUser = async (req, res) => {

    try {
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(req._id);
        const loggedInUser = await User.findById(req._id).select("-password -refreshToken");
        if(!loggedInUser){
            return res.status(404).json(new ApiResponse(404,null,"User not logged in"));
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
                    "User logged in successfully")
            );
    } catch (error) {
         console.error("Error in loginUser:", error)
         return res.status(400).json(
             new ApiResponse(400,error, "Something went wrong!",true)
         )
    }
}

const loggOutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
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
    // return res.status(200).json(201, req.user, "Current user fetched successfully")
    return res
                 .status(200)
                 .json(new ApiResponse(
                    200,
                    req.user,
                    "Current user fetched successfully"
                 ))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
        const {fullname, email} = req.body
        if(!fullname || !email){
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullname,
                    email
                }
            },
            {
                new: true
            }
            ).select("-password");
            return res
            .status(200)
            .json(200, user, "Account details updated successfully")
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select('-password')
    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"))
})
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select('-password')
    return res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully"))
})

const generateOtp = async (req, res) => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    return otp; 
}


export { sendOtp, registerUser, loginUser, loggOutUser, refreshAccessToken, changeCurrentPassword, 
         getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage }