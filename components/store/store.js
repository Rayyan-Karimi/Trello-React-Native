import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';
import listReducer from './listsSlice'
import cardReducer from './cardSlice'
import checklistReducer from './checklistSlice'

const store = configureStore({
    reducer: {
        boards: boardReducer,
        lists: listReducer,
        cards: cardReducer,
        checklists: checklistReducer,
    }
})

export default store;