import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
  const cats = [
    { id: 1, 
        name: 'Whiskers', 
        birthdate: '2018-05-12',
        weight: 4.5,
        owner: 'Alice',
        image: 'https://cataas.com/cat' 
    }
  ];
  res.json(cats);
});

app.use('/public', express.static('public'));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});