import { ErrorCode, HttpException } from "./root";

export class InternalServerErrorException extends HttpException {
    constructor(message: string, errorCode: ErrorCode){
        super(message, errorCode, 500, null)
    }
}