import { Router } from 'express'
import { getAllUsers, signUp } from '../controllers/user';

const userRoutes: Router = Router();

userRoutes.post('/users', signUp)

userRoutes.get('/users', getAllUsers)

export default userRoutes;

