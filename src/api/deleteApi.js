import axios from "axios";
const deleteApi = async (params, end_url) => {
    const config = {
        data: params,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    return await axios.delete("http://13.209.194.64:8080" + end_url, config);
};

export default deleteApi;
