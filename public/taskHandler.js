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

// In taskHandler.js or script.js, depending on where you prefer to keep your task-related functions

function displayTasks(tasks) {
  console.log('Displaying tasks:', tasks);
  // Clear existing tasks first
  var taskLists = ['unprioritized-tasks', 'list-a-tasks', 'list-b-tasks', 'list-c-tasks'];
  taskLists.forEach(function(listId) {
      document.getElementById(listId).innerHTML = '';
  });

  // Ensure tasks is always an array to simplify processing
  if (!Array.isArray(tasks)) {
      tasks = [tasks]; // Convert single task object to an array for uniform processing
  }

  // Iterate over the tasks and display each one in the appropriate list
  tasks.forEach(task => {
      var taskElement = createTaskElement(task); // Use the existing function to create the task element
      var taskListId = 'unprioritized-tasks'; // Default list

      // Determine the correct list based on task attributes
      if (task.priority) {
          switch(task.priority.toUpperCase()) {
              case 'A': taskListId = 'list-a-tasks'; break;
              case 'B': taskListId = 'list-b-tasks'; break;
              case 'C': taskListId = 'list-c-tasks'; break;
              default: taskListId = 'unprioritized-tasks'; // Fallback to default list
          }
      }

      // Append the task element to the determined list
      document.getElementById(taskListId).appendChild(taskElement);
  });
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
      console.log('toggleUnprioritizedDisplay called. Tasks = ', { taskCount });
      if (taskCount === 0) {
        unprioritizedTasks.style.display = 'none';
        if (unprioritizedTitle) unprioritizedTitle.style.display = 'none'; // Hide the header
      } else {
        unprioritizedTasks.style.display = '';
        if (unprioritizedTitle) unprioritizedTitle.style.display = ''; // Show the header
      }
    }
  }
  
  
