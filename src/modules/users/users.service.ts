import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import { IUser } from "./users.interface"
import httpStatus from "http-status";

const createUser = async (payload: IUser) => {

    const { name, email, password } = payload

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (!password) {
        throw new AppError(httpStatus.NOT_FOUND, "password not found")
    }

    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const createUser = await prisma.user.create({
        data: {
            name: name,
            password: hashedPassword,
            email
        }
    })

    return createUser

}

export const userService = {
    createUser
}