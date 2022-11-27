import { Alert, ScrollArea, Table, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import axiosClient from "../../util/AxiosClient";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useCookies } from "react-cookie";
import { Plus } from "tabler-icons-react";

function Users() {
	return (
		<Layout page={0}>
			<Group position={"apart"} mb={10}>
				<h2>Users:</h2>
				<Link href={`/users/new`} passHref>
					<Button leftIcon={<Plus />}>Add a user</Button>
				</Link>
			</Group>
			<UsersDisplay />
		</Layout>
	);
}

export function UsersDisplay() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(-1);
	const [cookies] = useCookies();

	useEffect(() => {
		setUsers([]);
		setLoading(true);
		setError(null);
		axiosClient
			.get("/client/users", {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then((res) => {
				setUsers(res.data.users);
			})
			.catch((err) => {
				setError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	function deleteUser(id) {
		setDeleting(id);
		axiosClient
			.delete(`/client/users/${id}`, {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then(() => {
				setUsers(users.filter((e) => e.id !== id));
			})
			.finally(() => {
				setDeleting(-1);
			});
	}

	const tableBody = users.map((user) => {
		return (
			<tr key={user.id}>
				<td>
					<a>{user.id}</a>
				</td>
				<td>
					<a>{user.username}</a>
				</td>
				<td>
					<Button color={"red"} ml={5} onClick={() => deleteUser(user.id)} loading={deleting === user.id}>
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
										<th>Username</th>
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

export default Users;
