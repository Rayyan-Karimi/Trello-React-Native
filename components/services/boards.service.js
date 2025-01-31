import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

export const fetchBoards = async () => {
    try {
        const response = await axios.get(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`);
        return data = response.data;
    } catch (err) {
        console.error("err:", err);
    }
}
