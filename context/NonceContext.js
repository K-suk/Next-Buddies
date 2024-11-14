// context/NonceContext.js
import { createContext, useContext } from 'react';

export const NonceContext = createContext(null);

export function useNonce() {
    const nonce = useContext(NonceContext);
    return nonce;
}