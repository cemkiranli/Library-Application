import { Router } from 'express'
import { createBook, getAllBooks, getBook } from '../controllers/book';

const bookRoutes: Router = Router();

bookRoutes.post('/books', createBook)

bookRoutes.get('/books', getAllBooks)

bookRoutes.get('/books/:bookId', getBook);

export default bookRoutes;

