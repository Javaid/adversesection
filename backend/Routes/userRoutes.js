const express = require('express');
const Router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');

Router.get('/users', getUsers);
Router.post('/users', createUser);

module.exports = Router;