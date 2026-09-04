

//so when I call it I have to give two parameter one status code and other is message
// THIS IS SOMETHING SPECIAL
export class AppError extends Error {

    public statusCode: number

    constructor(statusCode: number, message: string, stack = "") {
        super(message) // throw new Error(message)

        this.statusCode = statusCode

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

//throw new AppError(404, "Not Found")