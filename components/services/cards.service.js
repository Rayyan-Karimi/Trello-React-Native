import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

export const fetchCards = async (id) => {
    try {
        console.log("key:", key, "token:", token)
        const response = await axios.get(`https://api.trello.com/1/boards/${id}/cards?key=${key}&token=${token}`);
        console.log("Lists:", response.data)
        return data = response.data;
    } catch (err) {
        console.error("err:", err);
    }
}