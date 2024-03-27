import { getUserFromToken } from "../services/auth.js";

function authenticationMiddleware(req, res, next) {
    const uid = req.cookies?.uid;
    if (uid) {
        const user = getUserFromToken(uid);
        if (user) {
            req.user = user;
        }
    }

    next();
}

export default authenticationMiddleware;
