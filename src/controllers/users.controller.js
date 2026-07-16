import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/user.services.js';
import { formatValidationErrors } from '#utils/format.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';


export const fetchAllUsers = async (req, res, next) => {
  try{
    logger.info('Fetching all users');

    const allUsers = await getAllUsers();
    res.status(200).json({ users: allUsers, message: 'Users fetched successfully' , count: allUsers.length});

  }
  catch(e){
    logger.error(e);
    next(e);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    logger.info('Fetching user by id');

    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user, message: 'User fetched successfully' });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    logger.info('Updating user');

    const paramsValidationResult = userIdSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(paramsValidationResult.error),
      });
    }

    const bodyValidationResult = updateUserSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(bodyValidationResult.error),
      });
    }

    const { id } = paramsValidationResult.data;
    const authUser = req.user;
    const authUserId = Number(authUser?.id);
    const isAdmin = authUser?.role === 'admin';

    if (!authUser || Number.isNaN(authUserId)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!isAdmin && authUserId !== id) {
      return res.status(403).json({ message: 'You can only update your own user' });
    }

    if (bodyValidationResult.data.role && !isAdmin) {
      return res.status(403).json({ message: 'Only admin users can change role' });
    }

    const user = await updateUserService(id, bodyValidationResult.data);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user, message: 'User updated successfully' });
  } catch (e) {
    logger.error(e);

    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    next(e);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    logger.info('Deleting user');

    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const authUser = req.user;
    const authUserId = Number(authUser?.id);
    const isAdmin = authUser?.role === 'admin';

    if (!authUser || Number.isNaN(authUserId)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!isAdmin && authUserId !== id) {
      return res.status(403).json({ message: 'You can only delete your own user' });
    }

    const user = await deleteUserService(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user, message: 'User deleted successfully' });
  } catch (e) {
    logger.error(e);

    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    next(e);
  }
};

export const fetchUserById = getUserByIdController;
export const updateUserById = updateUserController;
export const deleteUserById = deleteUserController;
export const getUserById = getUserByIdController;
export const updateUser = updateUserController;
export const deleteUser = deleteUserController;
