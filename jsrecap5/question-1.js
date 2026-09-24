let headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('x-api-key', 'free_user_3Jl2mztF6LWjokidOWy474F4osu');
let response = await fetch('https://reqres.in/api/users/1', { headers });
let data = await response.json();
console.log(data);