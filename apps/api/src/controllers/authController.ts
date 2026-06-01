import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { generateToken } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, phone, password, address, city, state, zipCode } = req.body;

		// Check if user exists
		const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
		if (existingUser) {
			return res.status(400).json({ success: false, error: "User already exists" });
		}

		// Create new user
		const user = new User({
			name,
			email,
			phone,
			password,
			address,
			city,
			state,
			zipCode,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id.toString(), user.email, user.name);

		res.status(201).json({
			success: true,
			data: {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, phone, password } = req.body;

		if (!password || (!email && !phone)) {
			return res
				.status(400)
				.json({ success: false, error: "Email or phone and password are required" });
		}

		const query = email ? { email } : { phone };
		const user = await User.findOne(query).select("+password");
		if (!user) {
			return res.status(401).json({ success: false, error: "Invalid credentials" });
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ success: false, error: "Invalid credentials" });
		}

		const token = generateToken(user._id.toString(), user.email, user.name);

		res.json({
			success: true,
			data: {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const verify = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ success: false, error: "User not found" });
		}

		res.json({
			success: true,
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};
