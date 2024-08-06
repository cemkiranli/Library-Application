import { Router } from 'express'
import { getAllUsers, signUp, borrowBook, returnBook, getUser } from '../controllers/user';

const userRoutes: Router = Router();

userRoutes.post('/users', signUp)

userRoutes.get('/users', getAllUsers)

userRoutes.post('/users/:userId/borrow/:bookId', borrowBook);

userRoutes.post('/users/:userId/return/:bookId', returnBook);

userRoutes.get('/users/:userId', getUser);

export default userRoutes;

