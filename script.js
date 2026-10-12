const hworldBtn = document.getElementById('hworld-btn');
const text = document.getElementById('hworld');
const createBtn = document.getElementById('mknewdiv');
const delBtn = document.getElementById('rmolde');
const oldEl = document.querySelector('.old-element');
const textChan = document.getElementById('chan-col');
const mba = document.querySelector('.mba');
const target = document.getElementById('target');
const output = document.getElementById('output');
const genBtn = document.getElementById('gen-btn');
const rowsInput = document.getElementById('rows-input');
const colsInput = document.getElementById('cols-input');
const counterEl = document.getElementById('counter');
const themeBtn = document.getElementById('chan-theme');

hworldBtn?.addEventListener('click', () => {
  text.textContent = 'Hello, World!';
});

createBtn?.addEventListener('click', () => {
  const newDiv = document.createElement('div');
  newDiv.textContent = "I'm a new div";
  newDiv.classList.add('new-div');
  document.body.appendChild(newDiv);
});

delBtn?.addEventListener('click', () => {
  if (oldEl) oldEl.remove();
});

textChan?.addEventListener('click', () => {
  textChan.style.color = 'red';
  textChan.style.fontSize = '20px';
});

mba?.addEventListener('click', () => {
  mba.classList.toggle('active');
});

target?.addEventListener('click', () => {
  const classesArray = Array.from(target.classList);
  console.log('Class list (Array):', classesArray);
  console.log('Class line:', target.className);

  if (classesArray.length > 0) {
    output.textContent = 'Classes: ' + classesArray.join(', ');
  } else {
    output.textContent = 'I have no classes';
  }
});

genBtn?.addEventListener('click', () => {
  const rows = parseInt(rowsInput.value, 10);
  const cols = parseInt(colsInput.value, 10);
  createTable(rows, cols, 'tableContainer');
});

function createTable(rows, cols, containerId) {
  const table = document.createElement('table');

  for (let r = 1; r <= rows; r++) {
    const tr = document.createElement('tr');
    for (let c = 1; c <= cols; c++) {
      const td = document.createElement('td');
      td.textContent = `${r}:${c}`;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  table.addEventListener('click', (event) => {
    if (event.target.tagName === 'TD') {
      event.target.classList.toggle('selected');
      const selectedCells = table.querySelectorAll('td.selected');
      counterEl.textContent = selectedCells.length;
    }
  });

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
    container.appendChild(table);
    counterEl.textContent = 0;
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  if (themeBtn) themeBtn.textContent = 'Switch to Light Theme';
}

themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');

  if (isDark) {
    themeBtn.textContent = 'Switch to Light Theme';
    localStorage.setItem('theme', 'dark');
  } else {
    themeBtn.textContent = 'Switch to Dark Theme';
    localStorage.setItem('theme', 'light');
  }
});

const API_URL = 'https://dummyjson.com/todos';
const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoPopup = document.getElementById('todo-popup');
const todoPopupMsg = document.getElementById('todo-popup-message');
const todoPopupIcon = document.getElementById('todo-popup-icon');
const todoPopupClose = document.getElementById('todo-popup-close');

let todos = [];

function showTodoPopup(message, isError = false) {
  if (!todoPopup || !todoPopupMsg || !todoPopupIcon) return;

  todoPopupMsg.textContent = message;

  if (isError) {
    todoPopupIcon.textContent = '✕';
    todoPopupIcon.className = 'todo-popup-icon error';
  } else {
    todoPopupIcon.textContent = '✓';
    todoPopupIcon.className = 'todo-popup-icon';
  }

  todoPopup.classList.add('show');
  todoPopup.setAttribute('aria-hidden', 'false');
}

function closeTodoPopup() {
  if (!todoPopup) return;
  todoPopup.classList.remove('show');
  todoPopup.setAttribute('aria-hidden', 'true');

}

todoPopupClose?.addEventListener('click', closeTodoPopup);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTodoPopup();
    closeEditPopup();
    closeAddPopup();
  }
});

const addBtn = document.getElementById('add-btn');
const addPopup = document.getElementById('add-popup');
const addInput = document.getElementById('add-task-input');
const addSaveBtn = document.getElementById('add-save-btn');
const addCancelBtn = document.getElementById('add-cancel-btn');

function openAddPopup() {
  if (!addPopup || !addInput) return;
  addInput.value = '';
  addPopup.classList.add('show');
  addPopup.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    addInput.focus();
  }, 50);
}

function closeAddPopup() {
  if (!addPopup) return;
  addPopup.classList.remove('show');
  addPopup.setAttribute('aria-hidden', 'true');
}

function handleSaveAdd() {
  if (!addInput) return;
  const val = addInput.value.trim();
  if (val) {
    addTodo(val);
    closeAddPopup();
  } else {
    addInput.focus();
  }
}

addBtn?.addEventListener('click', openAddPopup);
addSaveBtn?.addEventListener('click', handleSaveAdd);
addCancelBtn?.addEventListener('click', closeAddPopup);
addInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSaveAdd();
  }
});


const editPopup = document.getElementById('edit-popup');
const editInput = document.getElementById('edit-task-input');
const editSaveBtn = document.getElementById('edit-save-btn');
const editCancelBtn = document.getElementById('edit-cancel-btn');

let currentEditingId = null;

function openEditPopup(id, initialText) {
  currentEditingId = id;
  if (!editPopup || !editInput) return;

  editInput.value = initialText || '';
  editPopup.classList.add('show');
  editPopup.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    editInput.focus();
    editInput.select();
  }, 50);
}

function closeEditPopup() {
  currentEditingId = null;
  if (!editPopup) return;
  editPopup.classList.remove('show');
  editPopup.setAttribute('aria-hidden', 'true');
}

function handleSaveEdit() {
  if (currentEditingId === null) return;
  const newText = editInput.value.trim();
  if (newText) {
    updateTodo(currentEditingId, { todo: newText });
    closeEditPopup();
  } else {
    editInput.focus();
  }
}

editSaveBtn?.addEventListener('click', handleSaveEdit);
editCancelBtn?.addEventListener('click', closeEditPopup);

[addPopup, editPopup, todoPopup].forEach(popup => {
  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
    }
  });
});
editInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSaveEdit();
  }
});


async function fetchTodos() {
  try {
    const res = await fetch(`${API_URL}?limit=4`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    todos = data.todos;
    renderTodos();
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to load tasks', true);
  }
}

async function addTodo(taskText) {
  try {
    const res = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: taskText,
        completed: false,
        userId: 1
      })
    });
    if (!res.ok) throw new Error('Create error');
    const created = await res.json();
    
    created.id = Date.now();
    todos.unshift(created);
    renderTodos();
    showTodoPopup('Task created!');
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to add task', true);
  }
}

async function updateTodo(id, changes) {
  try {
    if (id <= 150) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      });
    }

    todos = todos.map(t => t.id === id ? { ...t, ...changes } : t);
    renderTodos();
    showTodoPopup('Task updated!');
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to update task', true);
  }
}

async function deleteTodo(id) {
  try {
    if (id <= 150) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    showTodoPopup('Task deleted!');
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to delete task', true);
  }
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<li style="text-align:center; opacity: 0.6;">No tasks</li>';
    return;
  }

  todos.forEach(item => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="todo-check" ${item.completed ? 'checked' : ''}>
        <span class="todo-text ${item.completed ? 'done' : ''}">${item.todo}</span>
      </div>
      <div class="todo-actions">
        <button class="btn-edit">✎</button>
        <button class="btn-del">✕</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

todoList?.addEventListener('click', (e) => {
  const row = e.target.closest('.todo-item');
  if (!row) return;

  const id = Number(row.dataset.id);
  const current = todos.find(t => t.id === id);

  if (e.target.classList.contains('todo-check')) {
    updateTodo(id, { completed: e.target.checked });
  }

  if (e.target.classList.contains('btn-del')) {
    deleteTodo(id);
  }

  if (e.target.classList.contains('btn-edit')) {
    openEditPopup(id, current?.todo);
  }
});

fetchTodos();

const USERS_API_URL = 'https://dummyjson.com/users?limit=6';
const usersContainer = document.getElementById('users-container');
const usersStatus = document.getElementById('users-status');
const reloadUsersBtn = document.getElementById('reload-users-btn');

async function fetchUsers() {
  if (!usersContainer) return;
  if (usersStatus) {
    usersStatus.textContent = 'Loading users...';
    usersStatus.style.color = 'var(--text-color)';
  }
  usersContainer.innerHTML = '';

  try {
    const res = await fetch(USERS_API_URL);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    renderUsers(data.users || []);
    if (usersStatus) usersStatus.textContent = '';
  } catch (err) {
    console.error(err);
    if (usersStatus) {
      usersStatus.textContent = 'Failed to load users';
      usersStatus.style.color = '#ef4444';
    }
  }
}

function renderUsers(users) {
  if (!usersContainer) return;
  usersContainer.innerHTML = '';

  if (users.length === 0) {
    usersContainer.innerHTML = '<p style="text-align:center; opacity:0.6; grid-column: 1 / -1;">No users</p>';
    return;
  }

  users.forEach(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const card = document.createElement('div');
    card.className = 'user-card';

    card.innerHTML = `
      <img class="user-avatar" src="${user.image}" alt="${fullName}" loading="lazy">
      <span class="user-name">${fullName}</span>
    `;

    usersContainer.appendChild(card);
  });
}

reloadUsersBtn?.addEventListener('click', fetchUsers);
fetchUsers();

const tabButtons = document.querySelectorAll('.tabs-nav h1');
const lessonPanels = document.querySelectorAll('.tabs-content > div');

function selectTab(index) {
  tabButtons.forEach((tab, i) => tab.classList.toggle('tab-active', i === index));
  lessonPanels.forEach((panel, i) => panel.classList.toggle('active-lesson', i === index));
}

tabButtons.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    selectTab(index);
  });
});

selectTab(0);