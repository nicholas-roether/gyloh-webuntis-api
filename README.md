# Gyloh WebUntis API

This API let's you access the WebUntis data (substitutions, cancellations, and the such) for the Gymnasium Lohbrügge in Hamburg.
It's honestly so specific that I don't even know why I'm writing this readme in english.


## Getting Tables

Getting `TimeTable`s is done via one of three methods:
- `GylohWebUntis.getCurrentTables(num)`, which gets currently relevant tables, starting either today or on the next day of school, and getting `num` tables in total. The default for `num` is 2.
- `GylohWebUntis.getTable(day)`, which gets a table for an arbitrary `day`, which is either a `Date` object or a timestamp. It will return `null` if no table is available for that day.

```js
const { GylohWebUntis } = require("gyloh-webuntis-api");

// I'll be using async/await for readability; obviously this code would need to be inside an asynchronous function

// Get three currently relevant tables.
const todaysTable = await GylohWebUntis.getCurrentTables(3);

// Getting the tables for the 9th of june 2018 (if it exists)
const arbitraryTable = await GylohWebUntis.getTable(Date.parse("2018-06-09"));
```

## Extracting Information

### The TimeTable Object

The `TimeTable` object contains all the information about the given day that this API provides. While it is probably best to explore all of it's and it's decendants' fields in on one's own using the IDE, I will outline some of the most useful things here.

```js
const table = (await GylohWebUntis.getCurrentTables(1))[0];

table.entries; // All the entries in this table
table.affectedClasses; // for which classes or profiles this table carries entries
table.messages; // Messages concerning all students for this day
```

### The Entry Object

Entries represent one change (cancellation, substitution, ...) that takes place on a certain day.

```js
const entry = table.entries[0];

entry.lesson; // A string showing which lesson this entry affects (example: "2 - 3")
entry.classes; // An array of classes that this entry affects
entry.subject; // The subject that is (or is normally) being taught during these lessons
entry.rooms; // In which rooms these lessons occur. Usually just one unless the class or course is split up
entry.info; // A short info text about the nature of this entry
entry.message; // A message from the teacher
```