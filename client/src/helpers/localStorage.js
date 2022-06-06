export function setToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
};

export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
};

export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
};