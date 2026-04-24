import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configure Cloudinary using credentials loaded from environment variables.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Stop early if there is no local file to upload.
        if(!localFilePath) return null
        // Upload the temporary local file and let Cloudinary detect the file type automatically.
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("Cloudinary upload response:", response); // Log the full response for debugging purposes.  

        // Log the uploaded file URL so it is easier to confirm the upload during development.
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as we have already uploaded it on cloudinary and we do not need it anymore on disk. 
        
        return response;
        
    } catch (error) {
        // Remove the temp file if the upload fails so it does not stay on disk.
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return null

    const publicIdWithExtension = fileUrl.split("/upload/").pop()?.replace(/^v\d+\//, "")
    const publicId = publicIdWithExtension?.replace(/\.[^/.]+$/, "")

    if (!publicId) return null

    return await cloudinary.uploader.destroy(decodeURIComponent(publicId))
}

export default uploadOnCloudinary
