export function generateId() {
    return "commit-" + Math.random().toString(36).substr(2, 5);
}