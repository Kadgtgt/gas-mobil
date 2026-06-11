import { Platform } from "react-native";
import Constants from "expo-constants";

const LOCAL_HOST_IP = "192.168.100.92";
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
	authToken = token;
}

const resolveApiUrls = (): string[] => {
	const manifest = (Constants as any).manifest;
	const expoConfig = (Constants as any).expoConfig;

	const urls: string[] = [];
	const hostFromExtra = expoConfig?.extra?.API_URL || manifest?.extra?.API_URL;
	if (hostFromExtra) {
		urls.push(hostFromExtra.replace(/\/$/, ""));
	}

	const debuggerHost = manifest?.debuggerHost || expoConfig?.extra?.debuggerHost;
	if (debuggerHost) {
		const host = debuggerHost.split(":")[0];
		if (host) {
			urls.push(`http://${host}:5000/api`);
		}
	}

	urls.push(`http://${LOCAL_HOST_IP}:5000/api`);
	urls.push("http://10.0.2.2:5000/api");
	urls.push("http://127.0.0.1:5000/api");

	return urls.filter(Boolean);
};

const API_URLS = resolveApiUrls();

async function tryFetch(url: string, path: string, options: RequestInit, timeoutMs: number) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const res = await fetch(`${url}${path}`, {
			...options,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				...(options.headers || {}),
				...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
			},
		});

		const data = await res.json().catch(() => null);
		if (!res.ok) {
			throw new Error(data?.error || `Unable to connect to the API (${res.status})`);
		}

		return data;
	} finally {
		clearTimeout(timeoutId);
	}
}

async function request(path: string, options: RequestInit = {}) {
	let lastError: any;

	for (const baseUrl of API_URLS) {
		try {
			return await tryFetch(baseUrl, path, options, 10000);
		} catch (error: any) {
			lastError = error;
			const message = error?.message?.toString() || "";
			if (
				message.includes("AbortError") ||
				message.includes("timed out") ||
				message.includes("Failed to fetch") ||
				message.includes("Network request failed")
			) {
				continue;
			}
			throw error;
		}
	}

	throw new Error(
		lastError?.message || `Unable to connect to the order API. Tried: ${API_URLS.join(", ")}`,
	);
}

export async function createOrder(payload: any) {
	return request("/orders", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function getDelivery(orderId: string) {
	return request(`/delivery/${orderId}`);
}

export async function registerUser(payload: any) {
	return request("/auth/register", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function loginUser(payload: any) {
	return request("/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function verifyUser() {
	return request("/auth/verify");
}
