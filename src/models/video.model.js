import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Defines how a video document is stored in MongoDB.
const videoSchema = new Schema(
    {
        // Stores the uploaded video URL.
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        // Stores the preview image URL shown before playback.
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        // Main title displayed for the video.
        title: {
            type: String, 
            required: true
        },
        // Text explaining what the video is about.
        description: {
            type: String, 
            required: true
        },
        // Length of the video, usually stored in seconds.
        duration: {
            type: Number, 
            required: true
        },
        // Counts how many times the video has been watched.
        views: {
            type: Number,
            default: 0
        },
        // Controls whether the video is visible to users.
        isPublished: {
            type: Boolean,
            default: true
        },
        // Links this video to the user who uploaded it.
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        // Automatically adds createdAt and updatedAt fields.
        timestamps: true
    }
)

// Adds pagination support for aggregation pipelines on videos.
videoSchema.plugin(mongooseAggregatePaginate)

// Creates and exports the Video model based on the schema above.
export const Video = mongoose.model("Video", videoSchema)
