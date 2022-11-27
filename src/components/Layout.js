import { Container } from "@mantine/core";
import Nav from "./Nav";

export default function Layout({ children, page }) {
	return (
		<div style={{ display: "flex" }}>
			<Nav page={page} />
			<Container size={"md"} my={20}>
				<div style={{ width: "100%" }}>{children}</div>
			</Container>
		</div>
	);
}
