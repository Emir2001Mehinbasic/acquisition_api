import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { eq, sql } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const getAllUsers = async () => {
  try{ 
    return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users);

  }
  catch(e){
    logger.error(`Error in getAllUsers service: ${e.message}`);
    throw e;
  }

};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  } catch (e) {
    logger.error(`Error in getUserById service: ${e.message}`);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updated_at: sql`now()`,
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return user ?? null;
  } catch (e) {
    logger.error(`Error in updateUser service: ${e.message}`);
    if (e.message === 'User not found') {
      throw e;
    }
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const [user] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return user ?? null;
  } catch (e) {
    logger.error(`Error in deleteUser service: ${e.message}`);
    if (e.message === 'User not found') {
      throw e;
    }
    throw e;
  }
};
