import {NotificationManager} from "react-notifications";

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}

// return the token from the session storage
export const getToken = () => {
    return localStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace(`/login`)

}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
}

export const createNotification = (type, msg) => {
    switch (type) {
        case 'info':
            NotificationManager.info('Info message', msg);
            break;
        case 'success':
            NotificationManager.success('Success message', msg);
            break;
        case 'warning':
            NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
            break;
        case 'error':
            NotificationManager.error(msg, 'Error!', 5000, () => {
            });
            break;

    }
    ;
};