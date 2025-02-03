import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

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

export const updateLists = async (id, updatedList) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/lists/${id}?key=${key}&token=${token}`, updatedList);
        console.log("Lists:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const addLists = async (theListTitle, theBoardId) => {
    try {
        console.log("key:", key, "token:", token, "theListTitle:", theListTitle, "theBoardId:", theBoardId, "theListTitle:", typeof theListTitle, "theBoardId:", typeof theBoardId)
        const response = await axios.post(`https://api.trello.com/1/lists?name=${theListTitle}&idBoard=${theBoardId}&key=${key}&token=${token}`);
        console.log("Lists:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const deleteList = async (id) => {
    try {
        console.log("key:", key, "token:", token, "id:", id, "typ", typeof id)
        const response = await axios.put(`https://api.trello.com/1/lists/${id}/closed?key=${key}&token=${token}&value=true`);
        console.log("Lists:", response.data)
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}