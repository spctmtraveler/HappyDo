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
        // If an id is defined, get a single task. Otherwise, get all tasks.
        if(!empty($_GET["id"])) {
            $id = intval($_GET["id"]);
            $task->getTask($id);
        } else {
            $task->getTasks();
        }
        break;

        case 'PUT':
            // Handle PUT request for updating task completion
            $data = json_decode(file_get_contents("php://input"));
            $id = $data->id ?? null;
            $completed = $data->completed ?? null;
        
            if (isset($id, $completed)) {
                $result = $task->updateTaskCompletion($id, $completed);
                echo json_encode(['success' => $result]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Missing task ID or completion status']);
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
            
            
            

    case 'PUT':
        // Update a task
        $id=intval($_GET["id"]);
        $task->updateTask($id);
        break;

    case 'DELETE':
            // Delete a task
            $id=intval($_GET["id"]);
            $task->deleteTask($id);
            break;

    default:
            // Invalid request method
            header("HTTP/1.0 405 Method Not Allowed");
            break;

}

exit;