import { Alert, ScrollArea, Table, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import axiosClient from "../util/AxiosClient";
import Link from "next/link";
import Layout from "../components/Layout";
import { useCookies } from "react-cookie";
import { Plus } from "tabler-icons-react";

function Index() {
	return (
		<Layout page={0}>
			<Group position={"apart"} mb={10}>
				<h2>Endpoints:</h2>
				<Link href={`/endpoints/new`} passHref>
					<Button leftIcon={<Plus />}>Create new endpoint</Button>
				</Link>
			</Group>
			<EndpointsDisplay />
		</Layout>
	);
}

export function EndpointsDisplay() {
	const [endpoints, setEndpoints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(-1);
	const [cookies] = useCookies();

	useEffect(() => {
		setEndpoints([]);
		setLoading(true);
		setError(null);
		axiosClient
			.get("/client/endpoints", {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then((res) => {
				setEndpoints(res.data.endpoints);
			})
			.catch((err) => {
				setError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	function deleteEndpoint(id) {
		setDeleting(id);
		axiosClient
			.delete(`/client/endpoints/${id}`, {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then(() => {
				setEndpoints(endpoints.filter((e) => e.id !== id));
			})
			.finally(() => {
				setDeleting(-1);
			});
	}

	const tableBody = endpoints.map((endpoint) => {
		return (
			<tr key={endpoint.id}>
				<td>
					<a>{endpoint.id}</a>
				</td>
				<td>
					<code>
						<a>/{endpoint.name}</a>
					</code>
				</td>
				<td>{endpoint.images?.length || 0}</td>
				<td>
					<Link href={`/endpoints/${endpoint.id}`}>
						<Button color={"blue"}>Edit</Button>
					</Link>

					<Button
						color={"red"}
						ml={5}
						onClick={() => deleteEndpoint(endpoint.id)}
						loading={deleting === endpoint.id}
					>
						Delete
					</Button>
				</td>
			</tr>
		);
	});

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					{error ? (
						<Alert color={"red"} my={20}>
							{error}
						</Alert>
					) : (
						<ScrollArea>
							<Table sx={{ minWidth: 800 }} verticalSpacing="xs">
								<thead>
									<tr>
										<th>ID</th>
										<th>Endpoints</th>
										<th># of images</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>{tableBody}</tbody>
							</Table>
						</ScrollArea>
					)}
				</>
			)}
		</>
	);
}

export default Index;
