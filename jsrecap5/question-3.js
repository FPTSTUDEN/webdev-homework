"require('dotenv').config();"
try {
  let response = await fetch('https://reqres.in/api/unknown/23', {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      'x-api-key': process.env.REQRES_API_KEY
    }
  });
  if (!response.ok) { // Check if the response status is not OK (e.g., 404, 500)
    // or if the response is empty
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let data = await response.json();
  console.log(data);
} catch (error) {
  console.error('Error fetching data:', error);
}