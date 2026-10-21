// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

// add your code here
document.getElementsByTagName('ul')[0].innerHTML = todoList.map(item => `
  <li>
    <input type="checkbox" ${item.completed ? 'checked' : ''} id="todo-${item.id}">
    <label for="todo-${item.id}">${item.task}</label>
    <button class="delete-button" data-id="${item.id}">Delete</button>
  </li>
  `).join('');
// changes array property when checkbox is clicked
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
  checkbox.addEventListener('change', () => {
    todoList[index].completed = checkbox.checked;
    console.log("Updated todoList:", todoList);
  });
});

// adds event listener to delete buttons
document.querySelectorAll('.delete-button').forEach(button => {
  button.addEventListener('click', () => {
    const id = parseInt(button.getAttribute('data-id'));
    const index = todoList.findIndex(item => item.id === id);
    todoList.splice(index, 1);
    let deletedItem = document.getElementById(`todo-${id}`);
    deletedItem.parentElement.remove();
    console.log("Updated todoList after deletion:", todoList);
  });
});
// document.getElementById('add-button').addEventListener('click', () => {
//   const newTaskInput = document.getElementById('new-task');
//   const newTask = newTaskInput.value.trim();
//   if (newTask) {
//     const newId = todoList.length ? Math.max(...todoList.map(item => item.id)) + 1 : 1;
//     todoList.push({ id: newId, task: newTask, completed: false });
//     document.getElementsByTagName('ul')[0].innerHTML += `
//       <li>
//         <input type="checkbox" id="todo-${newId}">
//         <label for="todo-${newId}">${newTask}</label>
//         <button class="delete-button" data-id="${newId}">Delete</button>
//       </li>
//     `;
//     newTaskInput.value = '';
//     console.log("Updated todoList after addition:", todoList);
//   }
// });