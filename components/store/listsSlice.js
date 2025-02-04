import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    listsArray: []
}

const listSlice = createSlice({
    name: 'listsName',
    initialState,
    reducers: {
        readLists: (state, action) => {
            state.listsArray = action.payload
        },
        createList: (state, action) => {
            state.listsArray.push(action.payload)
        },
        updateList: (state, action) => {
            const index = state.listsArray.findIndex(list => list.id === action.payload.id)
            if (index >= 0) {
                state.listsArray[index] = action.payload
            }
        },
        deleteList: (state, action) => {
            state.listsArray = state.listsArray.filter(list => list.id !== action.payload)
        }
    }
})

export const { readLists, createList, updateList, deleteList } = listSlice.actions;
export default listSlice.reducer;