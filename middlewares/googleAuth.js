import admin from 'firebase-admin';
// import serviceAccount from '../config/serviceAccountKey.json' assert { type: 'json' };
import User from '../models/userModel.js';
import { configDotenv } from "dotenv";

configDotenv();

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Middleware to verify the token
export const verifyToken = async (req, res, next) => {
    const { access_token } = req.body; // Extract token from request body

    if (!access_token) {
        return res.status(401).json({ message: 'Token missing from backend' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        
        // Verify if the token is valid
        if (!decodedToken) {
            return res.status(401).json({ message: 'Token expired' });
        }

        const { email, name, picture } = decodedToken;

        // Check if the user exists in the database
        const userData = await User.findOne({ email });
        
        // Attach user data or necessary token data to the request
        req.user = userData || { email, name, picture }; // temp user if not found
        
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Token verification failed:', error.message); // Log the error message
        return res.status(401).json({ message: 'Unauthorized: ' + error.message }); // Provide error details
    }
};
