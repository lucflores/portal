const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const UsersManagers = require('../dao/UsersManagers');

router.get('/', authenticate, async (req, res) => {
  try {
    const users = await UsersManagers.getAll();
    res.send({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await UsersManagers.create(req.body);
    res.status(201).send({ status: 'success', payload: user });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

router.put('/:uid', async (req, res) => {
  try {
    const updated = await UsersManagers.update(req.params.uid, req.body);
    res.send({ status: 'success', payload: updated });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

router.delete('/:uid', async (req, res) => {
  try {
    const deleted = await UsersManagers.delete(req.params.uid);
    res.send({ status: 'success', payload: deleted });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

module.exports = router;
