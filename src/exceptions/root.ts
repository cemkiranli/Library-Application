
export class HttpException extends Error {
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error
    }
}

export enum ErrorCode {
    USER_ALREADY_EXIST = 1001,
    BOOK_ALREADY_EXIST = 1002,
    BOOK_NOT_FOUND = 1003,
    THE_BOOK_WAS_BORROWED_BY_ANOTHER_USER = 1004,
    VALIDATION_FAILED = 1007,
    INVALID_FIELDS = 1008,
    SERVER_ERROR = 1009,
    NO_ACTIVE_BORROW_RECORD_FOUND = 1010,
    USER_NOT_FOUND = 1011
}