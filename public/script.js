window.onload = function() {
    var taskList = document.getElementById('task-list');

    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php')
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {

                // Loop through the tasks and add them to the list
                //
                data.data.forEach(task => {
                    var taskItem = document.createElement('li');
                    taskItem.setAttribute('data-task-id', task.id);
                
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed === '1'; // Convert to boolean if necessary
                    checkbox.onchange = () => updateTaskCompletion(task.id, checkbox.checked);

                    taskItem.appendChild(checkbox);
                    taskItem.append(document.createTextNode(task.task_name));
                    taskItem.className = 'task-item' + (task.completed === '1' ? ' completed' : ''); // Convert to boolean if necessary
                    taskList.appendChild(taskItem);

                    var deleteIcon = document.createElement('span');
                    deleteIcon.innerHTML = '&times;'; // Multiplication sign as delete icon
                    deleteIcon.className = 'delete-icon';
                    deleteIcon.onclick = function() { deleteTask(task.id); };
                    taskItem.appendChild(deleteIcon);
                });
            } else {
                console.log(data.message || 'No tasks found');
            }
        })
        .catch(error => console.error('Error:', error));
};


document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var taskInput = document.getElementById('task-input');
    var taskList = document.getElementById('task-list');
    var taskItem = document.createElement('li');
    taskItem.textContent = taskInput.value;
    taskItem.className = 'task-item';

    console.log('Submitting form with task:', taskInput.value);

    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskInput.value }),
    })
        .then(response => {
            console.log('Received response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            // Only add the task to the list if it was successfully created on the server
            if (data.success) {
                taskList.appendChild(taskItem);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    taskInput.value = '';
});

function updateTaskCompletion(id, completed) {
    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, completed: completed }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update response:', data);
        // Find the task item in the DOM and update its class
        var taskItem = document.querySelector('li[data-task-id="' + id + '"]');
        if (taskItem) {
            if (completed) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php?id=' + id, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Delete response:', data);
            if (data.success) {
                // Remove the task item from the list
                var taskItem = document.querySelector('li[data-task-id="' + id + '"]');
                if (taskItem) {
                    taskItem.remove();
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

