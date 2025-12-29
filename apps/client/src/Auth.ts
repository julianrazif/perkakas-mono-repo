import {Store} from '@tauri-apps/plugin-store';

const isTauri = () =>
    typeof window !== 'undefined' && ('__TAURI__' in window || '__TAURI_INTERNALS__' in window);

let storePromise: Promise<Store> | null = null;

async function getStore() {
    if (!isTauri()) {
        throw new Error('Tauri store is unavailable outside of Tauri runtime.');
    }

    if (!storePromise) {
        storePromise = Store.load('.auth.dat').catch((err) => {
            storePromise = null;
            throw err;
        });
    }

    return storePromise;
}

export async function saveToken(token: string) {
    const store = await getStore();
    await store.set('token', token);
    await store.save();
}

export async function getToken(): Promise<string | null> {
    const store = await getStore();
    const value = await store.get<string>('token');
    return value ?? null;
}

export async function clearToken() {
    const store = await getStore();
    await store.delete('token');
    await store.save();
}

export async function login(username: string) {
    const res = await fetch(`http://localhost:8080/auth/login?username=${username}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Failed to login');
    }
    return res.json();
}
