import { Alert, Button, Group, PasswordInput, TextInput, Title } from "@mantine/core";
import Center from "../components/Center";
import { Login as LoginIcon } from "tabler-icons-react";
import { useState } from "react";
import useUser from "../hooks/useUser";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loggingIn, setLoggingIn] = useState(false);
	const { handlers } = useUser();

	function onSubmit(ev) {
		ev.preventDefault();
		setError(null);
		setLoggingIn(true);
		handlers
			.login(username, password)
			.then(() => {
				setLoggingIn(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoggingIn(false);
			});
	}

	return (
		<Center>
			<form onSubmit={onSubmit}>
				<Title align={"center"} mb={10}>
					Welcome to the
					<br />
					RandomImageAPI web panel.
				</Title>
				{error && (
					<Alert my={10} color={"red"}>
						{error}
					</Alert>
				)}
				<TextInput label={"Username"} size={"md"} onChange={(e) => setUsername(e.target.value)} />
				<PasswordInput label={"Password"} size={"md"} my={10} onChange={(e) => setPassword(e.target.value)} />
				<Group position={"right"}>
					<Button leftIcon={<LoginIcon />} type={"submit"} loading={loggingIn}>
						Login
					</Button>
				</Group>
			</form>
		</Center>
	);
}

export default Login;
