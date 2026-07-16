import logger from '#config/logger.js';
import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';

const unauthorizedResponse = res =>
  res
    .status(401)
    .json({ error: 'Unauthorized', message: 'Authentication required' });

export const authenticate = (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      return unauthorizedResponse(res);
    }

    const decoded = jwttoken.verify(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (e) {
    logger.error(`Authentication failed: ${e.message}`);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const authorizeSelfOrAdmin = (req, res, next) => {
  try {
    const requestUserId = Number(req.user?.id);
    const requestedUserId = Number(req.params.id);
    const isAdmin = req.user?.role === 'admin';

    if (Number.isNaN(requestUserId) || Number.isNaN(requestedUserId)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid user id',
      });
    }

    if (requestUserId === requestedUserId || isAdmin) {
      return next();
    }

    return res.status(403).json({
      error: 'Forbidden',
      message: 'You can only access your own user unless you are an admin',
    });
  } catch (e) {
    logger.error(`Authorization failed: ${e.message}`);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with authorization',
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      return next();
    }

    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  } catch (e) {
    logger.error(`Authorization failed: ${e.message}`);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with authorization',
    });
  }
};
