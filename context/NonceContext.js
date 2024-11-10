// context/NonceContext.js
import { createContext, useContext } from 'react';

export const NonceContext = createContext(null);

export function useNonce() {
    return useContext(NonceContext);
}