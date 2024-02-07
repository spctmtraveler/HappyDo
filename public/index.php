<?php

ob_start();
//error_reporting(0); // Turn off all error reporting

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/Database.php';
include_once '../models/Task.php';

$database = new Database();
$db = $database->connect();
$task = new Task($db);
$request_method = $_SERVER["REQUEST_METHOD"];
$response = [];

switch($request_method)
{
    case 'GET':

        //Check which filter type was requested
        if(isset($_GET["filter"])) {
            $filterType = $_GET["filter"];
            $task->getTasks($filterType);
            break;
        }

        // If an id is defined, get a single task. Otherwise, get all tasks.
        if(!empty($_GET["id"])) {
            $id = intval($_GET["id"]);
            $task->getTask($id);
        } else {
            $task->getTasks();
        }
        break;

    case 'PUT':
        // Handle PUT request for updating task completion, updating a task, or updating task priority
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? null;
        $completed = $data->completed ?? null;
        $priority = $data->priority ?? null; // New priority field
        $backlog = $data->backlog ?? null; // New backlog field

    
        error_log("Received data: ID: $id, Completed: $completed, Priority: $priority");
    
        if (isset($id, $completed)) {
            $result = $task->updateTaskCompletion($id, $completed);
            echo json_encode(['success' => $result]);
        } elseif (isset($id, $priority)) {
            // Update task priority
            error_log("Attempting to update priority for task ID $id with priority $priority");
            $result = $task->updateTaskPriority($id, $priority);
            if ($result) {
                error_log("Priority update successful for task ID $id");
            } else {
                error_log("Priority update failed for task ID $id");
            }
            echo json_encode(['success' => $result]);

        } elseif (!empty($_GET["id"])) {

            $id = intval($_GET["id"]);
            $task->updateTask($id);

        } elseif (isset($id, $backlog)) {
            // Update task backlog
            error_log("Attempting to update backlog for task ID $id with backlog $backlog");
            $result = $task->updateTaskBacklog($id, $backlog);
        
            if ($result) {
                error_log("Backlog update successful for task ID $id");
            } else {
                error_log("Backlog update failed for task ID $id");
            }
        
            echo json_encode(['success' => $result]);
        } else {
        echo json_encode(['success' => false, 'message' => 'Missing task ID, completion status, or priority']);
        }
        break;
        

    case 'POST':
        // Decode JSON from the request body
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->task)) {
            $task->task_name = $data->task;
            $response = $task->createTask();
            echo json_encode($response);
        } else {
            echo json_encode(['success' => false, 'message' => 'Task name is required']);
        }
        break;

        case 'DELETE':
            // Delete a task
            $id = intval($_GET["id"]);
            $result = $task->deleteTask($id);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete task']);
            }
            break;
        

    default:
        // Invalid request method
        header("HTTP/1.0 405 Method Not Allowed");
        break;

}

exit;