import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { InternalServerErrorException } from '../exceptions/server-error';
import { CreateBookDto } from '../dto/book.dto';
import { NotFoundException } from '../exceptions/not-found';

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

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = parseInt(req.params.bookId);

    try {
        const book = await prismaClient.book.findUnique({
            where: { id: bookId },
            include: { borrowRecords: true },
        });

        if (!book) {
            return next(new NotFoundException('Book not found.', ErrorCode.BOOK_NOT_FOUND));
        }

        const scores = book.borrowRecords
            .filter(record => record.score !== null)
            .map(record => record.score as number);
        
        const averageScore = scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : -1;

        res.json({
            id: book.id,
            name: book.name,
            score: averageScore,
        });
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};
