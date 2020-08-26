### SIMPLE FOOD ORDERING SYSTEM

This sample project is created to fulfill the technical test from Vertilogic. [DO NOT COPY AND PASTE THIS PROJECT!!!]

### Tech Stack

uses a number of open source libraries:

* [node.js]      - evented I/O for the backend
* [express.js]   - An open source framework for node.js
* [sequelize.js] - Sequelize is a promise-based ORM for Node.js v4 and up. It supports the dialects MySQL
* [mysql]        - database relational
* [sequelize]    - database migration and seeder
* [axios]        - for custom HTTP request

### Installation
This project requires [Node.js](https://nodejs.org/) v4+ to run.

```sh
$ cd simple_food_order
$ npm install
```
### Migration config

Before running the server you must set configuration first and run the database migration script. In folder `config\` there is a `config.json` file for database configuration. In `config.json` there are configurations for database table migration. Sequelize-cli is used to migration database. Set `username`, `password`, `database`, and `host` in development, test, or production section of the `config.json` file (it's only for sequelize-cli) according to your mysql configurations, `keep in mind that you need to create the database first!`. After that, set the `env` variable in "models/index.js" on line 7 to `development` or `test` or `production` according to the database configurations in config.json.

Make sure to do the steps above before running the migration script!

```shell
$ cd simple_food_order
$ node_modules/.bin/sequelize db:migrate  or sequelize db:migrate
$ node_modules/.bin/sequelize db:seed all or sequelize db:seed:all
```

### Run the server

```shell
$ cd simple_food_order
$ node index.js
```

### Api Endpoints
| Service method (Vendor)              | HTTP Method | Path      
| ---------------------------------    | ----------- | --------- 
| service('vendors').findAll()         | GET         | /vendors?tag=<desiredTag1>&tag=<desiredTag2>&name[$like]=%<vendorName>%&$skip=<desiredSkip>&$limit=<desiredLimit>
| service('vendors').findOne()         | GET         | /vendors/:vendorsId 
| service('vendors').insert()          | POST        | /vendors     
| service('vendors').update()          | PATCH       | /vendors/:vendorsId 
| service('vendors').deleteOne()       | DELETE      | /vendors/:vendorsId
Note: The endpoint findAll on /vendors can be customized, where you can query filtering such as skip and limit the contents for pagination, find contents based on tag and by vendor name.
      Above is just the example of the full url path, you can also exclude any filter as you want. For skip and limit when not provided, they are set to 0 and 10 as default.
      Below is a few examples:
      /vendors?tag=<desiredTag1>&tag=<desiredTag2>&$skip=<desiredSkip>&$limit=<desiredLimit> //find all vendors with provided tags
      /vendors?name[$like]=%<VendorName>% // find vendors by name with provided keyword. 
POST body { name: <name>, address: <address>, phone:<phone>, tag:<tag> } 

| Service method (Food)              | HTTP Method | Path      
| ---------------------------------  | ----------- | --------- 
| service('foods').findAll()         | GET         | /foods?vendorsId=<vendorId>&type=<foodType>&price=<integerValue>&name[$like]=%<foodName>%&$skip=<desiredSkip>&$limit=<desiredLimit>
| service('foods').findOne()         | GET         | /foods/:foodsId 
| service('foods').insert()          | POST        | /foods     
| service('foods').update()          | PATCH       | /foods/:foodsId 
| service('foods').deleteOne()       | DELETE      | /foods/:foodsId
Note: The endpoint findAll on /foods can be customized, where you can query filtering such as skip and limit the contents for pagination, find contents based vendorId, food type, food name, and 
      food price smaller than the provided value. Above is just the example of the full url path, you can also exclude any filter as you want.
      For skip and limit when not provided, they are set to 0 and 10 as default
      Below is a few examples:
      /foods?vendorsId=<vendorId> //find all foods with on a specific restaurants more than one
      /foods?vendorsId=<vendorId>&type=<foodType>&price=<integerValue> // find foods with specific vendor, type and prices lower than provided value
POST body { name: <name>, type: <type>, price:<price>, vendorId:<vendorsId> } 

| Service method (Order)              | HTTP Method | Path      
| ---------------------------------   | ----------- | --------- 
| service('orders').findAll()         | GET         | /orders?customerName[$like]=%<customerName>%&$skip=<desiredSkip>&$limit=<desiredLimit>
| service('orders').findOne()         | GET         | /orders/:ordersId 
| service('orders').insert()          | POST        | /orders     
| service('orders').update()          | PATCH       | /orders/:ordersId 
| service('orders').deleteOne()       | DELETE      | /orders/:ordersId
| service('orders').orderFood()       | PATCH       | /orders/food/assign/:ordersId
Note: For the orderFood endpoint on url :/orders/food/assign/:ordersId uses axios custom http request because we are handling array insert, you have to provide the foodId and use the format 
      in the folder test/assignFood.js, the elements inside the array is the id from table food.
      The endpoint findAll on /orders can be customized, where you can query filtering such as skip and limit the contents for pagination, find contents based on customerName 
      Above is just the example of the full url path, you can also exclude any filter as you want. For skip and limit when not provided, they are set to 0 and 10 as default
      Below is a few examples:
      /orders?customerName[$like]=%<customerName>%
POST body { customerName: <customerName>, phone: <phone>, additionalRequest: <additionalRequest> }