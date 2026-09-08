import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IGoogleLoginPayload, ILogin, IUser } from "./users.interface";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import { TokenPayload } from "google-auth-library";
import { Role } from "../../../generated/prisma/enums";

const createUser = async (payload: IUser) => {
    const { name, email, password } = payload;

    if (!password) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Password is required"
        );
    }

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            "User with this email already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const createUser = await prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            email,
        },
        omit: {
            password: true,
        },
    });

    return createUser;
};

const loginUser = async (payload: ILogin) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account is inactive"
        );
    }

    if (!user.password) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Please login using Google"
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const getMe = async (user: any) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: user.email,
        },
        omit: {
            password: true,
        },
    });

    if (!isUserExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User not found"
        );
    }

    if (!isUserExists.isActive) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account is inactive"
        );
    }

    return isUserExists;
};

const refreshToken = async (oldRefreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(
        oldRefreshToken,
        config.jwt_refresh_secret,
    );

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            config.node_env === "development"
                ? verifiedRefreshToken.error
                : "Invalid or expired refresh token",
        );
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: {
            id: data.userId,
        },
    });

    if (!user) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "User not found"
        );
    }

    if (!user.isActive) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account is inactive"
        );
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
    let googleIdTokenPayload: TokenPayload | null | undefined = null;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config.google_client_id,
        });

        googleIdTokenPayload = ticket.getPayload();
    } catch (error) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Invalid or expired Google ID token"
        );
    }

    if (!googleIdTokenPayload) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Invalid or expired Google ID token"
        );
    }

    if (
        !googleIdTokenPayload.email ||
        !googleIdTokenPayload.name ||
        !googleIdTokenPayload.sub
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid Google ID token payload"
        );
    }

    const existingGoogleUser = await prisma.user.findUnique({
        where: {
            gcpId: googleIdTokenPayload.sub,
        },
    });

    let user = existingGoogleUser;

    if (!user) {
        const existingEmailUser = await prisma.user.findUnique({
            where: {
                email: googleIdTokenPayload.email,
            },
        });

        if (existingEmailUser) {
            throw new AppError(
                httpStatus.CONFLICT,
                "An account with this email already exists. Please login with email and password."
            );
        }

        user = await prisma.user.create({
            data: {
                name: googleIdTokenPayload.name,
                email: googleIdTokenPayload.email,
                gcpId: googleIdTokenPayload.sub,
                role: Role.CUSTOMER,
            },
        });
    }

    if (!user.isActive) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account is inactive"
        );
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const userService = {
    createUser,
    loginUser,
    getMe,
    refreshToken,
    googleLogin,
};