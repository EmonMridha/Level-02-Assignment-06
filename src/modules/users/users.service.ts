import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import { ILogin, IUser } from "./users.interface"
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";

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

const getMe = async (user: any) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: user.email
        },
        omit: {
            password: true
        }
    });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return isUserExists;
}

const refreshToken = async (oldRefreshToken: string) => {
    // finding the owner of the refreshToken
    const verifiedRefreshToken = jwtUtils.verifyToken(
        oldRefreshToken,
        config.jwt_refresh_secret,
    );

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            config.node_env === "development"
                ? verifiedRefreshToken.error
                : "Invalid refresh token",
        );
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    // finding the owner info in the database
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is inactive or not found");
    }

    if (!user.isActive) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account is inactive",
        );
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    // creating new accessToken
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    // creating new refreshToken
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

const googleLogin = async(payload: any) => {
    
}


export const userService = {
    createUser,
    loginUser,
    getMe,
    refreshToken
}