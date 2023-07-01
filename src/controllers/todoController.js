import * as todoService from '../services/todoService.js';

export const getAll = async (request, response) => {
  const todos = await todoService.getAll();
  response.send(todos);
};

export const getOne = async (request, response) => {
  const { todoId } = request.params;
  const requestedTodo = await todoService.getById(todoId);

  if (!requestedTodo) {
    response.sendStatus(404);
    return;
  }

  response.send(requestedTodo);
};

export const add = async (request, response) => {
  const { title } = request.body;

  if (!title) {
    response.sendStatus(422);
    return;
  }

  const newTodo = await todoService.create(title);

  response.statusCode = 201;

  response.send(newTodo);
};

export const remove = async (request, response) => {
  const { todoId } = request.params;
  const requestedTodo = await todoService.getById(todoId);

  if (!requestedTodo) {
    response.sendStatus(404);
    return;
  }

  await todoService.remove(todoId);
  response.sendStatus(204);
};

export const update = async (request, response) => {
  const { todoId } = request.params;
  const requestedTodo = await todoService.getById(todoId);

  if (!requestedTodo) {
    response.sendStatus(404);
    return;
  }

  const { title, completed } = request.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    response.sendStatus(422);
    return;
  }

  await todoService.update({ id: todoId, title, completed });
  
  const updatedTodo = await todoService.getById(todoId);
  response.send(updatedTodo);
};

export const removeAll = async (req, res) => {
  const { ids } = req.body;

  try {
    await todoService.removeAll(ids);
  } catch (error) {
    res.sendStatus(404);
    return;
  }
    
  res.sendStatus(204);
};

export const updateAll = async (req, res) => { 
  const { todos: items } = req.body;
  await todoService.updateAll(items);

  res.send('updated');
};
// export const updateAll = (req, res) => { 
//   const { todos: items } = req.body;

//   const success = [];
//   const fail = [];

//   for (const { id, title, completed } of items) {
//     const requestedTodo = todoService.getById(id);
//     if (!requestedTodo) {
//       fail.push(id);
//       continue;
//     }

//     todoService.update({ id, title, completed });
//     success.push(id);
//   }
//   res.send({success, fail});
// };
