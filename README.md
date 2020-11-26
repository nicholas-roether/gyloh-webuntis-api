# Gyloh WebUntis API

This API let's you access the WebUntis data (substitutions, cancellations, and the such) for the Gymnasium Lohbrügge in Hamburg.
It's honestly so specific that I don't even know why I'm writing this readme in english.


## Getting Plans

Getting plan objects (`SubstitutionPlan`) is done via one of three methods:
- `GylohWebUntis.getTodaysPlan()`
- `GylohWebUntis.getTomorrowsPlan()`
- `GylohWebUntis.getPlan(date)`, where date is a `Date` object or a timestamp corresponding to an arbitrary day for which to get the plan.

Please note that while the latter function can be called for any arbitrary day, there is no guarantee that a plan actually exists for that day. If it doesn't, a `GylohWebUntisPlanNotFoundError` will be throw.

```js
const { GylohWebUntis } = require("gyloh-webuntis-api");

// I'll be using async/await for readability; obviously this code would need to be inside an asynchronous function

const todaysPlan = await GylohWebUntis.getTodaysPlan();
const tomorrowsPlan = await GylohWebUntis.getTomorrowsPlan();

// Getting the plan for the 9th of june 2018 (if it exists)
const arbitraryPlan = await GylohWebUntis.getPlan(Date.parse("2018-06-09"));
```

## Extracting Information

### The SbustitutionPlan Object

The plan object contains all the information about the given day that this API provides. While it is probably best to explore all of it's and it's decendants' fields in on one's own using the IDE, I will outline some of the most useful things here.

```js
const plan = await GylohWebUntis.getTodaysPlan();

plan.entries; // All the entries in this plan
plan.affectedGroups; // for which groups of students this plan carries entries
plan.messages; // Messages concerning all students for this day
```

### The Entry Object

Entries represent one change (cancellation, substitution, ...) that takes place on a certain day.

```js
const entry = plan.entries[0];

entry.lesson; // A string showing which lesson this entry affects (example: "2 - 3")
entry.groups; // An array of groups that this entry affects
entry.subject; // The subject that is (or is normally) being taught during these lessons
entry.rooms; // In which rooms these lessons occur. Usually just one unless the class or course is split up
entry.info; // A short info text about the nature of this entry
entry.message; // A message from the teacher
```