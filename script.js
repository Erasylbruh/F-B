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
let users = [];
const fetchedUserTodos = new Set();
let currentModalUserId = null;

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

const addBtn = document.getElementById('add-btn');
const addPopup = document.getElementById('add-popup');
const addInput = document.getElementById('add-task-input');
const addTaskUserSelect = document.getElementById('add-task-user');
const addSaveBtn = document.getElementById('add-save-btn');
const addCancelBtn = document.getElementById('add-cancel-btn');

function populateUserSelect(selectedUserId = null) {
  if (!addTaskUserSelect) return;
  if (users.length === 0) {
    addTaskUserSelect.innerHTML = '<option value="1">User 1</option>';
    return;
  }
  addTaskUserSelect.innerHTML = users.map(u => 
    `<option value="${u.id}">${u.firstName} ${u.lastName}</option>`
  ).join('');

  if (selectedUserId) {
    addTaskUserSelect.value = String(selectedUserId);
  }
}

function openAddPopup(defaultUserId = null) {
  if (!addPopup || !addInput) return;
  addInput.value = '';
  populateUserSelect(defaultUserId);
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
  const userId = addTaskUserSelect ? Number(addTaskUserSelect.value) || 1 : 1;
  if (val) {
    addTodo(val, userId);
    closeAddPopup();
  } else {
    addInput.focus();
  }
}

addBtn?.addEventListener('click', () => openAddPopup());
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
editInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSaveEdit();
  }
});

// User Modal Elements & Handlers
const userModal = document.getElementById('user-modal');
const userModalClose = document.getElementById('user-modal-close');
const userModalAvatar = document.getElementById('user-modal-avatar');
const userModalName = document.getElementById('user-modal-name');
const userModalUsername = document.getElementById('user-modal-username');
const userModalEmail = document.getElementById('user-modal-email');
const userModalPhone = document.getElementById('user-modal-phone');
const userModalAge = document.getElementById('user-modal-age');
const userModalAddress = document.getElementById('user-modal-address');
const userModalCompany = document.getElementById('user-modal-company');
const userModalTasksCount = document.getElementById('user-modal-tasks-count');
const userModalTaskInput = document.getElementById('user-modal-task-input');
const userModalAddBtn = document.getElementById('user-modal-add-btn');
const userModalStatus = document.getElementById('user-modal-status');
const userModalTaskList = document.getElementById('user-modal-task-list');

function closeUserModal() {
  if (!userModal) return;
  userModal.classList.remove('show');
  userModal.setAttribute('aria-hidden', 'true');
  currentModalUserId = null;
}

userModalClose?.addEventListener('click', closeUserModal);

async function openUserModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user || !userModal) return;

  currentModalUserId = userId;

  if (userModalAvatar) {
    userModalAvatar.src = user.image || '';
    userModalAvatar.alt = `${user.firstName} ${user.lastName}`;
  }
  if (userModalName) userModalName.textContent = `${user.firstName} ${user.lastName}`;
  if (userModalUsername) userModalUsername.textContent = user.username ? `@${user.username}` : '';
  if (userModalEmail) userModalEmail.textContent = user.email || '-';
  if (userModalPhone) userModalPhone.textContent = user.phone || '-';
  if (userModalAge) userModalAge.textContent = `${user.age || '-'} y.o. (${user.gender || '-'})`;
  
  const addressParts = [user.address?.city, user.address?.address].filter(Boolean).join(', ');
  if (userModalAddress) userModalAddress.textContent = addressParts || '-';

  const companyParts = [user.company?.title, user.company?.name].filter(Boolean).join(' at ');
  if (userModalCompany) userModalCompany.textContent = companyParts || '-';

  if (userModalTaskInput) userModalTaskInput.value = '';
  if (userModalStatus) userModalStatus.textContent = '';

  userModal.classList.add('show');
  userModal.setAttribute('aria-hidden', 'false');

  renderUserModalTasks(userId);

  // Fetch initial tasks from DummyJSON if not yet fetched for this user
  if (!fetchedUserTodos.has(userId)) {
    if (userModalStatus) {
      userModalStatus.textContent = 'Loading user tasks...';
      userModalStatus.style.color = 'var(--text-color)';
    }
    try {
      const res = await fetch(`https://dummyjson.com/todos/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const incoming = data.todos || [];
        incoming.forEach(inTodo => {
          if (!todos.some(t => t.id === inTodo.id)) {
            todos.push(inTodo);
          }
        });
        fetchedUserTodos.add(userId);
        if (userModalStatus) userModalStatus.textContent = '';
        renderUserModalTasks(userId);
        renderTodos();
      }
    } catch (err) {
      console.error(err);
      if (userModalStatus) {
        userModalStatus.textContent = 'Failed to load user tasks';
        userModalStatus.style.color = '#ef4444';
      }
    }
  }
}

function renderUserModalTasks(userId) {
  if (!userModalTaskList) return;
  const userTasks = todos.filter(t => t.userId === userId);
  
  if (userModalTasksCount) {
    userModalTasksCount.textContent = `${userTasks.length} task${userTasks.length === 1 ? '' : 's'}`;
  }

  userModalTaskList.innerHTML = '';
  if (userTasks.length === 0) {
    userModalTaskList.innerHTML = '<li style="text-align:center; opacity:0.6; padding: 14px;">No tasks assigned</li>';
    return;
  }

  userTasks.forEach(item => {
    const li = document.createElement('li');
    li.className = 'user-modal-task-item';
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="todo-check" ${item.completed ? 'checked' : ''}>
        <span class="todo-text ${item.completed ? 'done' : ''}">${item.todo}</span>
      </div>
      <div class="todo-actions">
        <button class="btn-del" title="Delete">✕</button>
      </div>
    `;

    userModalTaskList.appendChild(li);
  });
}

userModalTaskList?.addEventListener('click', (e) => {
  const row = e.target.closest('.user-modal-task-item');
  if (!row) return;

  const id = Number(row.dataset.id);

  if (e.target.classList.contains('todo-check')) {
    updateTodo(id, { completed: e.target.checked });
  }

  if (e.target.classList.contains('btn-del')) {
    deleteTodo(id);
  }
});

function handleUserModalAddTask() {
  if (!userModalTaskInput || !currentModalUserId) return;
  const val = userModalTaskInput.value.trim();
  if (val) {
    addTodo(val, currentModalUserId);
    userModalTaskInput.value = '';
  } else {
    userModalTaskInput.focus();
  }
}

userModalAddBtn?.addEventListener('click', handleUserModalAddTask);
userModalTaskInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleUserModalAddTask();
  }
});

// Close popups on Escape and backdrop clicks
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTodoPopup();
    closeEditPopup();
    closeAddPopup();
    closeUserModal();
  }
});

[addPopup, editPopup, todoPopup, userModal].forEach(popup => {
  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
      if (popup === userModal) currentModalUserId = null;
    }
  });
});

async function fetchTodos() {
  try {
    // Load initial tasks for existing users (User 1 and User 2) so all tasks have an assigned user
    const [res1, res2] = await Promise.all([
      fetch(`${API_URL}/user/1`),
      fetch(`${API_URL}/user/2`)
    ]);
    const data1 = res1.ok ? await res1.json() : { todos: [] };
    const data2 = res2.ok ? await res2.json() : { todos: [] };

    todos = [...(data1.todos || []), ...(data2.todos || [])];
    fetchedUserTodos.add(1);
    fetchedUserTodos.add(2);
    renderTodos();
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to load tasks', true);
  }
}

async function addTodo(taskText, userId = 1) {
  try {
    const res = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: taskText,
        completed: false,
        userId: userId
      })
    });
    if (!res.ok) throw new Error('Create error');
    const created = await res.json();
    
    created.id = Date.now();
    created.userId = userId;
    todos.unshift(created);
    renderTodos();
    if (currentModalUserId === userId) {
      renderUserModalTasks(userId);
    }
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
    if (currentModalUserId) {
      renderUserModalTasks(currentModalUserId);
    }
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
    if (currentModalUserId) {
      renderUserModalTasks(currentModalUserId);
    }
    showTodoPopup('Task deleted!');
  } catch (err) {
    console.error(err);
    showTodoPopup('Failed to delete task', true);
  }
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';

  // Only display tasks that have an assigned user in the loaded users list
  const visibleTodos = todos.filter(item => users.some(u => u.id === item.userId));

  if (visibleTodos.length === 0) {
    todoList.innerHTML = '<li style="text-align:center; opacity: 0.6;">No tasks</li>';
    return;
  }

  visibleTodos.forEach(item => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = item.id;

    const assignedUser = users.find(u => u.id === item.userId);
    const userBadgeHtml = assignedUser
      ? `<span class="todo-user-badge" data-user-id="${assignedUser.id}" title="View ${assignedUser.firstName}'s profile">${assignedUser.firstName} ${assignedUser.lastName}</span>`
      : '';

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="todo-check" ${item.completed ? 'checked' : ''}>
        <span class="todo-text ${item.completed ? 'done' : ''}">${item.todo}</span>
        ${userBadgeHtml}
      </div>
      <div class="todo-actions">
        <button class="btn-edit" title="Edit">✎</button>
        <button class="btn-del" title="Delete">✕</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

todoList?.addEventListener('click', (e) => {
  const badge = e.target.closest('.todo-user-badge');
  if (badge) {
    const uid = Number(badge.dataset.userId);
    if (uid) openUserModal(uid);
    return;
  }

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

async function fetchUsers() {
  try {
    const res = await fetch(USERS_API_URL);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    users = data.users || [];
    populateUserSelect();
    renderTodos();
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

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