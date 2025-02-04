import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cardsArray: []
}

const cardSlice = createSlice({
    name: 'cardName',
    initialState,
    reducers: {
        createCard(state, action) {
            state.cardsArray.push(action.payload)
        },
        readCards(state, action) {
            state.cardsArray = action.payload
        },
        updateCard(state, action) {
            const index = state.cardsArray.findIndex(list => list.id === action.payload.id)
            if (index >= 0) {
                state.cardsArray[index] = action.payload
            }
        },
        deleteCard(state, action) {
            state.cardsArray = state.cardsArray.filter(card => card.id !== action.payload)
        }
    }
})

export const { createCard, readCards, updateCard, deleteCard } = cardSlice.actions;
export default cardSlice.reducer