const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const task = document.querySelector("#new-task");
const clearButton = document.querySelector("#clearButton");
const addButton = document.querySelector("addButton");

const STORAGE_KEY = "demo-to-do-tasks";

function sortTasksByDate(tasks) {
  return tasks.sort((a, b) => {
    return b.date - a.date;
  });
}

const updateList = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  let todo = [];
  let done = [];

  for (const id in tasks) {
    if (tasks[id].status === "done") {
      done.push({
        text: tasks[id].text,
        date: tasks[id].date,
        id,
      });
    } else {
      todo.push({
        text: tasks[id].text,
        date: tasks[id].date,
        id,
      });
    }
  }

  todo = sortTasksByDate(todo);
  done = sortTasksByDate(done);

  let out = "";
  if (todo.length) {
    out += '<li class="divider">To do</li>';
    for (const item of todo) {
      out += `
        <li class="task">
          <label title="Complete task">
              <input type="checkbox" value="${item.id}" class="box" title="Complete task">
              <span class="text">${item.text}</span>
          </label>
          <button type="button" data-task="${item.id}" class="edit" title="Edit task">✎</button>
          <button type="button" data-task="${item.id}" class="delete" title="Delete task">╳</button>
        </li>
        `;
    }
  } else {
    out += '<li class="divider">Completed</li>';
  }
  if (done.length) {
    out += '<li class="divider">Completed</li>';
    for (const item of done) {
      out += `
      <li class="task completed">
        <label title="Reopen task">
          <input type="checkbox" 
          checked
          value="${item.id}" class="box"
          title="Reopen task">
          <span class="text">${item.text}</span>
        </label>
        <button type="button" data-task="${item.id}" class="edit" title="Edit task"><i class="fa-sharp fa-solid fa-pen"></i></button>
        <button type="button" data-task="${item.id}" class="delete" title="Delete task">╳</button>
      </li>`;
    }
  }
  list.innerHTML = out;
};

const escapeHTML = (str) => {
  var p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
};

const uniqueID = () => {
  return Math.random().toString(36).substring(2, 9);
};

const addTask = (e) => {
  if (task.value) {
    const text = escapeHTML(task.value);
    const id = uniqueID();
    if (!tasks[id]) {
      console.info(`Adding task ${id}: ${text}`);
      tasks[id] = { status: "active", date: Date.now(), text: text };
      updateList();
      task.value = "";
    } else {
      console.warn(`Task ID ${id} already exists`);
    }
  }
  e.preventDefault();
  task.focus();
};

const editTask = (id) => {
  if (tasks[id]) {
    const taskText = tasks[id].text;
    const newText = prompt("Edit your task:", taskText);

    if (newText !== null) {
      tasks[id].text = escapeHTML(newText);
      updateList();
      console.info(`Edited task ${id}: ${newText}`);
    } else {
      console.info(`Edit cancelled for task ${id}`);
    }
  } else {
    console.warn(`Task ID ${id} not found`);
  }
};

const changeTask = (e) => {
  let t = e.target;

  // Deleting a task.
  if (t.classList.contains("delete")) {
    console.info(`Removing task: ${t.dataset.task}`);
    delete tasks[t.dataset.task];
    updateList();
    e.preventDefault();
  }

  // Editing a task.
  if (t.classList.contains("edit")) {
    console.info(`Editing task: ${t.dataset.task}`);
    editTask(t.dataset.task);
    e.preventDefault();
  }

  // Change a task's state.
  if (t.nodeName.toLowerCase() === "input" && t.type === "checkbox") {
    console.log(`Marking task ${t.value} as ${t.checked ? "done" : "active"}`);
    tasks[t.value].status = t.checked ? "done" : "active";
    tasks[t.value].date = Date.now();
    updateList();
    e.preventDefault();
  }
};

let tasks = localStorage.getItem(STORAGE_KEY)
  ? JSON.parse(localStorage.getItem(STORAGE_KEY))
  : {};

// Backward compat with old data structure.
if (tasks.length && !tasks[0].status) {
  tasks = {};
}
const clearAllTasks = () => {
  tasks = {};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  updateList();
};
if (addButton) {
  addButton.addEventListener("click", addTask);
}
clearButton.addEventListener("click", clearAllTasks);

updateList(tasks);

list.addEventListener("click", changeTask);
form.addEventListener("submit", addTask);
//ssssssssssssss
