# curl docs

### Welcome
* `curl http://localhost:3000/`

### Sign up
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "birthYear": "2015", "student": "true"}' http://localhost:3000/users`

### login
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' http://localhost:3000/login`

### Users
##### index
* `curl -H "jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdE5hbWUiOiJFbG93eW4iLCJsYXN0TmFtZSI6IlBsYXR6ZXIgQmFydGVsIiwiZW1haWwiOiJlbG93eW5AZXhhbXBsZS5jb20iLCJiaXJ0aFllYXIiOjIwMTUsInN0dWRlbnQiOnRydWV9LCJpYXQiOjE1MDY0NjEwMjB9.1OFoBYzbeNPiR_KUdnVMRvQtgswqjm_xMj1UyowtLV8" http://localhost:3000/users`
