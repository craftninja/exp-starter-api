# curl docs

### Welcome
* `curl http://localhost:3001/`
* `curl https://exp-starter-api.herokuapp.com/`

### Sign up
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "birthYear": "2015", "student": "true"}' http://localhost:3001/users`
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "birthYear": "2015", "student": "true"}' https://exp-starter-api.herokuapp.com/users`

### login
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' http://localhost:3001/login`
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' https://exp-starter-api.herokuapp.com/login`

### Users
##### index
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users`
* `curl -H "jwt: <YOUR JWT TOKEN>" https://exp-starter-api.herokuapp.com/users`

##### show
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users/<ANY VALID USER ID>`
* `curl -H "jwt: <YOUR JWT TOKEN>" https://exp-starter-api.herokuapp.com/users/<ANY VALID USER ID>`

##### update
This is a patch type update, so just send the stuff that is different!

* `curl -X PUT -H "jwt: <YOUR JWT TOKEN>" -H "Content-Type: application/json" -d '{"email":"freyja@example.com", "password": "password", "firstName": "Freyja", "lastName": "Platzer Bartel", "birthYear": "2016", "student": "false"}' http://localhost:3001/users/<YOUR USER ID>`
* `curl -X PUT -H "jwt: <YOUR JWT TOKEN>" -H "Content-Type: application/json" -d '{"email":"freyja@example.com", "password": "password", "firstName": "Freyja", "lastName": "Platzer Bartel", "birthYear": "2016", "student": "false"}' https://exp-starter-api.herokuapp.com/users/<YOUR USER ID>`

##### me
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users/me`
* `curl -H "jwt: <YOUR JWT TOKEN>" https://exp-starter-api.herokuapp.com/users/users/me`
