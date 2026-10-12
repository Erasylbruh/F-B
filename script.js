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
const todoStatus = document.getElementById('todo-status');

let todos = [];

function setTodoStatus(msg, isError = false) {
  if (!todoStatus) return;
  todoStatus.textContent = msg;
  todoStatus.style.color = isError ? '#ef4444' : '#10b981';
  if (!isError && msg) {
    setTimeout(() => { todoStatus.textContent = ''; }, 2500);
  }
}

async function fetchTodos() {
  setTodoStatus('Loading tasks from DummyJSON...');
  try {
    const res = await fetch(`${API_URL}?limit=4`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    todos = data.todos;
    renderTodos();
    setTodoStatus('');
  } catch (err) {
    console.error(err);
    setTodoStatus('Failed to load tasks', true);
  }
}

async function addTodo(taskText) {
  setTodoStatus('Saving task...');
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
    setTodoStatus('Task created!');
  } catch (err) {
    console.error(err);
    setTodoStatus('Failed to add task', true);
  }
}

async function updateTodo(id, changes) {
  setTodoStatus('Updating...');
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    });

    todos = todos.map(t => t.id === id ? { ...t, ...changes } : t);
    renderTodos();
    setTodoStatus('Task updated');
  } catch (err) {
    console.error(err);
    setTodoStatus('Failed to update task', true);
  }
}

async function deleteTodo(id) {
  setTodoStatus('Deleting...');
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    setTodoStatus('Task deleted');
  } catch (err) {
    console.error(err);
    setTodoStatus('Failed to delete task', true);
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

todoForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = todoInput.value.trim();
  if (val) {
    addTodo(val);
    todoInput.value = '';
  }
});

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
    const updated = prompt('Edit task text:', current?.todo);
    if (updated !== null && updated.trim() !== '') {
      updateTodo(id, { todo: updated.trim() });
    }
  }
});

fetchTodos();

// --- Tabs Switching Logic (h1 as switchers) ---
const tabButtons = document.querySelectorAll('.tabs-nav h1');
const lessonPanels = [
  document.querySelector('.les1'),
  document.querySelector('.les2'),
  document.querySelector('.les3'),
  document.querySelector('.les4'),
  document.querySelector('.les5')
];

function selectTab(index) {
  tabButtons.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('active', 'tab-active');
    } else {
      tab.classList.remove('active', 'tab-active');
    }
  });

  lessonPanels.forEach((panel, i) => {
    if (panel) {
      if (i === index) {
        panel.classList.add('active', 'active-lesson');
      } else {
        panel.classList.remove('active', 'active-lesson');
      }
    }
  });
}

tabButtons.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    selectTab(index);
  });
});

// Активируем первый таб (Lesson 1) по умолчанию
selectTab(0);