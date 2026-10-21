let numbers = [];
for (let i = 0; i < 5; i++) {
  let number = parseInt(prompt("Enter a number:"));
  numbers.push(number);
}
console.log(numbers);
document.getElementById('output').textContent = numbers.join(', ');
let number = parseInt(prompt("Enter a number to search for:"));
if (numbers.includes(number)) {
  // display a message indicating that the number was found
  // document.getElementById('output').textContent += `\nThe number ${number} was found in the array.`;
  window.alert(`The number ${number} was found in the array.`);
} else {
  // display a message indicating that the number was not found
  // document.getElementById('output').textContent += `\nThe number ${number} was not found in the array.`;
  window.alert(`The number ${number} was not found in the array.`);
}
// sort the array in ascending order
numbers.sort((a, b) => a - b);
console.log(numbers);
document.getElementById('output').textContent += `\nSorted numbers: ${numbers.join(', ')}`;