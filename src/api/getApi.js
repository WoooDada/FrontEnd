import axios from "axios";
const getApi = async (params, end_url) => {
    const config = {
        params: params,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    return await axios.get("http://13.209.194.64:8080" + end_url, config);
};

export default getApi;
