# Groupomania
Project 7 of the OC formation | Build a social network

## Features

* Authentication 
    - Authentication management via JWT (JSON Web Token)
    - Login page and Register page
* Users can 
    - View all posts
    - Post images and/or text
    - Edit their profile (avatar, name)
    - Change their password
    - Delete their account 
    - See the list of all users
    - Add comments to all posts with image or text
* Like system
    - Only the like is authorized (to avoid dislike bashing)
* Posts and comments are editables and can be deleted only by the owner
* Moderation by administrators who can 
    - Modify or remove every posts and comments
    - Add more categories for the posts
* Addition features :
    - Dark mode
    - Posts are filterable by category
    - Scroll Infinite for posts and pagination system for comments
 

## API
API Documentation is available here : https://documenter.getpostman.com/view/19793435/UzBmM7C3#fbe8b4fd-1636-420e-ab80-326a3ca87b59

## 🔨 Technologies 

* Frontend 
    - Framework **Angular**
    - **SCSS**

* Backend
    - Serveur **Node.JS** and Framework **Express**
    - Packages: Multer, JsonWebTokens, uuid, helmet, nodemon, dotenv, keyv & bcryp
    - Database **MYSQL**



## 🏗️ Installation


- Clone this project from Github
- Make sur you have Node.js and Angular installed.
    ### Prepare the MySQL database 
    
    1. Se connecter à MySQL
    
    ```
    mysql -u root -p # root is your user name, then enter your password
    ```
    
    2. In MySQL


    ``` 
    --1: Create new base
    CREATE DATABASE social_network CHARACTER SET 'utf8'  
    ```
    
    3. Add tables in the new database with the file BDD.sql

    ```
    SOURCE docs/social_network.sql 
    use the correct path
    ```
    
    
    ### 🔍 Frontend
    
This project was generated with Angular CLI version 13.3.5.

- `cd ./Frontend`
- `npm install`
- Run `ng serve` for a dev server. Navigate to http://localhost:4200/ . The app will automatically reload if you change any of the source files.

    ### 🔍 Backend
This project was generated with NodeJs v16.14.0

- `cd ./Backend`

#### 🚧 In dev mode :
        
- `npm install`
- `npm start`
you will access to more packages (morgan, morganBody)

#### 🚀 In product mode :
        
- `npm install --only=prod`
- `npm run start:prod #`
With nodemon the app will automatically reload if you change any of the source file.

After npm is done installing, set any environment variables in a .env file (in the folder Backend) , with this key :

```
# Database
DATABASE_HOST = xxx
DATABASE_USER = xxx
DATABASE_PASSWORD = xxx
DATABASE_PORT = xxx
DATABASE_NAME = xxx

# Random secret token
JWT_KEY= xxx

# To configure module Keyv use your mysql login (to support blackList Token)
KEY_PARAM = user:pass@localhost:3306/dbname
```

