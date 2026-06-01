import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
	userId: string;
	email: string;
	iat: number;
	exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		(req as any).userId = process.env.DEMO_USER_ID || "demo-user";
		return next();
	}

	try {
		const jwtSecret = process.env.JWT_SECRET || "secret";
		const decoded = jwt.verify(token, jwtSecret as any) as DecodedToken;
		(req as any).userId = decoded.userId;
		next();
	} catch (error) {
		(req as any).userId = process.env.DEMO_USER_ID || "demo-user";
		next();
	}
};

export const generateToken = (userId: string, email: string) => {
	const jwtSecret = process.env.JWT_SECRET || "secret";
	return jwt.sign(
		{ userId, email },
		jwtSecret as any,
		{ expiresIn: process.env.JWT_EXPIRE || "7d" } as any,
	);
};
