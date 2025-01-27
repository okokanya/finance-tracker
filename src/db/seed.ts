import { v4 as uuidv4 } from 'uuid';

import { db } from './db';
import * as schema from './schema';

const main = async () => {
  try {
    console.log('Seeding database...');

    await db.delete(schema.todos);

    await db.insert(schema.todos).values([
      { id: uuidv4(), text: 'Buy groceries', isCompleted: true },
      { id: uuidv4(), text: 'Clean the house', isCompleted: true },
      { id: uuidv4(), text: 'Walk the dog', isCompleted: false },
      { id: uuidv4(), text: 'Read a book', isCompleted: true },
      { id: uuidv4(), text: 'Call mom', isCompleted: true },
      { id: uuidv4(), text: 'Exercise', isCompleted: true },
      { id: uuidv4(), text: 'Plan weekend trip', isCompleted: false },
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed database');
  }
};

main();
