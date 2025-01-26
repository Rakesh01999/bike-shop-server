import express from 'express';
import { UserControllers } from './user.controller';
import { createUserValidationSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-user',
  // auth(USER_ROLE.user),
  validateRequest(createUserValidationSchema),
  UserControllers.createUser,
);

router.get('/', UserControllers.getAllUsers);

// router.get('/:userId', UserControllers.getSingleUser);
router.get('/:id', UserControllers.getSingleUser);

router.patch('/:id', UserControllers.updateUser);

router.delete('/:id', UserControllers.deleteUser);

export const UserRoutes = router;
