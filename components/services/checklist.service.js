import axios from 'axios';

const key = process.env.API_KEY;
const token = process.env.API_TOKEN;

export const askApiToFetchChecklists = async (cardId) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${key}&token=${token}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching checklists:", err);
  }
};

export const askApiToAddChecklist = async (cardId, name) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${key}&token=${token}`,
      { name }
    );
    return response.data;
  } catch (err) {
    console.error("Error adding checklist:", err);
  }
};


export const askApiToDeleteChecklist = async (checklistId) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/checklists/${checklistId}?key=${key}&token=${token}`
    );
    return response.data;
  } catch (err) {
    console.error("Error deleting checklist:", err);
  }
};

export const askApiToAddCheckItem = async (checklistId, name) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${key}&token=${token}`,
      { name }
    );
    return response.data;
  } catch (err) {
    console.error("Error adding check item:", err);
  }
};

// (Note: Trello’s endpoint requires cardId and checkItemId.)
export const askApiToDeleteCheckItem = async (cardId, checkItemId) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?key=${key}&token=${token}`
    );
    return response.data;
  } catch (err) {
    console.error("Error deleting check item:", err);
  }
};

export const askApiToUpdateCheckItem = async (cardId, checkItemId, state) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?key=${key}&token=${token}`,
      { state }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating check item state:", err);
  }
};
