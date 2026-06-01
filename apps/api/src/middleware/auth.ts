import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
	userId: string;
	email: string;
	name?: string;
	iat: number;
	exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		(req as any).userId = process.env.DEMO_USER_ID || "demo-user";
		(req as any).userName = process.env.DEMO_USER_NAME || "Demo User";
		return next();
	}

	try {
		const jwtSecret = process.env.JWT_SECRET || "secret";
		const decoded = jwt.verify(token, jwtSecret as any) as DecodedToken;
		(req as any).userId = decoded.userId;
		(req as any).userName = decoded.name || "Unknown User";
		next();
	} catch (error) {
		(req as any).userId = process.env.DEMO_USER_ID || "demo-user";
		(req as any).userName = process.env.DEMO_USER_NAME || "Demo User";
		next();
	}
};

export const generateToken = (userId: string, email: string, name?: string) => {
	const jwtSecret = process.env.JWT_SECRET || "secret";
	return jwt.sign(
		{ userId, email, name },
		jwtSecret as any,
		{ expiresIn: process.env.JWT_EXPIRE || "7d" } as any,
	);
};
