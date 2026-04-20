import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose" 

const generateAccessAndRefereshTokens = async(userId) => {
    try {
        // Load the user document so instance methods can generate JWT tokens.
        const user = await User.findById(userId)

        // Create a short-lived access token and a longer-lived refresh token.
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Save the new refresh token in DB so it can be verified later.
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        // Send a common server error if token generation or saving fails.
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    //get user details from frontend 
    //validation - not empty
    //check if user already exists: username, email
    //check for image, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const { fullName, email, username, password } = req.body
    // console.log("email:", email);
    // console.log(req.body);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // console.log("avatarLocalPath:", avatarLocalPath);


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    // Require login identity before checking the database.
    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    // Find the account using either the provided username or email.
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // Compare the entered password with the hashed password stored in DB.
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // Create fresh tokens and also store the refresh token on the user document.
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    // Send back a safe user object without sensitive fields.
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // Store tokens in secure cookies and also return them in the JSON response.
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )


})

const logoutUser = asyncHandler(async(req, res) => {
    // Remove the stored refresh token so old sessions cannot be refreshed again.
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly:true,
        secure: true 
    }

    // Clear both auth cookies from the browser to complete logout on client side.
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User logged Out"))
})

// Verify the refresh token and issue a fresh access token for the active user session.
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Read the refresh token from cookies first, and fall back to request body if needed.
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    // Stop immediately if the client did not send any refresh token.
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        // Decode and verify the refresh token using the refresh token secret.
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // Find the user whose id was stored inside the verified token payload.
        const user = await User.findById(decodedToken?._id)

        // If no matching user exists, the token should not be trusted.
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        // Compare the incoming token with the one saved in DB to block reused or old tokens.
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        // Define secure cookie settings for the new tokens that will be sent back.
        const options = {
            httpOnly: true,
            secure: true
        }

        // Generate a new access token and refresh token pair for the user.
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

        // Return the fresh tokens in both cookies and JSON response.
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        // Handle invalid, expired, or tampered refresh tokens with a consistent auth error.
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
