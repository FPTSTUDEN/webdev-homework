"require('dotenv').config();"
let header = {
  // 'Content-Type': 'application/json',
  'x-api-key': process.env.REQRES_API_KEY
};
let userData = {
  name: 'John Doe',
  job: 'Software Engineer'
};
// POST request to create a new user
let response = await fetch('https://reqres.in/api/users', {
  method: 'POST',
  headers: header,
  body: JSON.stringify(userData)
});
let data = await response.json();
console.log(data);