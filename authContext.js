const AuthContext = {
    user: null,
    isLoggedIn: false,
    login: async (email, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            AuthContext.user = data.user;
            AuthContext.isLoggedIn = true;
            localStorage.setItem('token', data.token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },
    logout: () => {
        AuthContext.user = null;
        AuthContext.isLoggedIn = false;
        localStorage.removeItem('token');
    },
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        try {
            const response = await fetch('/api/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                AuthContext.user = data.user;
                AuthContext.isLoggedIn = true;
                return true;
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
        return false;
    }
};

export default AuthContext;
