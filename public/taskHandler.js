function createTaskElement(task) {
    var taskItem = document.createElement('li');
    // Set the class based on the completion status. Assuming '0' means not completed.
    taskItem.className = 'task-item' + (task.completed !== "0" ? '' : ' completed');
    taskItem.setAttribute('data-task-id', task.id);
    taskItem.setAttribute('data-task-id', task.id);


    // Create the drag handle
    var dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.textContent = '='; // dragHandle.textContent = '';  Using the Unicode character for the drag handle icon
    taskItem.appendChild(dragHandle);
 

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    // Set the checkbox based on the completion status. Assuming '0' means not completed.
    checkbox.checked = task.completed === "1";
    checkbox.onchange = () => updateTaskCompletion(task.id, checkbox.checked);
    taskItem.appendChild(checkbox);

    // Original code snippet you provided
    var textNode = document.createTextNode(task.task_name);
    taskItem.appendChild(textNode);

    // Updated code with a new span for the task name
    var taskNameSpan = document.createElement('span'); // Create a new span element for the task name
    taskNameSpan.classList.add('task-name'); // Add a class to the span for styling
    taskNameSpan.appendChild(textNode); // Append the original text node to the span
    taskItem.appendChild(taskNameSpan); // Append the span to the task item


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
    toggleUnprioritizedDisplay(); // Call the function to toggle the display of the unprioritized tasks if necessary

}

function toggleUnprioritizedDisplay() {
    let unprioritizedTasks = document.getElementById('unprioritized-tasks');
    let unprioritizedTitle = document.getElementById('unprioritized-title'); // Get the header
    if (unprioritizedTasks) {
      let taskCount = unprioritizedTasks.getElementsByTagName('li').length;
      if (taskCount === 0) {
        unprioritizedTasks.style.display = 'none';
        if (unprioritizedTitle) unprioritizedTitle.style.display = 'none'; // Hide the header
      } else {
        unprioritizedTasks.style.display = '';
        if (unprioritizedTitle) unprioritizedTitle.style.display = ''; // Show the header
      }
    }
  }
  
  
