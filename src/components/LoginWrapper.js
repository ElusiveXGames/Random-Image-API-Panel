import Login from "./Login";
import useUser from "../hooks/useUser";

export default function LoginWrapper({ children }) {
	const { loading, user } = useUser();

	if (!loading && !user) {
		return <Login />;
	}

	return children;
}
