import { Text, TextInput, Button, PasswordInput } from "@mantine/core";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axiosClient from "../../util/AxiosClient";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

export default function AddUser() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [cookies] = useCookies();
	const router = useRouter();

	function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		axiosClient
			.post(
				"/client/users",
				{
					username,
					password,
				},
				{
					headers: {
						Authorization: "Bearer " + cookies.access,
					},
				}
			)
			.then(() => {
				router.push("/users");
			})
			.catch((err) => {
				setError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<Layout page={0}>
			<div>
				<Text weight={"light"} size={"xl"}>
					Add a user
				</Text>
				<form onSubmit={onSubmit}>
					<TextInput
						label={"Username"}
						style={{ width: "400px" }}
						mt={10}
						placeholder={"username123"}
						autoComplete={"off"}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						defaultValue={name}
						error={error}
					></TextInput>
					<PasswordInput
						label={"Password"}
						style={{ width: "400px" }}
						mt={10}
						placeholder={"**********"}
						autoComplete={"off"}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						defaultValue={name}
						error={error}
					></PasswordInput>
					<Button mt={15} fullWidth type={"submit"} loading={loading}>
						Save
					</Button>
				</form>
			</div>
		</Layout>
	);
}
