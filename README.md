# Phonebook Server
This project is an application for a phoneBook. Developed with Express and mongoDB.


## Requisites
- mongodb installed in your server
- config your parameters in .env file (You can use `.env.example` file as a template)

## Commands
- Use `npm run dev` for testing with nodemon (by default it will run in port 8080).

# API Documentation

## Headers
All request must have same headers

|Parameter| Value |
|---|---|
|Content-Type|application/json|

---
## [POST] /users (Create user)

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

---
## [POST] /sessions (Login)

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


---
## [POST] /users/recovery (Recovery password)


### Request parameters
#### Body example
```
{
	"email": "sebastian@peretch.com"
}
```
#### Parameters
|Parameter| Type | Description |
|---|---|---|
|email|string|Email from account|


### Response example
```
{
  "ok": true
}
```
_A mail should be sended if credentials are setted._


---
## [GET] /contacts (List of contacts)

### Request parameters

#### URL Parameters
|Parameter| Type | Description |
|---|---|---|
|name|string|Use for filtering by name|
|lastname|string|Use for filtering by lastname|
|email|string|Use for filtering by email|


### Response example
```
[
  {
      "_id": "5f8778a24a47171c55b62b34",
      "user": "5f84a77822e3877ebafe5458",
      "name": "Carlos",
      "lastname": "Bueno",
      "phone": "+59899512414",
      "createdAt": "2020-10-14T22:16:02.374Z",
      "updatedAt": "2020-10-14T22:16:02.374Z",
      "__v": 0
  },
  {
      "_id": "5f8778ac4a47171c55b62b35",
      "user": "5f84a77822e3877ebafe5458",
      "name": "Lucas",
      "lastname": "Podolsky",
      "phone": "+496568123123",
      "createdAt": "2020-10-14T22:16:12.861Z",
      "updatedAt": "2020-10-14T22:16:12.861Z",
      "__v": 0
  },
]
```
---
## [POST] /contacts (Create contact)

### Request parameters
#### Body example
```
{
	"name": "Chuck",
	"lastname": "Norris",
	"phone": "+165153168856"
}
```
#### Parameters
|Parameter| Type | Description |
|---|---|---|
|name|string|Name for the new contact|
|lastname|string|Lastname for the new contact|
|phone|string|Phone for the new contact|


### Response example
```
{
  "_id": "5f877c694a47171c55b62b37",
  "user": "5f84a77822e3877ebafe5458",
  "name": "Chuck",
  "lastname": "Norris",
  "phone": "+165153168856",
  "createdAt": "2020-10-14T22:32:09.551Z",
  "updatedAt": "2020-10-14T22:32:09.551Z",
  "__v": 0
}
```
---
## [DELETE] /contacts/:contactId (Delete contact)

### Request parameters
#### Body example

#### Parameters
|Parameter| Type | Description |
|---|---|---|
|contactId|string|contact _id|

### Response example
```
{}
```
---