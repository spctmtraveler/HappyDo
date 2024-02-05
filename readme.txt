Everytime you come back to this, you need to restart the PHP and MySQL servers by running XAMPP.
Open the Terminal and copy/paste into it

The app is running at:

http://localhost/HappyDo/public/





####DB commands:####

USE XAMPP MySQL Admin to get PHPMyAdmin to manage the DB


USE happydo;

SHOW TABLES;

SELECT * FROM tasks;

SELECT * FROM tasks WHERE id = 5;


####################

CODEBASE PDF CREATOR SCRIPT:

Run this from the root directory. (The first line is to give permission)

chmod +x createPDF.sh   

./createPDF.sh


