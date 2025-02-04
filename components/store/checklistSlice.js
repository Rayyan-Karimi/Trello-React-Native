import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    checklistsArray: []
}

const checklistSlice = createSlice({
    name: 'koiFaltuNaam',
    initialState,
    reducers: {
        createChecklist(state, action) {
            state.cardsArray.push(action.payload)
        },
        readChecklists(state, action) {
            state.cardsArray = action.payload
            console.log(state.cardsArray)
        },
        updateChecklist(state, action) {
            const index = state.cardsArray.findIndex(list => list.id === action.payload.id)
            if (index >= 0) {
                state.cardsArray[index] = action.payload
            }
        },
        deleteChecklist(state, action) {
            state.cardsArray = state.cardsArray.filter(card => card.id !== action.payload)
        }
    }
})

export const { createChecklist, readChecklists, updateChecklist, deleteChecklist } = checklistSlice.actions;
export default checklistSlice.reducer
