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
// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
document.getElementsByTagName('ul')[0].insertAdjacentHTML('beforeend', todoList.map(item => `
  <li>
    <input type="checkbox" ${item.completed ? 'checked' : ''} disabled>
    <label for="todo-${item.id}">${item.task}</label>
  </li>
  `).join(''));