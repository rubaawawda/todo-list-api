import express from 'express';
import cors from 'cors';
import util from './util.js';

const app = express();

const items = [];

app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Invalid content type');
    return;
  }

  const body = req.body;
  const valid = util.validateItem(body);

  if (!valid) {
    res.status(400).send('Invalid request payload');
    return;
  }

  if (items.find(item => item.id === body.id)) {
    res.status(409).send('A resource with the provided id already exists. Please call PUT / instead');
    return;
  }

  items.unshift(body);

  res.status(201).end();
});

app.put('/:id', (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Invalid content type');
    return;
  }

  const id = req.params.id;
  const body = req.body;
  const valid = util.validateItem(body);

  if (!valid) {
    res.status(400).send('Invalid request payload');
    return;
  }

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).send('The item you\'re trying to update does not exist. Call POST / instead');
    return;
  }

  items[index] = { ...body, id };

  res.sendStatus(204);
});

app.delete('/:id', (req, res) => {
  const id = req.params.id;

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).end();
    return;
  }

  items.splice(index, 1);

  res.sendStatus(204);
});

app.get('/', (req, res) => {
  setTimeout(() => res.send(items), 1000);
});

app.listen(3001, () => console.debug('API is running and listening at localhost:3001'));