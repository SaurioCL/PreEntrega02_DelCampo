document.addEventListener('DOMContentLoaded', function () {
    
    function esCadenaVacia(cadena) {
        return cadena.trim() === '';
    }
    
    function contieneSoloLetras(cadena) {
        return /^[a-zA-Zá-únÑ\s]*$/.test(cadena);
    }
    
    function solicitarNombre() {
        let nombre;
        while (true) {
            nombre = prompt("Por favor, ingresa tu nombre:");
    
            if (!esCadenaVacia(nombre) && contieneSoloLetras(nombre)) {
                break;
            } else {
                alert('Por favor, ingresa tu nombre sin números.');
            }
        }
        return { nombre };
    }
    
    //Variables de JS
    const { nombre } = solicitarNombre();
    const nombreCompleto = document.getElementById('nombreCompleto');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskTimeInput = document.getElementById('taskTime');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const filterCompletedButton = document.getElementById('filterCompletedButton');
    const showAllButton = document.getElementById('showAllButton');
    const tasks = [];

    nombreCompleto.textContent = `${nombre}`;

    //Funciones esenciales
    function addTask(text, time) {
        const task = {
            id: Date.now(),
            text: text,
            time: time,
            completed: false
        };

        tasks.push(task);
        saveTasksToLocalStorage();
        renderTask(task);
    }

    function renderTask(task) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const timeSpan = document.createElement('span');
        const deleteButton = document.createElement('span');

        span.textContent = task.text;
        timeSpan.textContent = `Hora: ${task.time}`;
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete';

        deleteButton.addEventListener('click', function () {
            deleteTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(deleteButton);

        if (task.completed) {
            li.classList.add('completed');
        }

        li.addEventListener('click', function () {
            toggleTaskStatus(task.id);
        });

        taskList.appendChild(li);
    }

    function deleteTask(id) {
        const index = tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            renderTasks();
        }
    }

    function toggleTaskStatus(id) {
        const index = tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            saveTasksToLocalStorage();
            renderTasks();
        }
    }

    function renderTasks() {
        tasks.sort((a, b) => {
            return new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`);
        });
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    }

    //función para buscar
    function searchTasks(query) {
        const lowerCaseQuery = query.toLowerCase();
        const searchResults = tasks.filter(task => task.text.toLowerCase().includes(lowerCaseQuery));
        renderFilteredTasks(searchResults);
    }

    function filterCompletedTasks() {
        const completedTasks = tasks.filter(task => task.completed);
        renderFilteredTasks(completedTasks);
    }

    function showAllTasks() {
        renderTasks();
    }

    function renderFilteredTasks(filteredTasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach(task => renderTask(task));
    }
    //Al cargar, obtener tareas almacenadas en el almacenamiento local
    function loadTasksFromLocalStorage() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));

        if (storedTasks) {
            tasks.push(...storedTasks);
            renderTasks();
        }
    }

    //Guardar las tareas en el almacenamiento local
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //Eventos
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const taskTime = taskTimeInput.value;

        if (taskText !== '') {
            addTask(taskText, taskTime);
            taskInput.value = '';
            taskTimeInput.value = '';
        }
    });

    searchInput.addEventListener('input', function () {
        searchTasks(searchInput.value);
    });


    filterCompletedButton.addEventListener('click', function () {
        filterCompletedTasks();
    });

    showAllButton.addEventListener('click', function () {
        showAllTasks();
    });

    // Inicialización
    loadTasksFromLocalStorage();
});