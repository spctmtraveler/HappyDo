Everytime you come back to this, you need to restart the PHP and MySQL servers.
Open the Terminal and copy/paste into it: docker-compose up -d

docker-compose up -d

A toast should pop up to open the webpage, but you can also go here: https://literate-space-broccoli-qwvgjg9gq4vh449p-8000.app.github.dev/

####How to access the DB from Terminal:####

docker exec -it 05f6c11a0c69 mysql -u user -ppassword happydo

Except that number needs to be changed, probably:

docker exec -it <container_id_or_name> mysql -u user -ppassword happydo

Replace <container_id_or_name> with the actual container ID or name.
To get the container ID for the db service, you can use the docker ps command, which lists all running containers. 

USE happydo;

SHOW TABLES;

SELECT * FROM tasks;

SELECT * FROM tasks WHERE id = 5;


####################



