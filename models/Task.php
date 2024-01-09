<?php

//error_reporting(0); // Turn off all error reporting; use only for debugging


class Task {
    private $conn;
    private $table = 'tasks';

    public $id;
    public $task_name;
    public $completed;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTasks() {

// Query only incomplete tasks
$query = 'SELECT * FROM ' . $this->table . ' WHERE completed = 0';
    
        // Prepare statement
        $stmt = $this->conn->prepare($query);
    
        // Execute query
        $stmt->execute();
    
        $num = $stmt->rowCount();
    
        // Check if any tasks
        if($num > 0) {
            // Tasks array
            $tasks_arr = array();
            $tasks_arr['data'] = array();
    
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
    
                $task_item = array(
                    'id' => $id,
                    'task_name' => $task_name,
                    'completed' => $completed,
                );
    
                // Push to "data"
                array_push($tasks_arr['data'], $task_item);
            }
    
            // Turn to JSON & output
            echo json_encode($tasks_arr);
    
        } else {
            // No Tasks
            echo json_encode(['message' => 'No Tasks Found']);
        }
    }

    public function getTask($id) {
        // Create query
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = ? LIMIT 0,1';
    
        // Prepare statement
        $stmt = $this->conn->prepare($query);
    
        // Bind ID
        $stmt->bindParam(1, $id);
    
        // Execute query
        $stmt->execute();
    
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // Check if any task
        if($row) {
            $task_item = array(
                'id' => $id,
                'task_name' => $row['task_name'],
                'completed' => $row['completed'],
            );
    
            // Turn to JSON & output
            echo json_encode($task_item);
    
        } else {
            // No Task
            echo json_encode(
                array('message' => 'No Task Found')
            );
        }
    }

    public function createTask() {
        $query = 'INSERT INTO ' . $this->table . ' SET task_name = :task_name, completed = 0';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_name', $this->task_name);
        
        // Execute the query and check if the insert was successful
        if($stmt->execute()) {
            return ['success' => true, 'message' => 'Task created successfully'];
        } else {
            return ['success' => false, 'message' => 'Task creation failed', 'error' => $stmt->errorInfo()];
        }
    }
    

    public function updateTask($id) {
        $query = 'UPDATE ' . $this->table . ' SET task_name = :task_name, completed = :completed WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_name', $this->task_name);
        $stmt->bindParam(':completed', $this->completed);
        $stmt->bindParam(':id', $id);
        if($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function updateTaskCompletion($id, $completed) {
        $query = 'UPDATE ' . $this->table . ' SET completed = :completed WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':completed', $completed, PDO::PARAM_BOOL);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteTask($id) {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        if($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}