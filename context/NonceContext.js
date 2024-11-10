// context/NonceContext.js
import { createContext, useContext } from 'react';

export const NonceContext = createContext(null);

export function useNonce() {
    const nonce = useContext(NonceContext);
    console.log('Nonce retrieved from NonceContext:', nonce);  // ログを追加
    return nonce;
}