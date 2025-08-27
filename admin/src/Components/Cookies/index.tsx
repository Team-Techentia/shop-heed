import { parseCookies } from "nookies";

export const getCookie = () => {
    // Check if running on server or client
    const cookies = parseCookies();
    const { token } = cookies || {};
    // console.log(token)
    // console.log("huhjukhmykt")

    return {
        headers: {
            Authorization: `Bearer ${token || ""}`
        }
    };
};