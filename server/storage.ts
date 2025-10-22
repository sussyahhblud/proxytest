// No storage needed for proxy browser
export interface IStorage {}

export class MemStorage implements IStorage {}

export const storage = new MemStorage();
