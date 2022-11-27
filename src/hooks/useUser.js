import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function useUser() {
	return useContext(AuthContext);
}
