import {Store} from '@tauri-apps/plugin-store';

const TOKEN_KEY = 'token';

const isTauri = () =>
    typeof window !== 'undefined' && ('__TAURI__' in window || '__TAURI_INTERNALS__' in window);

const hasLocalStorage = () =>
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let storePromise: Promise<Store> | null = null;

async function getStore() {
    if (!storePromise) {
        storePromise = Store.load('.auth.dat').catch((err) => {
            storePromise = null;
            throw err;
        });
    }

    return storePromise;
}

async function saveTokenToStore(token: string) {
    const store = await getStore();
    await store.set(TOKEN_KEY, token);
    await store.save();
}

async function getTokenFromStore(): Promise<string | null> {
    const store = await getStore();
    const value = await store.get<string>(TOKEN_KEY);
    return value ?? null;
}

async function clearTokenFromStore() {
    const store = await getStore();
    await store.delete(TOKEN_KEY);
    await store.save();
}

async function saveTokenToLocalStorage(token: string) {
    if (!hasLocalStorage()) {
        throw new Error('No available storage backend for token.');
    }

    window.localStorage.setItem(TOKEN_KEY, token);
}

async function getTokenFromLocalStorage(): Promise<string | null> {
    if (!hasLocalStorage()) {
        return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
}

async function clearTokenFromLocalStorage() {
    if (!hasLocalStorage()) {
        return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
}

export async function saveToken(token: string) {
    if (isTauri()) {
        return saveTokenToStore(token);
    }

    return saveTokenToLocalStorage(token);
}

export async function getToken(): Promise<string | null> {
    if (isTauri()) {
        return getTokenFromStore();
    }

    return getTokenFromLocalStorage();
}

export async function clearToken() {
    if (isTauri()) {
        return clearTokenFromStore();
    }

    return clearTokenFromLocalStorage();
}
