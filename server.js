const express = require('express');

// import db from './data/db';
const db = require('./data/db');

const server = express();

// add middleware
server.use(express.json());

// route handlers
server.post('api/users', (req, res) => {
  const userInformation = req.body;
  console.log('user information', userInformation);

  db
    .insert(userInformation)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(400).json({ msg: 'Please provide all required fields' });
      } else {
        res.status(500).json({ erro: err });
      }
    });

  server.get('/', (req, res) => {
    res.send('Api running');
  });
});

// http://foo.com?search=bar&sort=asc
// req.query === { search: 'bar', sort: 'asc' }

// http://localhost:5000/api/users?id=1

server.delete('api/users', function(req, res) {
  const { id } = req.query;
  let user;
  db
    .findById(id)
    .then(foundUser => {
      user = { ...foundUser[0] };

      db.remove(id).then(response => {
        res.status(200).json(user);
      });
    })
    .catch(err => {
      res.status(500).json({ erro: err });
    });
});

server.get('/api/users', (req, res) => {
  //get the users
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
      // do something with the error
    });
});

// /api/users/123
server.get('/api/users/:id', (req, res) => {
  // grab the id from URL parameters
  const id = req.params.id;

  db
    .findById(id)
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ message: 'user not found' });
      } else {
        res.json(users[0]);
      }
    })
    .catch(err => {
      // do something with the error
      res.status(500).json({ error: err });
    });
});

server.listen(5000, () => console.log('\n== API Running on port 5000 ==\n'));
