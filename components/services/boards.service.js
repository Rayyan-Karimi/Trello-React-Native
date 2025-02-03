import axios from 'axios'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

export const fetchBoards = async () => {
    try {
        const response = await axios.get(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`);
        return response.data;
    } catch (err) {
        console.error("err:", err);
    }
}

export const addBoard = async (theBoardName) => {
    try {
        const url = `https://api.trello.com/1/boards?name=${encodeURIComponent(theBoardName)}&key=${key}&token=${token}`;
        const response = await axios.post(url);
        console.log("res for add board:", response);
        return response.data;
    } catch (err) {
        console.error("err in board add:", err);
    }
}

export const deleteBoard = async (theTrelloId) => {
    try {
        console.log('agye', theTrelloId, typeof theTrelloId);
        const response = await axios.delete(`https://api.trello.com/1/boards/${theTrelloId}?key=${key}&token=${token}`)
        console.log("res for delete board:", response);
        return response.data;
    } catch (err) {
        console.error("err in board del:", err)
    }
}

