import React, { createContext, useContext, useReducer, useState } from 'react';

const MalaContext = createContext();

export const useMalas = () => {
  return useContext(MalaContext);
};

const initialState = {
  malas: [],
};

const malasReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MALA':
      return { malas: [...state.malas, action.payload] };
    default:
      return state;
  }
};

export const MalaProvider = ({ children, isDarkTheme, setIsDarkTheme }) => {
  const [state, dispatch] = useReducer(malasReducer, initialState);
  const [error, setError] = useState(null);

  const addMala = (mala) => {
    if (state.malas.includes(mala)) {
      setError("Album já existente");
      return
    }
    setError(null)
    dispatch({ type: 'ADD_MALA', payload: mala });
  };

  return (
    <MalaContext.Provider value={{ malas: state.malas, addMala, error, setError, isDarkTheme, setIsDarkTheme }}>
      {children}
    </MalaContext.Provider>
  );
};
