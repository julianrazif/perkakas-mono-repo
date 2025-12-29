import {type JSX, useEffect, useState} from "react";
import {getToken} from "../services/Token.ts";
import {Navigate} from "react-router-dom";

function ProtectedRoute({children}: { children: JSX.Element }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                const token = await getToken();
                if (!active) return;

                setAuthenticated(!!token);
            } catch (err) {
                if (!active) return;

                setAuthenticated(false);
                const message = err instanceof Error ? err.message : String(err);
                alert(message);
            }
        }

        run().catch(console.error);

        return () => {
            active = false;
        };
    }, []);

    if (authenticated === null) return null;

    if (!authenticated) return <Navigate to="/login" replace/>;

    return children;
}

export default ProtectedRoute;
