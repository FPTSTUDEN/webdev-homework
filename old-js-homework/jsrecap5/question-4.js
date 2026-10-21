"require('dotenv').config();"
async function fetchData(url, options) {
  let response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let data = await response.json();
  return data;
}
try {
    const user = {
      name: 'John Doe',
      job: 'Developer'
    };
    const url = 'https://reqres.in/api/users';
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REQRES_API_KEY
      },
      body: JSON.stringify(user)
    }
    const userData = await fetchData(url, options);
    console.log(userData);
  } catch (error) {
    console.error('An error occurred:', error);
  }