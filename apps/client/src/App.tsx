import {type MouseEvent, useEffect, useState} from 'react'
import {open} from '@tauri-apps/plugin-shell'
import springLogo from './assets/Spring_Boot.png';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import tauriLogo from './assets/tauri-icon.webp';
import './App.css'
import {clearToken, getToken, login, saveToken} from './Auth.ts'
import { invoke } from "@tauri-apps/api/core";

const isTauri = typeof window !== 'undefined' && ('__TAURI__' in window || '__TAURI_INTERNALS__' in window)

function App() {
    const [count, setCount] = useState(0)
    const [token, setToken] = useState<string | null>(null);
    const [savedToken, setSavedToken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExternalLinkClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        if (!isTauri) return;

        event.preventDefault();

        try {
            await open(event.currentTarget.href);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    };

    const getAppInfo = async (): Promise<string> => {
        return await invoke("get_app_info");
    }

    const greet = async (name: string): Promise<string> => {
        return await invoke("greet", { name });
    }

    const handleClick = async () => {
        const info = await getAppInfo();
        const msg = await greet("Julian Razif Figaro");
        alert(`${info}\n${msg}`);
    }

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                setError(null);
                await clearToken();
                const {token: loginToken} = await login('test');
                await saveToken(loginToken);
                const value = await getToken();

                if (active) {
                    setToken(value);
                    setSavedToken(true);
                }
            } catch (err) {
                if (!active) return;

                const message = err instanceof Error ? err.message : String(err);
                setError(message);
            }
        };

        run().catch(console.error);

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <div>
                <a href="https://spring.io/projects/spring-boot" target="_blank" onClick={handleExternalLinkClick}>
                    <img src={springLogo} className="logo" alt="Spring logo"/>
                </a>
                <a href="https://vite.dev" target="_blank" onClick={handleExternalLinkClick}>
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank" onClick={handleExternalLinkClick}>
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
                <a href="https://v2.tauri.app/start/" target="_blank" onClick={handleExternalLinkClick}>
                    <img src={tauriLogo} className="logo" alt="Tauri logo"/>
                </a>
            </div>
            <h1>Spring-Boot + Vite + React + Tauri</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <button onClick={handleClick}>
                    Call Rust IPC
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
                <p>
                    Token status: {savedToken ? 'Saved' : 'Not saved'}
                </p>
                {savedToken && (
                    <p>
                        The token is: {token}
                    </p>
                )}
                {error && (
                    <p>
                        Error: {error}
                    </p>
                )}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
