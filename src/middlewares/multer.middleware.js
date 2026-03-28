import multer from "multer"

// Store incoming files temporarily on disk before moving them elsewhere.
const storage = multer.diskStorage({
    destination: function( req, file, cb){
        // Save uploaded files inside the temp folder.
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb){
        // Keep the original file name for the temporary local copy.
        cb(null, file.originalname)
    }
})

// Export a ready-to-use multer instance that uses the disk storage config above.
const upload = multer({storage,})

export default upload
