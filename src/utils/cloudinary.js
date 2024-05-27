import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async function(localFilePath) {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, 
            {
                resource_type:  "auto"
            }
        );
         // remove the locally temp file as the upload option got failed..
         fs.unlinkSync(localFilePath);
        console.log("File uploaded successfully..", response.url);
        return response;    
    } catch (error) {
        // remove the locally temp file as the upload option got failed..
        fs.unlinkSync(localFilePath);
        return null;
    }
} 

export { uploadOnCloudinary }