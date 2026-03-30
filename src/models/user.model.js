import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// Defines how user data is stored in MongoDB.
const userSchema = new Schema(
    {
         // Unique public username used to identify a user.
         username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
            index: true
        },
        // User email used for login or communication.
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        // Full name shown on the profile.
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        // Profile image URL.
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        // Optional banner image for the user's profile.
        coverImage: {
            type: String, // cloudinary url
        },
        // Stores references to videos watched by the user.
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        // Stores the user's hashed password.
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        // Stores the current refresh token for session handling.
        refreshToken: {
            type: String
        }

    },
    {
        // Automatically adds createdAt and updatedAt fields.
        timestamps: true
    }
)

// Before saving, hash the password only if it was newly added or changed.

//---------It gives error---------------
// When using async/await in Mongoose middleware, do not use next(); async functions return a Promise, and mixing both patterns can cause errors like "next is not a function".

// userSchema.pre("save", async function (next){     // yha arrow function isliye use nhi kiya kyuki arrow func me this nhi hota and without this we cannnot access object elements
//     if(!this.isModified("password")) return next();

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })
//---------------------------------------------

//------Right way--------
userSchema.pre("save", async function (){     // yha arrow function isliye use nhi kiya kyuki arrow func me this nhi hota and without this we cannnot access object elements
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

// Compares a plain password with the stored hashed password.
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// Creates a short-lived access token with user identity data.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Creates a long-lived refresh token used to issue new access tokens.
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Creates and exports the user model from the schema above.
export const User = mongoose.model("user", userSchema)
