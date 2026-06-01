import { Platform } from "react-native";

const API_URL =
	Platform.OS === "android" ? "http://10.0.2.2:5001/api" : "http://localhost:5001/api";

async function request(path: string, options: RequestInit = {}) {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
	});

	const data = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(data?.error || "Unable to connect to the API");
	}

	return data;
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
