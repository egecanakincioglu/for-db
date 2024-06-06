# ForDB Readable Database Module

## What is ForDB?

ForDB is a human-readable database module designed for use with Node.js applications. One of its standout features is the ability to store data in either JSON-DB or YAML-DB formats. Unlike many other Node.js modules, ForDB allows you to manually edit and view the database content. You can access or create databases from any location, making it highly flexible for various use cases.

## How Does ForDB Work?

When you use the ForDB module, it creates a dedicated database and continuously checks and updates it with the data you process. ForDB is compatible with any Node.js project, provided the Node.js version is 12 or higher.

You can configure ForDB to stop recording data when the database reaches a certain point. If needed, you can clear the JSON or YAML file and continue using the database.

### Note:
This behavior applies only when you specifically configure the database to stop recording data. In all other cases, ForDB will continue to store data indefinitely.

## What Can You Do with ForDB?

- Delete data
- Add data
- Check if data exists
- Retrieve all data
- Create databases in custom locations
- Access databases from any point within your project
- Choose between YAML or JSON formats
- Use mathematical methods with the database
- Utilize finding methods (`e.g., .includes | .startsWith`)
- Completely destroy the database
- View data types

## ForDB Installation

No additional setup is required to use ForDB. Simply install it in your project and start using it.

```bash
npm install for.db
```

## Usage Examples

Below are examples of how to use the ForDB module:

### Database Setup

```js
const {
    JsonDatabase,
    YamlDatabase
} = require("for.db");

const db = new JsonDatabase({
  databasePath: "./databases/myJsonDatabase.json"
});

const yamlDB = new YamlDatabase({
  databasePath: "./databases/myYamlDatabase.yml"
});
```

### Adding and Retrieving Data

```js
// Data set | get

db.set("test", 1);
db.get("test");
db.fetch("test");
```

### Checking for Existing Data

```js
// Data exists

db.has("test");
db.exists("test");
```

### Retrieving All Data

```js
// Get all data

db.all(5); // Fetch the first 5 entries
db.all();  // Fetch all entries
db.fetchAll(5); // Fetch the first 5 entries
db.fetchAll();  // Fetch all entries
```

### Converting to JSON

```js
// To JSON

db.toJson(5); // Convert the first 5 entries to JSON
db.toJson();  // Convert all entries to JSON
```

### Deleting Data

```js
// Delete data

db.delete("test");
db.deleteAll();
db.findAndDelete((element, db) => {
    return element.ID.includes("test");
});
```

### Getting Data Type

```js
// Get data type

db.type("test"); // ---> number
```

### Database Array Methods

```js
// DB Array methods

db.push("testArray", 10);
db.pull("testArray", (element, index, array) => element < 10, true); // Multiple options = true (default is false)
db.valueArray(); // Get array of values
db.keyArray();   // Get array of keys
```

### Database Math Methods

```js
// DB Math methods

db.math("test", "*", 3); // Multiply the value by 3
db.add("test", 10);      // Add 10 to the value
db.substr("test", 5);    // Subtract 5 from the value
```

### Database Finding Methods

```js
// DB Finding methods

db.includes("tes");    // Check if any key includes "tes"
db.startsWith("t");    // Check if any key starts with "t"
```

### Information

```js
// Infos

console.log(db.size); // Log the size of the database
console.log(db.info); // Log the database info
```

### Destroying the Database

```js
// Destroy DB

db.destroy(); // Completely destroy the database
```

By following this guide, you can effectively utilize ForDB in your Node.js projects, taking advantage of its readability and flexibility.

---

<p align="center">Developed by Cartel & Papaz Chavo</p>