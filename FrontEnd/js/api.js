import { API_HOST } from "./env.js";

class Api {
	async get(url) {
		const res = await fetch(`${API_HOST}${url}`, { method: "GET" });
		if (!res.ok) {
			throw new Error("Error");
		}
		return await res.json();
	}

	async post(url, body = {}, option = {}) {
		const res = await fetch(`${API_HOST}${url}`, {
			...option,
			method: "POST",
			headers: {
				...option.headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			throw new Error("Error res");
		}
		return await res.json();
	}
}

const api = new Api();

export default api;
