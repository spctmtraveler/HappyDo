window.onload = function() {
    var taskList = document.getElementById('task-list');

    fetch('https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/index.php')
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {

                // Loop through the tasks and add them to the list
                //
                data.data.forEach(task => {
                    addTaskToList(taskList, task);  // Use the function to add tasks
                });
            } else {
                console.log(data.message || 'No tasks found');
            }

             //initialize the sortable library
            var sortable = new Sortable(taskList, {
            draggable: '.task-item',
            handle: '.drag-handle',
            animation: 150
          });
          
        })
        .catch(error => console.error('Error:', error));

       
          
};


document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var taskInput = document.getElementById('task-input');
    var taskName = taskInput.value;  // Capture the task name in a local variable
    var taskList = document.getElementById('task-list');

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
            var newTask = { 
                id: data.id, 
                task_name: taskName,  // Use the local variable
                completed: '0'
            };
            console.log('New task object:', newTask);
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

