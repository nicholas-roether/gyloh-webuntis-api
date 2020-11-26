# Gyloh WebUntis API

This API let's you access the WebUntis data (substitutions, cancellations, and the such) for the Gymnasium Lohbrügge in Hamburg.
It's honestly so specific that I don't even know why I'm writing this readme in english.


## Getting Plans

Getting plan objects (`SubstitutionPlan`) is done via one of three methods:
- `GylohWebUntis.getCurrentPlans(num)`, which gets currently relevant plans, starting either today or on the next day of school, and getting `num` plans in total. The default for `num` is 2.
- `GylohWebUntis.getPlan(day)`, which gets a plan for an arbitrary `day`, which is either a `Date` object or a timestamp. It will return `null` if no plan is available for that day.

```js
const { GylohWebUntis } = require("gyloh-webuntis-api");

// I'll be using async/await for readability; obviously this code would need to be inside an asynchronous function

// Get three currently relevant plans.
const todaysPlan = await GylohWebUntis.getCurrentPlans(3);

// Getting the plan for the 9th of june 2018 (if it exists)
const arbitraryPlan = await GylohWebUntis.getPlan(Date.parse("2018-06-09"));
```

## Extracting Information

### The SbustitutionPlan Object

The plan object contains all the information about the given day that this API provides. While it is probably best to explore all of it's and it's decendants' fields in on one's own using the IDE, I will outline some of the most useful things here.

```js
const plan = (await GylohWebUntis.getCurrentPlans(1))[0];

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