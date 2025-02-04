import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    boardsArray: []
}

const boardSlice = createSlice({
    name: "boardName",
    initialState,
    reducers: {
        readBoards: (state, action) => {
            state.boardsArray = action.payload;
        },
        createBoard: (state, action) => {
            state.boardsArray.push(action.payload);
        },
        deleteBoard: (state, action) => {
            state.boardsArray = state.boardsArray.filter(board => board.id !== action.payload);
        },
    }
})

export const { readBoards, createBoard, deleteBoard } = boardSlice.actions;

export default boardSlice.reducer;