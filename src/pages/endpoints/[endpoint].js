import { Alert, Group, ScrollArea, Table, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import axiosClient from "../../util/AxiosClient";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { IconPlaylistAdd } from "@tabler/icons";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Trash } from "tabler-icons-react";

function ViewImages() {
	const [images, setImages] = useState([]);
	const [endpoint, setEndpoint] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	const [cookies] = useCookies();
	const { endpoint: endpointId } = router.query;

	useEffect(() => {
		if (!endpointId) return;
		setImages([]);
		setLoading(true);
		setError(null);
		axiosClient
			.get(`/client/images/${endpointId}`, {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then((res) => {
				setImages(res.data.images);
				setEndpoint(res.data.endpoint);
			})
			.catch((err) => {
				setError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [router.isReady]);

	return (
		<Layout page={0}>
			<h2>
				Images in endpoint{" "}
				<a href={`http://localhost:1010/${endpoint.name}`} target={"_blank"}>
					<code>/{endpoint.name}</code>
				</a>
				:
			</h2>
			<Group position={"right"} mb={10}>
				<Link href={`/addimage?endpoint=${endpoint.id || 0}`} passHref>
					<Button leftIcon={<IconPlaylistAdd />}>
						Add image to <code style={{ marginLeft: "5px", fontSize: "11px" }}>/{endpoint.name}</code>
					</Button>
				</Link>
			</Group>
			<ImagesDisplay images={images} loading={loading} error={error} setImages={setImages} />
		</Layout>
	);
}

export function ImagesDisplay({ images, loading, error, setImages }) {
	const [deleting, setDeleting] = useState(-1);
	const [cookies] = useCookies();
	function deleteImage(id) {
		setDeleting(id);
		axiosClient
			.delete(`/client/images/${id}`, {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then(() => {
				setDeleting(-1);
				setImages(images.filter((image) => image.id !== id));
			});
	}

	const tableBody = images.map((img) => {
		return (
			<tr key={img.id}>
				<td>
					<a>{img.id}</a>
				</td>
				<td>{img.filename}</td>
				<td>
					<a href={img.url} target={"_blank"}>
						{img.url}
					</a>
				</td>
				<td>{img.source || "Unknown"}</td>
				<td>{img.artistName || "Unknown"}</td>
				<td>
					{img.artistLink ? (
						<a href={img.url} target={"_blank"}>
							{img.artistLink}
						</a>
					) : (
						"Unknown"
					)}
				</td>
				<td>
					<Group>
						<Button
							color={"red"}
							onClick={() => deleteImage(img.id)}
							leftIcon={<Trash size={16} />}
							loading={deleting === img.id}
						>
							Delete
						</Button>
					</Group>
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
										<th>File name</th>
										<th>URL</th>
										<th>Source</th>
										<th>Artist's Name</th>
										<th>Artist's Link</th>
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
export default ViewImages;
