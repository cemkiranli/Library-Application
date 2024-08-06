import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SignUpDto } from '../dto/user.dto';
import { InternalServerErrorException } from '../exceptions/server-error';
import { NotFoundException } from '../exceptions/not-found';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signUpDto = plainToClass(SignUpDto, req.body);

        const errors = await validate(signUpDto);

        if (errors.length > 0) {
            return next(new BadRequestsException('Validation failed.', ErrorCode.VALIDATION_FAILED, errors));
        }

        const { name } = req.body;

        let user = await prismaClient.user.findFirst({ where: { name } });

        if (user) {
            return next(new BadRequestsException('User already exists.', ErrorCode.USER_ALREADY_EXIST));
        }

        user = await prismaClient.user.create({
            data: {
                name: name,
            }
        });

        res.json(user);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prismaClient.user.findMany();
        
        res.json(users);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};

export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);

    try {
        const book = await prismaClient.book.findUnique({ where: { id: bookId } });

        if (!book) {
            return next(new NotFoundException('Book not found.', ErrorCode.BOOK_NOT_FOUND));
        }

        if (await prismaClient.borrowRecord.findFirst({ where: { bookId, returnedAt: null } })) {
            return next(new BadRequestsException('The book was already borrowed by another user.', ErrorCode.THE_BOOK_WAS_BORROWED_BY_ANOTHER_USER));
        }

        const borrowRecord = await prismaClient.borrowRecord.create({
            data: {
                book: { connect: { id: bookId } },
                user: { connect: { id: userId } },
                borrowedAt: new Date(),
            },
        });

        res.json(borrowRecord);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);
    const userScore = parseInt(req.body.score); 

    try {

        const record = await prismaClient.borrowRecord.findFirst({
            where: { bookId, userId, returnedAt: null },
            orderBy: { borrowedAt: 'desc' },
        });

        if (!record) {
            return next(new NotFoundException('No active borrow record found', ErrorCode.NO_ACTIVE_BORROW_RECORD_FOUND));
        }

        const updatedRecord = await prismaClient.borrowRecord.update({
            where: { id: record.id },
            data: {
                returnedAt: new Date(),
                score: userScore,
            },
        });

        const bookWithScores = await prismaClient.book.findUnique({
            where: { id: bookId },
            include: { borrowRecords: true },
        });

        if (!bookWithScores) {
            return next(new NotFoundException('Book not found.', ErrorCode.BOOK_NOT_FOUND));
        }

        const scores = bookWithScores.borrowRecords
            .filter(record => record.score !== null)
            .map(record => record.score as number);
        
        const averageScore = scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : 0;

        const updatedBook = await prismaClient.book.update({
            where: { id: bookId },
            data: {
                user_score: averageScore,
            },
        });

        res.json(updatedBook);
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);

    try {

        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: {
                borrowedBooks: {
                    include: {
                        book: true,
                    },
                },
            },
        });

        if (!user) {
            return next(new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND));
        }

        const pastBooks = user.borrowedBooks
            .filter(record => record.returnedAt !== null)
            .map(record => ({
                name: record.book.name,
                userScore: record.score,
            }));

        const presentBooks = user.borrowedBooks
            .filter(record => record.returnedAt === null)
            .map(record => ({
                name: record.book.name,
            }));

        res.json({
            id: user.id,
            name: user.name,
            books: {
                past: pastBooks,
                present: presentBooks,
            },
        });
    } catch (e: unknown) {
        return next(new InternalServerErrorException('Unable to retrieve data from DB!', ErrorCode.SERVER_ERROR));
    }
};
