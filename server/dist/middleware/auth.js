import { verifyAuthToken } from '../lib/auth.js';
import { ApiError } from '../lib/http.js';
const COOKIE_NAME = 'veloura.session';
function getBearerToken(request) {
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return null;
    }
    return authorization.slice('Bearer '.length).trim();
}
function getCookieToken(request) {
    return request.cookies?.[COOKIE_NAME] ?? null;
}
export function authenticate(request, _response, next) {
    try {
        const token = getCookieToken(request) ?? getBearerToken(request);
        if (!token) {
            throw new ApiError(401, 'Authentication required.');
        }
        request.auth = verifyAuthToken(token);
        next();
    }
    catch (error) {
        next(error);
    }
}
export function requireRole(role) {
    return (request, _response, next) => {
        if (!request.auth) {
            next(new ApiError(401, 'Authentication required.'));
            return;
        }
        if (request.auth.role !== role) {
            next(new ApiError(403, 'You do not have permission to access this resource.'));
            return;
        }
        next();
    };
}
