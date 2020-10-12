# phoneBookServer
This project is an application for a phoneBook. Developed with Express and mongoDB

## Commands
- Use `npm run dev` for testing with nodemon

# API Documentation

## [POST] /users (Create user)

### Headers
|Parameter| Value |
|---|---|
|Content-Type|application/json|

### Request parameters
#### Body example
```
{
	"name": "Sebastián Pérez",
	"email": "sebastian@peretch.com",
	"password": "myPassword@321"
}
```
#### Parameters
|Parameter| Type | Description |
|---|---|---|
|name|string|Name for the new user|
|email|string|Email for the new user|
|password|string|Password for the new user|


### Response example
```
{
    "user": {
        "_id": "5f845c73a3b88bbac6651736",
        "name": "Sebastián Pérez",
        "email": "sebastian@peretch.com",
        "password": "$2b$10$WEE1eHLlDkMVg4dLT7AzruU1dxAx8Vi8xiVWQJI1lwhNUbsmbQzka",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDI1MDk5Mzl9.7tyaJT_mMgAzaCF8KYXeT6mG5iMaqT1kRn3l9UWrBDM"
}
```

## [POST] /sessions (Login)

### Headers
|Parameter| Value |
|---|---|
|Content-Type|application/json|

### Request parameters
#### Body example
```
{
	"email": "sebastian@peretch.com",
	"password": "myPassword@321"
}
```

#### Parameters
|Parameter| Type | Description |
|---|---|---|
|email|string|Username for ogin|
|password|string|Password for login|

### Response example
```
{
    "user": "sebastian@peretch.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlYmFzdGlhbkBwZXJldGNoLmNvbSIsImlhdCI6MTYwMjUwOTI0OH0.0yI2rySNfwX_GifY35sriyO90UCcBikoGG0ebwdLWqs"
}
```