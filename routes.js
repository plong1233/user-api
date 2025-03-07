// routes.js
const express = require('express');
const router = express.Router();
const { validateUser, createUser, updateUser, getUserById, getUserByUsername, deleteUser, getAllUsers } = require('./user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// WARNING: Authentication has been removed for testing purposes!

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const { error } = validateUser({ username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newUser = await createUser(username, password);
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate({ username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // No token generation since authentication is removed
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

router.post('/users', async (req, res) => {
  const { username, password } = req.body;

  const { error } = validateUser({ username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newUser = await createUser(username, password);
    res.status(201).json({
      message: 'User added successfully',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    console.error('Error adding user:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Failed to add user' });
  }
});

router.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password } = req.body;

  const { error } = validateUser({ username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    await updateUser(userId, username, password);
    res.json({
      message: 'User updated successfully',
      user: { id: userId, username: username },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await deleteUser(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Failed to get all users' });
  }
});

module.exports = router;