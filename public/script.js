window.onload = function () {
    // Initialize an array to hold all task lists
    var taskLists = [
        document.getElementById('unprioritized-tasks'),
        document.getElementById('list-a-tasks'),
        document.getElementById('list-b-tasks'),
        document.getElementById('list-c-tasks')
    ];

    // Initialize SortableJS for each task list
    taskLists.forEach(function (taskList) {
        new Sortable(taskList, {
            group: 'shared', // Set a group name to allow dragging between lists
            animation: 150,
            draggable: '.task-item',
            onAdd: function (event) {
                // Handle task drop logic here if needed
            }
        });
    });

    // Fetch tasks and add them to the 'unprioritized-tasks' list as an example
    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php')
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                data.data.forEach(task => {
                    var taskList;
                    switch (task.priority) {
                        case 'A':
                            taskList = document.getElementById('list-a-tasks');
                            break;
                        case 'B':
                            taskList = document.getElementById('list-b-tasks');
                            break;
                        case 'C':
                            taskList = document.getElementById('list-c-tasks');
                            break;
                        default:
                            taskList = document.getElementById('unprioritized-tasks');
                    }
                    var taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            } else {
                console.log(data.message || 'No tasks found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

/**
 * Handle form submission to create a new task
 * @param {Event} e - Form submit event 
 */
document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var taskInput = document.getElementById('task-input');
    var taskName = taskInput.value;  // Capture the task name in a local variable

    console.log('Submitting form with task:', taskName);

    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskName }),
    })
        .then(response => {
            console.log('Received response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            // Only add the task to the list if it was successfully created on the server
            if (data.success) {
                var newTask = { id: data.id, task_name: taskName, completed: '0' };
                console.log('New task object:', newTask);
                var taskList = document.getElementById('unprioritized-tasks');
                addTaskToList(taskList, newTask);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    taskInput.value = '';  // Clear the input field
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
        .then(response => response.json())  // This line expects a JSON response
        .then(data => {
            console.log('Delete response:', data);
            if (data.success) {
                var taskItem = document.querySelector('li[data-task-id="' + id + '"]');
                if (taskItem) {
                    taskItem.remove();
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

