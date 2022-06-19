# Groupomania
Project 7 of the OC formation | Build a social network

## Features



API Documentation is available here : 

🏗️ Installation
Clone this project from Github
Make sur you have Node.js installed.
🔍 Frontend
This project was generated with Angular CLI version 13.2.4.

cd ./FrontEnd
npm install
Run npm start for a dev server. Navigate to http://localhost:4200/ . The app will automatically reload if you change any of the source files.
🔍 Backend
This project was generated with NodeJs v16.14.0

cd ./BackEnd
🚧 In dev mode :
npm install
npm start
you will access to more packages (morgan, morganBody)
🚀 In product mode :
npm install --only=prod
npm run start:prod #
With nodemon the app will automatically reload if you change any of the source file.

After npm is done installing, set any environment variables in a .env file (in the folder BackEnd) , with this key :
```
# Port Use
PORT= xxx

# MongoDB client
MONGO_SECURE_URI = mongodb+srv://<user>:<password>@cluster0.csny7.mongodb.net/<nameDatabase>?retryWrites=true&w=majority

# Random secret token
JWT_KEY= xxx
```
🔨 Technology


Node.JS / Express / MongoDB
Packages: Multer, JsonWebTokens, uniqueValidator, uuid, helmet, nodemon, dotenv & bcryp
