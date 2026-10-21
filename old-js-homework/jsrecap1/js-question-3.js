function processInput() {
  const side1 = parseFloat(document.getElementById('side1').value);
  const side2 = parseFloat(document.getElementById('side2').value);
  const side3 = parseFloat(document.getElementById('side3').value);
  if (isNaN(side1) || isNaN(side2) || isNaN(side3)) {
    document.getElementById('output').textContent = 'Please enter valid numbers for all sides.';
    return;
  }
  if (side1 != side2 && side2 != side3 && side1 != side3) {
    value = 'The triangle is scalene.';
  } else if (side1 == side2 && side2 == side3) {
    value = 'The triangle is equilateral.';
  } else {
    value = 'The triangle is isosceles.';
  }
  // TODO: process the input for question 3
  document.getElementById('output').textContent = value;
}
