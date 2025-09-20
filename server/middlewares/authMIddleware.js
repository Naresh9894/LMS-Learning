import { clerkClient } from "@clerk/express";

//Middleware to check if user is authenticated
export const protectEducator = async (req, res, next) => {
    try{
        const userId = req.auth();
        const response = await clerkClient.users.getUser(userId);
        if(response.publicMetadata.role !== 'educator'){
            return res.json({success: false, message: "You are not authorized to access this resource"});
        }
        next();
        
    }catch(error){
        res.json({success: false, message: error.message});
    }

}