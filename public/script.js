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

            group: 'shared', 
            animation: 150,
            draggable: '.task-item',

            onAdd: function(event) {
            var taskElement = event.item;   
            var taskId = taskElement.dataset.taskId;
            var newPriorityList = event.to.id;
            var newPriority = newPriorityList.split('-')[1]; // Index 1 for 'a', not 2
            toggleUnprioritizedDisplay(); 

            console.log('taskID:', taskId); // This should show task id numer
            console.log('New Priority List ID:', newPriorityList); // This should show the full ID
            console.log('New priority:', newPriority); // This should show the extracted priority character
        

            fetch('http://localhost/HappyDo/public/index.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: taskId,
                    priority: newPriority
                })
            })
            
            .then(response => response.json())
            .then(responseData => {
                console.log('Priority updated:', responseData);  
            })
            .catch(error => {
                console.error('Error updating priority:', error);
            });

            },
            
            onUpdate: function(event) {
            console.log("onUpdate");
            toggleUnprioritizedDisplay(); 
            }

        });
    
        new Sortable(document.getElementById('btn-back'), {
            group: 'shared',
            onAdd: function(event) {
                var taskElement = event.item;
                var taskId = taskElement.dataset.taskId;
        
                // Update the task's backlog in the database
                updateTaskBacklog(taskId, 1); // Set backlog to 1
        
                // Remove the task element from the DOM
                taskElement.parentNode.removeChild(taskElement);
            }
        });
        
        

    });


    // Fetch tasks and add them to the 'unprioritized-tasks' 
    fetch('http://localhost/HappyDo/public/index.php')
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                data.data.forEach(task => {
                    var taskList;
                    var priority = task.priority ? task.priority.toUpperCase() : null; // Convert priority to uppercase
                    console.log('task Priority:', task.priority); // This should show task id numer
                    switch (priority) {
                        case 'A':
                            taskList = document.getElementById('list-a-tasks');
                            console.log('Put task in list A');
                            break;
                        case 'B':
                            taskList = document.getElementById('list-b-tasks');
                            console.log('Put task in list B');
                            break;
                        case 'C':
                            taskList = document.getElementById('list-c-tasks');
                            console.log('Put task in list C');
                            break;
                        default:
                            taskList = document.getElementById('unprioritized-tasks');
                            console.log('Put task in unprioritized list');
                    }
                    var taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                    toggleUnprioritizedDisplay(); // Call the function to toggle the display of the unprioritized tasks if necessary    
                    
                });
            } else {
                console.log(data.message || 'No tasks found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })

        function fetchTasksWithFilter(filter) {
            fetch(`http://localhost/HappyDo/public/index.php?filter=${filter}`)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    displayTasks(data.data); // Pass the array of tasks to the new displayTasks function
                } else {
                    console.log(data.message || 'No tasks found');
                }
            })
            .catch(error => console.error('Error:', error));
        }
        
        
        
        // Event listeners for filter switching buttons
        document.getElementById('btn-today').addEventListener('click', function() {
            fetchTasksWithFilter('today');
        });
        
        document.getElementById('btn-back').addEventListener('click', function() {
            fetchTasksWithFilter('back');
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

        fetch('http://localhost/HappyDo/public/index.php', {
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
                    var newTask = { id: data.id, task_name: taskName };

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

    function updateTaskBacklog(taskId, backlogValue) {
        // Capture the task element before the fetch request
        var taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

        fetch('http://localhost/HappyDo/public/index.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: taskId,
                backlog: backlogValue
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && taskElement) {
                console.log('Backlog updated:', data);
                // Remove the task element from the DOM after ensuring it exists and the backlog was updated
                //taskElement.parentNode.removeChild(taskElement);
            }
        })
        .catch(error => {
            console.error('Error updating backlog:', error);
        });
    }





    function updateTaskCompletion(id, completed) {
        fetch('http://localhost/HappyDo/public/index.php', {
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
            fetch('http://localhost/HappyDo/public/index.php?id=' + id, {
                method: 'DELETE',
            })
            .then(response => response.json())  // This line expects a JSON response
            .then(data => {
                console.log('Delete response:', data);
                if (data.success) {
                    var taskItem = document.querySelector('li[data-task-id="' + id + '"]');
                    if (taskItem) {
                        taskItem.remove();
                        toggleUnprioritizedDisplay(); // Call the function to toggle the display of the unprioritized tasks if necessary
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Fetch a single task by ID
    function fetchTask(taskId) {
        fetch(`http://localhost/HappyDo/public/index.php?id=${taskId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Task data:', data);
            // Process and display the task data on the front end
        })
        .catch(error => console.error('Error fetching task:', error));
    }



