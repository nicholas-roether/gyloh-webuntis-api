# Gyloh WebUntis API

This API let's you access the WebUntis data (substitutions, cancellations, and the such) for the Gymnasium Lohbrügge in Hamburg.
It's honestly so specific that I don't even know why I'm writing this readme in english.

## Usage

### Getting Plans

To get the substitution plan for a certain day simply use the function `getPlan(date)`, passing in a corresponding date object. 

Please note that while you can theoretically pass any date to this function, you can only actually read the substitution plan for
days for which one was made, which means obviously not on weekends or during holidays, not before somewhere in 2018 when they first started using
digital plans, and usually no more than one day in the future.

If you try to get a plan that does not exist, this function will throw a `GylohWebUntisPlanNotFoundError`.

```js
const gwu = require("gyloh-webuntis-api");

// Getting the substitution plan of today
const plan = gwu.getPlan(new Date());
```