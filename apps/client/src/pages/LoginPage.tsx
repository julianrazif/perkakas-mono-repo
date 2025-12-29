import {useNavigate} from "react-router-dom";
import {clearToken, saveToken} from "../services/Token.ts";
import {login} from "../services/Auth.ts";
import {useEffect, useState} from "react";

function LoginPage() {
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);
            await clearToken();
            const {token: loginToken} = await login('admin');
            await saveToken(loginToken);
            navigate("/dashboard", {replace: true});
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        }
    }

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
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
