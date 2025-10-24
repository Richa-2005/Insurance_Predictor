import admin from 'firebase-admin';

// Authentication Middleware
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token == null) {
    console.log('Auth Middleware: No token provided.');
    return res.status(401).json({ error: 'Authentication required: No token provided.' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Add the user's Firebase UID to the request object
    req.user = { uid: decodedToken.uid };
    console.log(`Auth Middleware: Token verified for user UID: ${req.user.uid}`);
    next(); // Proceed to the next route handler
  } catch (error) {
    console.error('Auth Middleware: Invalid or expired token.', error.message);
    return res.status(403).json({ error: 'Authentication failed: Invalid or expired token.' });
  }
};
