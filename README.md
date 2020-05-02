# AdminServer

_This is backend for create VirutalHost in apache, user of database and schema (db). Create user with privileges only home and posibility to create multiple users of emails._

## Starter 🚀

_For this starter you need clone this proyect. For example:_
```
git clone https://github.com/DavielSA/AdminServer.git
```

### Pre-Requirement 📋

_What do you need to install and run this proyect?_
* nodejs >= v8.10.0 
* npm.  
* MySQL >= v14.14.
_Now, you can restore the file .sql store in folder mysql/database.sql. This file constains all table structure and admin user by default._
```
user: admin@dhmaker.es
pass: km25Ds29o1
```

### Install 🔧

_Before you can install all package registered in package.json for npm with nex command:_
```
npm i //or long command.. npm install
```

## Run tst ⚙️

_Only for test you can run npm start_

### Testing 🔩

_In this moment not development any test, but in future we add the test, and for run all you can execute the next command:_

```
npm test
```

## Run in background ⚙️
_For run with background service you create a folder for logs run this. (in my case the folder of log is */home/dhmaker/log/* _
```
nohup npm start > /home/dhmaker/log/api.log 2>&1 &
```

## Deployment 📦

_For deployment you can install forever. This utility install and configure one service to watch app crash exception for stop and start automaticaly._
_How to install forever in [HowTo](https://www.npmjs.com/package/forever)_

## Build by 🛠️

_The technology used in this proyect:_

* @types/bcryptjs version ^2.4.2,
* @types/jsonwebtoken version ^8.3.8,
* @types/mongodb version ^3.5.2,
* @types/ws version ^7.2.2,
* bcryptjs version ^2.4.3,
* body-parser version ^1.19.0,
* cors version ^2.8.5,
* express version ^4.17.1,
* jsonwebtoken version  ^8.5.1,
* mongodb version ^3.5.4,
* ts-node version ^8.6.2
* @babel/cli version ^7.8.4,
* @babel/core version ^7.8.7,
* @babel/node version ^7.8.7,
* @babel/preset-env version ^7.8.7,
* @types/body-parser version ^1.19.0,
* @types/cors version ^2.8.6,
* @types/express version ^4.17.3,
* @types/jest version ^25.1.4,
* @types/request version ^2.48.4,
* @types/supertest version ^2.0.8,
* jest version ^25.2.4,
* supertest version ^4.0.2,
* ts-jest version ^25.3.0,
* tslint version ^6.0.0,
* typescript version ^3.8.3

## Contributor 🖇️

Daily Miranda Pardo [dailymp](https://github.com/dailymp/)

## Wiki 📖

You can find more for how to use this proyect in we [Wiki](url sin definir)

## Version 0.1 📌

undefined


## Authors ✒️

_Thanks for all_

* **Daviel Sánchez Almeida** - *Starter Work* - [dsa](https://github.com/DavielSA)
* **Daily Miranda Pardo** - *Documentation and fixing translate* - [dailymp](https://github.com/dailymp/)


## Licence 📄

This project is under licence by GNU GENERAL PUBLIC LICENSE - see the file [LICENSE.md](LICENSE.md) for more details.

---
⌨️ with ❤️ by [dsa](https://github.com/DavielSA) 😊
