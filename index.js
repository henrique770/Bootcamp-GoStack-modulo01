const express = require('express');

const server = express();


server.use(express.json());

const users = ['Diego', 'Almeida', 'Julia'];

//Middleware de log que informa rotas e tempo de requisição
//Middleware Global
server.use((req, res, next) => {
console.time('Request');
console.log(`Método: ${req.method}; URL: ${req.url}`);

next();
console.timeEnd('Request');
});

//Middleware de verificação de usuário
//Middleware Local
function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

//Middleware de verificação do usuário no vetor

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  
  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}


//listar todos usuários

server.get('/users', (req, res) => {
return res.json(users);
});

//listar usuário

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);

});

//criar usuário

server.post('/users', checkUserExist,  (req, res) =>{
const { name } = req.body;

users.push(name);

return res.json(users);
});

//editar usuário

server.put('/users/:index', checkUserExist, checkUserInArray,  (req, res) =>{
const { index } = req.params;
const { name } = req.body;

users[index] = name;

return res.json(users);
});

//deletar usuário

server.delete('/users/:index', checkUserInArray, (req, res) =>{
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

 
server.listen(4000); 