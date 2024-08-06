import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SignUpDto } from '../dto/user.dto';
import { InternalServerErrorException } from '../exceptions/server-error';

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
