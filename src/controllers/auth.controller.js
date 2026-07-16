import logger from '#config/logger.js';
import { signInSchema, signUpSchema } from '#validations/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }
    const { name, email, password, role } = validationResult.data;
    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({
      id: user.id,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    //AuthService

    logger.info(`User with email : ${email} signed up successfully`);

    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error(`Error in signUp controller: ${e.message}`);

    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: e.message });
    }
    next(e);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;
    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User with email : ${email} signed in successfully`);

    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error(`Error in signIn controller: ${e.message}`);

    if (e.message === 'User not found') {
      return res.status(404).json({ error: e.message });
    }

    if (e.message === 'Invalid password') {
      return res.status(401).json({ error: e.message });
    }

    next(e);
  }
};

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');

    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    logger.error(`Error in signOut controller: ${e.message}`);
    next(e);
  }
};
