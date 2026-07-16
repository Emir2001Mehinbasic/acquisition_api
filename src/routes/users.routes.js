import {
  deleteUserById,
  fetchAllUsers,
  fetchUserById,
  updateUserById,
} from '#controllers/users.controller.js';
import {
  authenticate,
  authorizeSelfOrAdmin,
} from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchAllUsers);
router.get('/:id', authenticate, authorizeSelfOrAdmin, fetchUserById);
router.put('/:id', authenticate, authorizeSelfOrAdmin, updateUserById);
router.delete('/:id', authenticate, authorizeSelfOrAdmin, deleteUserById);

export default router;
