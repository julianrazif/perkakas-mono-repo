export async function login(username: string) {
    const res = await fetch(`http://localhost:8080/auth/login?username=${username}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Failed to login');
    }
    return res.json();
}
