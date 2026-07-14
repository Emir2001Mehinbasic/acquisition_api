import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin access limit reached';
        break;
      case 'user':
        limit = 10;
        message = 'User access limit reached';
        break;
      case 'guest':
        limit = 5;
        message = 'Access limit reached';
        break;
    }

    const client = aj.withRule('slidingWindow', {
      mode: 'LIVE',
      interval: 60,
      max: limit,
      name: `${role}-rate-limit`,
    });

    const decision = await client.protect(req);

    if (decision.isDenied && decision.reason.isBot()) {
      logger.warn('Bot detected and blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res
        .status(403)
        .json({ error: 'Access denied', message: 'Bot detected' });
    }
    if (decision.isDenied && decision.reason.isShield()) {
      logger.warn('Shield detected and blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      return res
        .status(403)
        .json({ error: 'Access denied', message: 'Shield detected' });
    }
    if (decision.isDenied && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      return res
        .status(429)
        .json({ error: 'Access denied', message: 'Rate limit exceeded' });
    }
    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};

export default securityMiddleware;
