import { generateId } from '../utils/idGenerators.js';

export class Commit {
    constructor(message, parentId = null) {
        this.id = generateId();
        this.message = message;
        this.parentId = parentId; // unused until v0.7, safe to add now
        this.timestamp = new Date().toLocaleString();
    }
}