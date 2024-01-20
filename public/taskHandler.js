function createTaskElement(task) {
    var taskItem = document.createElement('li');
    // Set the class based on the completion status. Assuming '0' means not completed.
    taskItem.className = 'task-item' + (task.completed === '0' ? '' : ' completed');
    taskItem.setAttribute('data-task-id', task.id);

    // Create the drag handle
    var dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.textContent = '≡'; // Using the Unicode character for the drag handle icon
    taskItem.appendChild(dragHandle);
 

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    // Set the checkbox based on the completion status. Assuming '0' means not completed.
    checkbox.checked = task.completed !== '0';
    checkbox.onchange = () => updateTaskCompletion(task.id, checkbox.checked);
    taskItem.appendChild(checkbox);

    var textNode = document.createTextNode(task.task_name);
    taskItem.appendChild(textNode);

    var deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '&times;';
    deleteIcon.className = 'delete-icon';
    deleteIcon.onclick = function() { deleteTask(task.id); };
    taskItem.appendChild(deleteIcon);

    return taskItem;
}

function addTaskToList(taskList, task) {
    var taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
}
