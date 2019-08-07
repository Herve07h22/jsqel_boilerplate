import { AUTH_LOGIN, AUTH_LOGOUT , AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';

export default url => (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request(url, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token, role }) => {
                localStorage.setItem('jsqel_token', token);
                localStorage.setItem('role', role);
            });
    }

    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('jsqel_token');
        return Promise.resolve();
    }

    if (type === AUTH_ERROR) {
        const status  = params.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('jsqel_token');
            return Promise.reject();
        }
        return Promise.resolve();
    }

    if (type === AUTH_CHECK) {
        return localStorage.getItem('jsqel_token') ? Promise.resolve() : Promise.reject();
    }
    
    if (type === AUTH_GET_PERMISSIONS) {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    }

    return Promise.resolve();
}