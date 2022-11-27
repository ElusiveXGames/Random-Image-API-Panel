import axios from "axios";

const axiosClient = axios.create({
	baseURL: "https://api.elusivedev.com",
	// baseURL: "http://localhost:1010",
});

export default axiosClient;
