import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { client } from '../utils/db.js';



const filePath = path.resolve('data', 'data.json');

async function read() {
  const data = await fs.readFile(filePath, 'utf-8');

  return JSON.parse(data);
}

async function write(todos) {
  const data = await JSON.stringify(todos, null, 2);

  fs.writeFile(filePath, data);
}


// let todos = [
//   { id: '1', title: 'todo 1', completed: true },
//   { id: '2', title: 'todo 2', completed: false },
//   { id: '3', title: 'todo 3', completed: false },
// ];

export async function getAll() {
  const result = await client.query(`
    SELECT *
    FROM todos
    ORDER BY created_at
  `);
  return result.rows;
}
// export function getAll() {
//   return read();
// }

export async function getById(todoId) {
  const result = await client.query(`
    SELECT *
    FROM todos
    WHERE id = $1
`, [todoId]);

  return result.rows[0] || null;
}
// export async function getById(todoId) {
//   const todos = await read();
//   const requestTodo = todos.find((todo) => todo.id === todoId);

//   return requestTodo || null;
// }

export async function create(title) {
  const id = uuidv4();
  
  await client.query(`
    INSERT INTO todos (id, title)
    VALUES ($1, $2)
`, [id, title]);

  const newTodo = await getById(id);
  return newTodo;
}
// export async function create(title) {
//   const todos = await read();
//   const newTodo = {
//     id: uuidv4(),
//     title,
//     completed: false,
//   };

//   todos.push(newTodo);
  
//   await write(todos);

//   return newTodo;
// }

export async function remove(todoId) {
  await client.query(`
    DELETE FROM todos
    WHERE id=$1
`, [todoId]);
}
// export async function remove(todoId) {
//   const todos = await read();

//   await write(
//     todos.filter(todo => todo.id !== todoId)
//   );
// }

export async function update({ id, title, completed }) {
  await client.query(
    `
    UPDATE todos
    SET title=$2, completed=$3
    WHERE id=$1
`,
    [id, title, completed]
  );
}
// export async function update({ id, title, completed }) {
//   const todos = await read();
//   const requestTodo = todos.find((todo) => todo.id === id);

//   Object.assign(requestTodo, { title, completed });

//   await write(todos);

//   return requestTodo;
// }

// export async function removeAll(ids) {
//   if (!ids.every(getById)) {
//     throw new Error();
//   }

//   todos = todos.filter((todo) => !ids.includes(todo.id));
// }


// export async function updateAll(todos) {
//   for (const { id, title, completed } of todos) {
//     const requestedTodo = getById(id);
//     console.log(requestedTodo);
//     if (!requestedTodo) {
//       continue;
//     }

//     update({ id, title, completed });
//   }
// }

export async function removeAll(ids) {
  const result = await client.query(`
    SELECT id
    FROM todos
  `);

  const dbIds = result.rows.map(object => object.id);

  if (!ids.every((id) => dbIds.includes(id))) {
    throw new Error();
  }
  
  await client.query(`
    DELETE FROM todos
    WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})
  `);
}

export async function updateAll(todos) {
  for (const { id, title, completed } of todos) {
    await update({ id, title, completed });
  }
}
