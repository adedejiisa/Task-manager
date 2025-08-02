/// DOM SELECTION
const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const totalTaskElement = document.getElementById('total-tasks');
const completedTask = document.getElementById('completed-tasks');
const pendingTask = document.getElementById('pending-tasks');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

/// UPDATE STATS
const updateStats = () => {
    totalTaskElement.textContent = tasks.length;
    completedTask.textContent = tasks.filter(t => t.completed).length;
    pendingTask.textContent = tasks.filter(t => !t.completed).length;
    emptyState.style.display = tasks.length ? 'none' : 'block';
};

/// TOGGLE COMPLETED
const toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTask();
};

/// DELETE TASK
const deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    renderTask();
};
/// EDIT TASK
const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        renderTask();
    }
};

/// CREATE TASK ELEMENT
const createTask = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    const taskContent = document.createElement('div'); taskContent.className = 'task-content';
    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    taskContent.appendChild(editBtn);
    taskContent.appendChild(deleteBtn);

    li.appendChild(taskContent);
    return li;
};

/// FILTER BUTTON HANDLING
const applyFilter = (filter) => {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    renderTask();
};

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

/// RENDER TASKS BASED ON FILTER
const renderTask = () => {
    taskList.innerHTML = '';
    let filtered = tasks;

    if (currentFilter === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }

    filtered.forEach(task => {
        taskList.appendChild(createTask(task));
    });

    updateStats();
};

/// ADD TASK
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text,
        completed: false
    };
 tasks.push(task);
    taskInput.value = '';
    renderTask();
});

/// INIT APP
const init = () => {
    addBtn.disabled = true;
    taskInput.addEventListener('input', () => {
        addBtn.disabled = !taskInput.value.trim();
    });
    applyFilter('all');
};

init();
