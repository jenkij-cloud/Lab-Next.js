export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

// ใช้ globalThis เพื่อให้ข้อมูลคงอยู่ข้าม module instances ใน dev mode
const globalForMessages = globalThis as unknown as {
    messages: ContactMessage[];
};

if (!globalForMessages.messages) {
    globalForMessages.messages = [];
}

const messages = globalForMessages.messages;

export function addMessage(data: Omit<ContactMessage, 'id' | 'createdAt'>) {
    const item: ContactMessage = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
    };
    messages.push(item);
    return item;
}

export function getMessages() {
    return messages;
}

export function updateMessage(id: string, updates: Partial<ContactMessage>) {
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return null;
    messages[index] = { ...messages[index], ...updates };
    return messages[index];
}

export function deleteMessage(id: string) {
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return false;
    messages.splice(index, 1);
    return true;
}