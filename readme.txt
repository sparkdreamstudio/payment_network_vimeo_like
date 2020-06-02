environemnt: mysql 8.0 or above and node.js 4.0 or above
0. inintiate the mysql database with './project.sql'
1. run 'npm install' at the root folder of project
2. run 'npm install' at './client' folder
3. config the mysql information at in file './mysql.js'
4. query "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword';FLUSH PRIVILEGES;" in mysql
5. start server with 'PORT=3001 node bin/www'(mac&linux) 'set port=3001&&node ./bin/www'(windows) at the root folder of project in cmd
6. start webpage service with 'npm start' at './client' folder
7. open homepage 'http://localhost:3000/'