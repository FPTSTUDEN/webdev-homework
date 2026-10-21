require('dotenv').config();
let headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('x-api-key', process.env.REQRES_API_KEY);
let response = await fetch('https://reqres.in/api/users/1', { headers });
let data = await response.json();
console.log(data);