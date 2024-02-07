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

    public function getTasks($filterType = 'today') {
            if ($filterType === 'today') {
                $query = 'SELECT * FROM ' . $this->table . ' WHERE completed = 0 AND (backlog IS NULL OR backlog = 0)';
            } elseif ($filterType === 'back') {
                $query = 'SELECT * FROM ' . $this->table . ' WHERE completed = 0 AND backlog IS NOT NULL AND backlog != 0';
            } else {
                $query = 'SELECT * FROM ' . $this->table . ' WHERE completed = 0 AND (backlog IS NULL OR backlog = 0)';
            } //default is the same as today


    
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
                // Directly use $row, as it already contains all the fields
                array_push($tasks_arr['data'], $row);
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
            // Wrap the task data in an array structure similar to getTasks(), even though there is only 1 task in it. This allows us to parse the data in the same way on the frontend.
            $task_arr = array(
                'data' => $row  // Single task data
            );
            echo json_encode($task_arr);  // Output the structured array as JSON
        } else {
            // No Task
            echo json_encode(['message' => 'No Task Found']);
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

    public function updateTaskPriority($id, $priority) {
        $query = "UPDATE " . $this->table . " SET priority = :priority WHERE id = :id";
    
        $stmt = $this->conn->prepare($query);
    
        // Clean the data
        $priority = htmlspecialchars(strip_tags($priority));
        $id = htmlspecialchars(strip_tags($id));
    
        // Bind the data
        $stmt->bindParam(':priority', $priority);
        $stmt->bindParam(':id', $id);
    
        // Attempt to execute
        if($stmt->execute()) {
            return true;
        }
    
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function updateTaskBacklog($id, $backlog) {
        $query = "UPDATE " . $this->table . " SET backlog = :backlog WHERE id = :id";
    
        $stmt = $this->conn->prepare($query);
    
        // Clean the data
        $backlog = htmlspecialchars(strip_tags($backlog));
        $id = htmlspecialchars(strip_tags($id));
    
        // Bind the data
        $stmt->bindParam(':backlog', $backlog);
        $stmt->bindParam(':id', $id);
    
        // Attempt to execute
        if($stmt->execute()) {
            return true;
        }
    
        printf("Error: %s.\n", $stmt->error);
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