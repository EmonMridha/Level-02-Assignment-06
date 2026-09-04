import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import { ILogin, IUser } from "./users.interface"
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";

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
        },
        omit: {
            password: true
        }
    })

    return createUser

}

const loginUser = async (payload: ILogin) => {
    const { email, password } = payload;

    // finding user in database
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    // matching password
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // creating jwt payload
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };


    // Creating accessToken
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    // Creating Refresh token
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };

}

export const userService = {
    createUser,
    loginUser
}