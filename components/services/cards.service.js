import axios from 'axios';

const key = process.env.API_KEY;
const token = process.env.API_TOKEN;

export const fetchCards = async (boardId) => {
  try {
    const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching cards:', err);
  }
};

export const addCards = async (theCard, theListId) => {
  try {
    const response = await axios.post(`https://api.trello.com/1/cards?idList=${theListId}&key=${key}&token=${token}`, theCard);
    return response.data;
  } catch (err) {
    console.error('Error adding card:', err);
  }
};

export const updateCard = async (cardId, updatedCard) => {
  try {
    const response = await axios.put(`https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`, updatedCard);
    return response.data;
  } catch (err) {
    console.error('Error updating card:', err);
  }
};

export const deleteCard = async (cardId) => {
  try {
    const response = await axios.delete(`https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting card:', err);
  }
};
