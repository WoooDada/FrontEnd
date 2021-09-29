import axios from "axios";
const putApi = async (data, end_url, token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return await axios.put("http://13.209.194.64:8080" + end_url, data, config);
};

export default putApi;
