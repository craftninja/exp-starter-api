# curl docs

### Welcome
* `curl http://localhost:3000/`

### Sign up
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "birthYear": "2015", "student": "true"}' http://localhost:3000/users`

### login
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' http://localhost:3000/login`
