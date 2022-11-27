import { Text, TextInput, Button } from "@mantine/core";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axiosClient from "../../util/AxiosClient";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

export default function CreateEndpoint() {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [finalUrl, setFinalUrl] = useState("");
	const [cookies] = useCookies();
	const router = useRouter();

	function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		axiosClient
			.post(
				"/client/endpoints",
				{
					name,
				},
				{
					headers: {
						Authorization: "Bearer " + cookies.access,
					},
				}
			)
			.then(() => {
				router.push("/");
			})
			.catch((err) => {
				setError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	useEffect(() => {
		setFinalUrl(`http://localhost:1010/${name}`);
	}, [name]);

	return (
		<Layout page={0}>
			<div>
				<Text weight={"light"} size={"xl"}>
					Create a new Endpoint
				</Text>
				<form onSubmit={onSubmit}>
					<TextInput
						label={"Endpoint name"}
						description={
							<>
								This will also be the URL, like: <code>https://url.com/[endpoint name]</code>.
							</>
						}
						style={{ width: "400px" }}
						mt={10}
						placeholder={"cats"}
						autoComplete={"off"}
						onChange={(e) => {
							setName(e.target.value);
						}}
						defaultValue={name}
						error={error}
					></TextInput>
					{finalUrl && (
						<p style={{ fontSize: "12px" }}>
							Final URL will look like: <a style={{ color: "#468ed5" }}>{finalUrl}</a>
						</p>
					)}
					<Button mt={15} fullWidth type={"submit"} loading={loading}>
						Save
					</Button>
				</form>
			</div>
		</Layout>
	);
}
