const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

const SECRET_KEY = 'secret';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const authMiddleware = async (req, res, next) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) return res.status(401).send('Unauthorized');

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Invalid token');
    }
};

// const authMiddleware = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(403).json({ error: "No token provided" });
//     }

//     try {
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         req.user = decodedToken?.user_id;
//         next();
//     } catch (error) {
//         console.error("Token verification failed:", error);
//         return res.status(401).json({ error: "Unauthorized" });
//     }
// };


// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];  // Bearer <token>

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         req.user = decoded;  // Attach the decoded user to the request object
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token.' });
//     }
// };

module.exports = authMiddleware;
