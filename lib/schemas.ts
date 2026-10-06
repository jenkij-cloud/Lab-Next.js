import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(2, 'ชื่อสั้นเกินไป').max(100),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  message: z.string().min(5, 'ข้อความสั้นเกินไป').max(1000),
});

export type MessageInput = z.infer<typeof messageSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'กรุณาระบุรหัสผ่านเดิม'),
  newPassword: z.string().min(8, 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createCommentSchema = z.object({
  postId: z.string().min(1, 'กรุณาระบุ postId'),
  author: z.string().min(1, 'กรุณาระบุชื่อผู้เขียน').max(100),
  text: z.string().min(1, 'ข้อความคอมเมนต์ห้ามเป็นค่าว่าง').max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  text: z.string().min(1, 'ข้อความคอมเมนต์ห้ามเป็นค่าว่าง').max(2000),
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
