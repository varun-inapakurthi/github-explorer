import { createSlice } from '@reduxjs/toolkit';



const loadHistoryFromStorage = () => {
  const saved = localStorage.getItem('searchHistory');
  return saved ? JSON.parse(saved) : [];
};

const initialState = {
  history: loadHistoryFromStorage(),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      const newItem = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.history = [newItem, ...(state.history || [])];
      localStorage.setItem('searchHistory', JSON.stringify(state.history));
    },
    clearHistoryItem: (state, action) => {
      state.history = state.history.filter(item => item.id !== action.payload);
      localStorage.setItem('searchHistory', JSON.stringify(state.history));
    },
    clearAllHistory: (state) => {
      state.history = [];
      localStorage.setItem('searchHistory', JSON.stringify([]));
    }
  },
});

export const { addToHistory, clearHistoryItem, clearAllHistory } = searchSlice.actions;
export default searchSlice.reducer;