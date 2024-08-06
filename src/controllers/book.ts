import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { InternalServerErrorException } from '../exceptions/server-error';
import { CreateBookDto } from '../dto/book.dto';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createBookDto = plainToClass(CreateBookDto, req.body);

        const errors = await validate(createBookDto);

        if (errors.length > 0) {
            return next(new BadRequestsException('Validation failed.', ErrorCode.VALIDATION_FAILED, errors));
        }

        const { name } = req.body;

        let book = await prismaClient.book.findFirst({ where: { name } });

        if (book) {
            return next(new BadRequestsException('Book already exists.', ErrorCode.BOOK_ALREADY_EXIST));
        }

        book = await prismaClient.book.create({
            data: {
                name: name,
                user_score: 0
            }
        })

        res.json(book);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await prismaClient.book.findMany();
        
        res.json(books);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};
