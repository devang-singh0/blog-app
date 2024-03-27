import jwt from "jsonwebtoken";

const secret = 'jsonwebtokensecretkey$#1234';

export function setTokenToUser(user) {
    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
    };
    const token = jwt.sign(payload, secret);
    return token;
}

export function getUserFromToken(token) {
    try {
        const user = jwt.verify(token, secret);
        return user;
    } catch (error) {
        // Handle invalid or expired token
        console.error('Invalid token:', error);
        return null;
    }
}