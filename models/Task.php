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

        $query = '';
        $todayDate = date('Y-m-d');
        $tomorrowDate = date('Y-m-d', strtotime('+1 day'));
        $nextWeekStartDate = date('Y-m-d', strtotime('next Monday'));
        $nextWeekEndDate = date('Y-m-d', strtotime('next Monday +6 days'));
        $thisWeekStartDate = date('Y-m-d');
        $thisWeekEndDate = date('Y-m-d', strtotime('this Sunday'));
        $thisMonthStartDate = date('Y-m-01'); // First day of this month
        $thisMonthEndDate = date('Y-m-t'); // Last day of this month
        $nextMonthStartDate = date('Y-m-d', strtotime('first day of next month'));
        $nextMonthEndDate = date('Y-m-d', strtotime('last day of next month'));
    
        switch ($filterType) {
            case 'today':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit = '{$todayDate}'";
                break;
            case 'tomorrow':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit = '{$tomorrowDate}'";
                break;
            case 'nextWeek':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit BETWEEN '{$nextWeekStartDate}' AND '{$nextWeekEndDate}'";
                break;
            case 'thisWeek':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit BETWEEN '{$thisWeekStartDate}' AND '{$thisWeekEndDate}'";
                break;
            case 'thisMonth':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit BETWEEN '{$thisMonthStartDate}' AND '{$thisMonthEndDate}'";
                break;
            case 'nextMonth':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit BETWEEN '{$nextMonthStartDate}' AND '{$nextMonthEndDate}'";
                break;
            case 'back':
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND backlog IS NOT NULL AND backlog != 0";
                break;
            default:
                // If no filter is set or if it's not recognized, default to showing today's tasks
                $query = "SELECT * FROM " . $this->table . " WHERE completed = 0 AND revisit = '{$todayDate}'";
                break;
        }

        
    
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

    public function createTask() {
        $query = 'INSERT INTO ' . $this->table . ' SET task_name = :task_name, completed = 0';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_name', $this->task_name);

// Output debug message
    error_log("In createTask()"); // Write the message to the error log;

    // Validate Input (important for security and preventing unexpected errors)
        
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

    public function updateTaskReviewDate($taskId, $newReviewDate) {
        // Cast task ID to an integer
        $taskId = (int)$taskId;
    
        // Validate Input (important for security and preventing unexpected errors)
        if (!is_int($taskId)) {
            error_log("Invalid task ID in updateTaskReviewDate(): " . $taskId);
            return false; // Indicate an invalid task ID
        }
    
        // Date Format Check (Basic)
        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $newReviewDate)) {
            error_log("Invalid date format in updateTaskReviewDate(): " . $newReviewDate);
            return false; // Indicate an invalid date format
        }

        // SQL Update Command 
        $query = "UPDATE " . $this->table . " SET revisit = :revisit WHERE id = :id";

        error_log("updateTaskReviewDate() called with taskId: ". $taskId. " and newReviewDate: ". $newReviewDate. " and query: ". $query);
    
        // Prepare the statement
        $stmt = $this->conn->prepare($query);
    
        // Bind parameters for security
        $stmt->bindValue(':revisit', $newReviewDate, PDO::PARAM_STR);  // Treat revisit as a string
        $stmt->bindValue(':id', $taskId, PDO::PARAM_INT); 
    
        // Execute the query and check if it was successful
        try {
            if ($stmt->execute()) {
                return true;  
            } else {
                $errorInfo = $stmt->errorInfo();
                error_log("Error updating review date: " . $errorInfo[2]);
                return false; 
            }
        } catch (PDOException $e) {
            error_log("PDOException on update: " . $e->getMessage());
            return false;
        }

    }
    

    public function updateTaskCompletion($id, $completed) {
        if (!is_int($taskId)) {
            return false; // Indicate an invalid task ID
        }
    
        if (!is_bool($completed)) {
            return false; // Indicate an invalid completion status
        }
        $query = 'UPDATE ' . $this->table . ' SET completed = :completed WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':completed', $completed, PDO::PARAM_BOOL);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
        return $stmt->execute();
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