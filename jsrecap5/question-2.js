let header = {
  // 'Content-Type': 'application/json',
  'x-api-key': 'free_user_3Jl2mztF6LWjokidOWy474F4osu'
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