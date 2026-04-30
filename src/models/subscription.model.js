import mongoose, {Schema} from "mongoose";

// This schema stores a subscription relationship between two users.
// Each document means: "subscriber" follows/subscribes to "channel".
const subscriptionSchema = new Schema({
    subscriber: {
        // The user who is subscribing to another user's channel.
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        // The user/channel being subscribed to by the subscriber.
        type: Schema.Types.ObjectId,
        ref: "User"
    }
// timestamps automatically adds createdAt and updatedAt fields.
}, {timestamps: true})


// Creates the Subscription model so it can be used for database operations.
export const Subscription = mongoose.model("Subscription", subscriptionSchema)
