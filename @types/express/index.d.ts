// eslint-disable-next-line no-unused-vars
declare namespace Express {
    export interface Request {
        auth: {
            id: number,
            token: string
            email: string
            firstName: string,
            lastName: string
            password: string,
        }
    }
}
