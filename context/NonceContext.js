// context/NonceContext.js
import { createContext, useContext } from 'react';

// NonceContextを作成
const NonceContext = createContext();

// NonceContextを提供するためのカスタムフック
export const useNonce = () => useContext(NonceContext);

export const NonceProvider = ({ nonce, children }) => {
    return (
        <NonceContext.Provider value={nonce}>
            {children}
        </NonceContext.Provider>
    );
};
