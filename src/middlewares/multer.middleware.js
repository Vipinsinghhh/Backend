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

// we can also give more data in multer like, thats why multer ke andr object me data pass krna hota he and keys name bhi fixed hoti he jese storage, limit etc.
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 },
//   fileFilter: (req, file, cb) => {}
// })

export default upload
