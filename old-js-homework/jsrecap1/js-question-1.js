function processInput() {
  const value = document.getElementById('input').value;
  // TODO: process the input for question 1
  const value_in_fahrenheit = (value * 9/5) + 32;
  const value_in_kelvin = parseFloat(value) + 273.15;
  document.getElementById('output').textContent = `Fahrenheit: ${value_in_fahrenheit}, Kelvin: ${value_in_kelvin}`;
}
