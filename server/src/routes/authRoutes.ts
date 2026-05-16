import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validate } from '../middleware/validateMiddleware';

const router = express.Router();

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/password', protect, updatePassword);

export default router;
