import {useNavigate} from "react-router-dom";
import {clearToken, getToken} from "../services/Token.ts";
import {useEffect, useState} from "react";

function DashBoardPage() {
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [savedToken, setSavedToken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logout = async () => {
        try {
            setError(null);
            await clearToken();
            setToken(null);
            setSavedToken(false);
            navigate("/login", { replace: true });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    }

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                setError(null);
                const value = await getToken();

                if (active) {
                    setToken(value);
                    setSavedToken(!!value);
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

    useEffect(() => {
        let active = true;

        if (active && error) {
            alert(error);
        }

        return () => {
            active = false;
        }
    }, [error]);

    return (
        <>
            <h2>Dashboard</h2>
            <button onClick={logout}>Logout</button>

            <p>
                Token status: {savedToken ? 'Saved' : 'Not saved'}
            </p>
            {savedToken && (
                <p>
                    The token is: {token}
                </p>
            )}
        </>
    );
}

export default DashBoardPage;
