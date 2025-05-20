const LOGIN_FLAG_KEY = "isLoggedBefore";

export const setLoginFlag = () => {
    localStorage.setItem(LOGIN_FLAG_KEY, "true");
};

export const removeLoginFlag = () => {
    localStorage.removeItem(LOGIN_FLAG_KEY);
};

export const hasLoggedBefore = (): boolean => {
    return localStorage.getItem(LOGIN_FLAG_KEY) === "true";
};
