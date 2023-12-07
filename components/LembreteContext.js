import React, { createContext, useContext, useReducer } from 'react';

const LembreteContext = createContext();

export const useLembretes = () => {
  return useContext(LembreteContext);
};

const initialState = {
  lembretes: {},
};

const lembreteReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LEMBRETE':
      const { mala, lembrete } = action.payload;
      return {
        lembretes: {
          ...state.lembretes,
          [mala]: [...(state.lembretes[mala] || []), lembrete],
        },
      };
    default:
      return state;
  }
};

export const LembreteProvider = ({ children, isDarkTheme, setIsDarkTheme }) => {
  const [state, dispatch] = useReducer(lembreteReducer, initialState);

  const addLembrete = (mala, lembrete) => {
    dispatch({ type: 'ADD_LEMBRETE', payload: { mala, lembrete } });
  };

  return (
    <LembreteContext.Provider value={{ lembretes: state.lembretes, addLembrete, isDarkTheme, setIsDarkTheme }}>
      {children}
    </LembreteContext.Provider>
  );
};
