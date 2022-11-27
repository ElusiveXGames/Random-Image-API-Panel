import { Alert, Button, ScrollArea, Select, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../util/AxiosClient";
import * as yup from "yup";
import { useCookies } from "react-cookie";

const schema = yup.object().shape({
	endpointId: yup.number().required("A valid endpoint is required.").min(0, "A valid endpoint is required."),
	imageUrl: yup.string().required("An image URL is required.").min(1, "An image URL is required."),
	source: yup.string(),
	artistName: yup.string(),
	artistLink: yup.string(),
});

function AddImage() {
	const [endpoints, setEndpoints] = useState([]);
	const [previewImageUrl, setPreviewImageUrl] = useState("");
	const [listGetError, setListGetError] = useState(null);
	const [listGetLoading, setListGetLoading] = useState(false);
	const [adding, setAdding] = useState(false);
	const [addingError, setAddingError] = useState(null);
	const [cookies] = useCookies();

	const router = useRouter();
	let { endpoint: endpointId } = router.query;

	const form = useForm({
		initialValues: {
			endpointId: -1,
			imageUrl: "",
			source: "",
			artistName: "",
			artistLink: "",
		},
		validate: yupResolver(schema),
	});

	useEffect(() => {
		setListGetError(null);
		setListGetLoading(true);
		axiosClient
			.get(`/client/endpoints`, {
				headers: {
					Authorization: "Bearer " + cookies.access,
				},
			})
			.then((res) => {
				setEndpoints(res.data.endpoints);
				if (endpointId > -1) {
					form.setValues({ endpointId });
				}
			})
			.catch((err) => {
				setListGetError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setListGetLoading(false);
			});
	}, [router.isReady]);

	useEffect(() => {
		try {
			const preview = new URL(form.values.imageUrl);
			setPreviewImageUrl(preview.href);
			console.log("setting preview url");
		} catch {}
	}, [form.values.imageUrl]);

	function onSubmit(values) {
		setAdding(true);
		setAddingError(null);
		axiosClient
			.post(
				`/client/images`,
				{
					endpointId: values.endpointId,
					imageUrl: values.imageUrl,
					source: values.source,
					artistName: values.artistName,
					artistLink: values.artistLink,
				},
				{
					headers: {
						Authorization: `Bearer ${cookies.access}`,
					},
				}
			)
			.then(() => {
				router.push(`/endpoints/${values.endpointId}`);
			})
			.catch((err) => {
				setAddingError(err.response?.data?.message || err.message);
			})
			.finally(() => {
				setAdding(false);
			});
	}

	return (
		<Layout page={0}>
			<div>
				{listGetError ? (
					<Alert color={"red"} my={10}>
						{listGetError}
					</Alert>
				) : (
					<>
						<Text weight={"light"} size={"xl"}>
							Add an image
						</Text>
						<form onSubmit={form.onSubmit(onSubmit)}>
							{endpoints && (
								<Select
									data={endpoints.map((e) => ({ label: `/${e.name}`, value: e.id.toString() }))}
									searchable
									label={"Endpoint to add to"}
									mt={10}
									disabled={listGetLoading}
									{...form.getInputProps("endpointId")}
								/>
							)}
							<TextInput
								label={"Image URL"}
								description={"The URL to the image. Must be a valid, image-only URL."}
								style={{ width: "400px" }}
								mt={10}
								placeholder={"https://my-host.com/image.png"}
								autoComplete={"off"}
								{...form.getInputProps("imageUrl")}
							></TextInput>
							{previewImageUrl && (
								<>
									<Text weight={"bold"} color={"lightgray"} size={"sm"} mt={10}>
										Preview:
									</Text>
									<ScrollArea style={{ height: "300px" }}>
										<img
											src={previewImageUrl}
											alt={"Invalid image."}
											style={{ width: "400px", marginTop: "5px", borderRadius: "5px" }}
										></img>
									</ScrollArea>{" "}
								</>
							)}
							<TextInput
								label={"Source"}
								style={{ width: "400px" }}
								mt={10}
								autoComplete={"off"}
								{...form.getInputProps("source")}
							></TextInput>
							<TextInput
								label={"Artist Name"}
								style={{ width: "400px" }}
								mt={10}
								autoComplete={"off"}
								{...form.getInputProps("artistName")}
							></TextInput>
							<TextInput
								label={"Artist Link"}
								style={{ width: "400px" }}
								mt={10}
								autoComplete={"off"}
								{...form.getInputProps("artistLink")}
							></TextInput>
							{addingError && (
								<Alert color={"red"} my={10}>
									{addingError}
								</Alert>
							)}
							<Button mt={15} fullWidth type={"submit"} loading={adding}>
								Add
							</Button>
						</form>
					</>
				)}
			</div>
		</Layout>
	);
}

export default AddImage;
