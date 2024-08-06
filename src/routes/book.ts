import { Router } from 'express'
import { createBook, getAllBooks } from '../controllers/book';

const bookRoutes: Router = Router();

bookRoutes.post('/books', createBook)

bookRoutes.get('/books', getAllBooks)

export default bookRoutes;

