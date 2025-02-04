import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

export const askApiToFetchLists = async (id) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${id}/lists?key=${key}&token=${token}`);
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const askApiToUpdateAList = async (id, updatedList) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/lists/${id}?key=${key}&token=${token}`, updatedList);
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const askApiToAddNewList = async (theListTitle, theBoardId) => {
    try {
        const response = await axios.post(`https://api.trello.com/1/lists?name=${theListTitle}&idBoard=${theBoardId}&key=${key}&token=${token}`);
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const askApiToDeleteAnExistingList = async (id) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/lists/${id}/closed?key=${key}&token=${token}&value=true`);
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}