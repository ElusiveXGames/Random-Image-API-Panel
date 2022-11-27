import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axiosClient from "../util/AxiosClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [cookies, setCookies, removeCookies] = useCookies();
	const router = useRouter();

	useEffect(fetchUser, [cookies.access]);

	function fetchUser() {
		(async () => {
			if (!cookies.refresh) {
				setLoading(false);
				return;
			}

			await axiosClient
				.get(`/client/me`, {
					headers: {
						Authorization: `Bearer ${cookies.access}`,
					},
				})
				.then((response) => {
					setUser(response.data.user);
					setLoading(false);
				})
				.catch(async () => {
					refresh();
				});
		})();
	}

	async function refresh() {
		await axiosClient
			.post(`/client/token`, { refreshToken: cookies.refresh })
			.then((response) => {
				setCookies("access", response.data.accessToken, {
					httpOnly: false,
				});
			})
			.catch(() => {
				removeCookies("access");
				removeCookies("refresh");
			})
			.finally(() => {
				setLoading(false);
			});
	}

	const login = async (username, password) => {
		return new Promise(async (res, rej) => {
			await axiosClient
				.post(`/client/login`, {
					username,
					password,
				})
				.then((response) => {
					setCookies("access", response.data.accessToken, {
						httpOnly: false,
					});
					setCookies("refresh", response.data.refreshToken, {
						httpOnly: false,
					});
					setLoading(false);
					res();
				})
				.catch(async (err) => {
					rej(new Error(err.response?.data?.message || err.message));
				});
		});
	};

	function logout() {
		removeCookies("access");
		removeCookies("refresh");
		setUser(null);
	}

	const handlers = {
		login,
		logout,
	};

	if (loading) {
		return null;
	}

	return <AuthContext.Provider value={{ user, loading, handlers }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
