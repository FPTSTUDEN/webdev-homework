function sortArray(arr) {
  return arr.sort((a, b) => a - b);
}
let arr = [5, 2, 9, 1, 5, 6];
console.log(arr); // Output: [5, 2, 9, 1, 5, 6]
let sortedArr = sortArray(arr);
console.log(sortedArr); // Output: [1, 2, 5, 5, 6, 9]