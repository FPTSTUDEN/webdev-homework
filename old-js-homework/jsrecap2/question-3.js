let input = "";
let arr=[];
while (input !== "done") {
  input = prompt("Enter a number (or type 'done' to finish):");
  if (!isNaN(input) && input !== "done") {
    arr.push(Number(input));
  }
}
let evenNumbers = [];
for (let i of arr) {
  if (i % 2 === 0) {
    evenNumbers.push(i);
  }
}
document.getElementById("output").innerHTML = "Even numbers: " + evenNumbers.join(", ");