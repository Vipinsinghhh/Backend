import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"; 


export const verifyJWT = asyncHandler(async(req, res, next) => {
    try{
        // Read the access token either from cookies or from the Authorization header.
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        //console.log(token);

        // Stop the request early if no token was provided.
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // Verify the token signature and decode the payload using the access token secret.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Fetch the current user from DB and exclude sensitive fields from req.user.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        // If no user is found, the token should be treated as invalid.
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // Attach the authenticated user to the request for the next middleware/controller.
        req.user = user;
        next()

    }catch (error){
        // Convert any token verification or DB lookup failure into an unauthorized error.
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
})
