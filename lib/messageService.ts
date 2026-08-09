import * as MessageModel from './messages';
export function createMessage(data: { name: string; email: string; message: string }) {
    if (!data.name || !data.email || !data.message) {
        throw new Error('ข้อมูลไม่ครบ');
    }
    return MessageModel.addMessage(data);
}
export function listMessages() {
    return MessageModel.getMessages();
}
export function getMessageById(id: string) {
    return MessageModel.getMessages().find((m) => m.id === id) ?? null;
}

export function editMessage(id: string, updates: Partial<{ message: string }>) {
    if (updates.message !== undefined && updates.message.trim() === '') {
        throw new Error('ข้อความห้ามเป็นค่าว่าง');
    }
    return MessageModel.updateMessage(id, updates);
}

export function removeMessage(id: string) {
    return MessageModel.deleteMessage(id);
}