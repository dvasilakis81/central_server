UPDATE pages
SET Body = REPLACE(Body, 'http://localhost:3007/', 'http://localhost:3000/')
WHERE Body LIKE ('%http://localhost:3007/%');