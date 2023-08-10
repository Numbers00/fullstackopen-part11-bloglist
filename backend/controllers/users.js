const bcrypt = require('bcrypt');

const usersRouter = require('express').Router();

const User = require('../models/user.js');

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
    response.json(users);
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
});

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User
      .findById(request.params.id)
      .populate({
        path: 'blogs',
        select: 'title author url likes user'
      });
    if (!user) return response.status(404).end();
    response.json(user);
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  if (username.length < 3 || password.length < 3) {
    return response.status(400).send({
      error: 'username and password must be at least 3 characters long'
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
