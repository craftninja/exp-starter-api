# curl docs

### Welcome
* `curl http://localhost:3000/`

### Sign up
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "birthYear": "2015", "student": "true"}' http://localhost:3000/users`

### login
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' http://localhost:3000/login`

### Users
##### index
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3000/users`

##### show
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3000/users/<ANY VALID USER ID>`

##### udpate
* `curl -X PUT -H "jwt: <YOUR JWT TOKEN>" -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Freyja", "lastName": "Platzer Bartel", "birthYear": "2016", "student": "false"}' http://localhost:3000/users/<YOUR USER ID>`
