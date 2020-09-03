## Installing Bootstrap

### Step 1:
Bootstrap (version 4) is installed locally for this project using the command line. Make sure you're inside the *project folder* (not /src).

```bash
npm install --save bootstrap@4
```

In addition, jQuery must also be installed.

```bash
npm install --save jquery
```

### Step 2 :

Ensure that angular.json (located at the top level of the project) includes a couple important entries:

- projects/architect/build/options/styles: 
	[... , "node_modules/bootstrap/dist/css/bootstrap.css" ]

- "/architect/build/options/scripts: 
	[..., "node_modules/bootstrap/dist/js/bootstrap.js" ]

This should be sufficient to get Bootstrap 4 working. 

*Reference: https://www.techiediaries.com/angular-bootstrap/*

## Firebase

The endpoints to the project database are all in the code, but you still need the API key to read/write anything *(of course, that's privileged information)*.

The .json file containing the API key is expected to be found in ./src/shared.

**~ Make sure your git-ignore includes this file! ~**


