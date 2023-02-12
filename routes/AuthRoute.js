import express from 'express';
import { register, login } from '../controllers/Auth.js';
const router = express.Router();

// router.route('/register').post(register);
router.post('/register', register);
router.post('/login', login);


export default router;