# FetchRelease
[![Build Status](https://travis-ci.org/ubports/fetchrelease.svg?branch=master)](https://travis-ci.org/ubports/fetchrelease) [![Coverage Status](https://coveralls.io/repos/github/ubports/fetchrelease/badge.svg?branch=master)](https://coveralls.io/github/ubports/fetchrelease?branch=master)

A simple nodejs module to query the github releases api, built using modern javascript.

*WIP: This module does not claim to be feature-complete or stable or anything. If you die because of using it, that's on you.*

### Example

```javascript
const FetchRelease = require("./src/fetchrelease.js");

const api = new FetchRelease({
  user: "ubports",
  repo: "ubports-installer"
});

api.getRelease("latest").then((release) => {
  console.log(release);
});

api.getAssetUrl("latest", "deb").then((url) => {
  console.log(url);
});
```
