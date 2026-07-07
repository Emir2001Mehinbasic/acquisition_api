import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing password: ${e.message}`);
    throw new Error('Error hashing password');
  }
};

export const createUser = async (name, email, password, role = 'user') => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User created: ${newUser.email}`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating user: ${e.message}`);
    console.error('STVARNA GREŠKA IZ BAZE:', e);
    throw new Error('Error creating user');
  }
};
