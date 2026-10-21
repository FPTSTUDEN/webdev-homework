

let fruits = ["apple", "banana", "orange", "grape", "kiwi"];
console.log(fruits);
console.log(fruits.length + " fruits in the array.");
console.log("The third fruit is " + fruits[2] + ".");
console.log("The last fruit is " + fruits[fruits.length - 1] + ".");
let vegetables = [];
// Prompt user to enter 3 vegetables and store them in the vegetables array
for (let i = 0; i < 3; i++) {
  let vegetable = prompt("Enter a vegetable:");
  vegetables.push(vegetable);
}
console.log(vegetables);
console.log(vegetables.length + " vegetables in the array.");