import "../styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import AuthProvider from "../providers/AuthProvider";
import LoginWrapper from "../components/LoginWrapper";

function MyApp({ Component, pageProps }) {
	return (
		<MantineProvider
			withNormalizeCSS
			withGlobalStyles
			withCSSVariables
			theme={{ colorScheme: "dark", primaryColor: "green" }}
		>
			<AuthProvider>
				<LoginWrapper>
					<Component {...pageProps} />
				</LoginWrapper>
			</AuthProvider>
		</MantineProvider>
	);
}

export default MyApp;
