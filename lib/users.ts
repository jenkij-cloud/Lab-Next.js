import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { changePasswordSchema } from './schemas';
import { ZodError } from 'zod';
import { ValidationError, NotFoundError, UnauthorizedError } from './errors';

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export async function createUser(email: string, plainPassword: string) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return prisma.user.create({ data: { email, password: hashedPassword } });
}

export async function changePassword(sessionUserId: string | null | undefined, raw: unknown) {
    // 1. Authorization: ตรวจว่าล็อกอินหรือยัง (อ่านจาก session)
    if (!sessionUserId) {
        throw new UnauthorizedError('กรุณาเข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน');
    }

    // 2. Validation: ตรวจสอบข้อมูลด้วย Zod (newPassword >= 8 ตัวอักษร)
    let data;
    try {
        data = changePasswordSchema.parse(raw);
    } catch (err) {
        if (err instanceof ZodError) {
            throw new ValidationError(err.issues[0].message);
        }
        throw err;
    }

    // 3. ป้องกัน SQL Injection ด้วย Prisma ORM
    const user = await findUserById(sessionUserId);
    if (!user) {
        throw new NotFoundError('ไม่พบข้อมูลผู้ใช้งาน');
    }

    // 4. Password Verification: ตรวจสอบ oldPassword ด้วย bcrypt.compare
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
        throw new ValidationError('รหัสผ่านเดิมไม่ถูกต้อง');
    }

    // 5. Password Hashing: Hash newPassword ด้วย bcrypt ก่อนบันทึก
    const newHashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
        where: { id: sessionUserId },
        data: { password: newHashedPassword },
    });

    return { ok: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
}
