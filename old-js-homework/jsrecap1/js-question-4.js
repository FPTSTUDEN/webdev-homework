function processInput() {
  const score = parseFloat(document.getElementById('input').value);
  let value;
  if (score < 40) { value = 0; }
  else if (score < 52) { value = 1; }
  else if (score < 64) { value = 2; }
  else if (score < 76) { value = 3; }
  else if (score < 88) { value = 4; }
  else { value = 5; }
  // TODO: process the input for question 4
  document.getElementById('output').textContent = value;
}
