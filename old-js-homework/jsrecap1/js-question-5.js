function processInput() {
  const value = document.getElementById('input').value;
  let sum = 0;
  for (let i = 0; i <= value; i++) {
    sum += i;
  }
  document.getElementById('output').textContent = sum;
}
