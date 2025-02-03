import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

export const fetchCards = async (id) => {
    try {
        console.log("Board Id:", id)
        const response = await axios.get(`https://api.trello.com/1/boards/${id}/cards?key=${key}&token=${token}`);
        // console.log("Cards:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const fetchLists = async (id) => {
    try {
        console.log("Board Id:", id)
        const response = await axios.get(`https://api.trello.com/1/boards/${id}/lists?key=${key}&token=${token}`);
        // console.log("Lists:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const fetchChecklists = async (id) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/cards/${id}/checklists?key=${key}&token=${token}`);
        // console.log("check lists:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}