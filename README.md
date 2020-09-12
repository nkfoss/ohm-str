## Installing Bootstrap

Bootstrap (version 4) is installed locally for this project using the command line. Make sure you're inside the _project folder_ (not /src).

```bash
npm install --save bootstrap@4
```

In addition, jQuery must also be installed.

```bash
npm install --save jquery
```

## Firebase

The endpoints to the project database are all in the code, but you still need the API key to read/write anything _(of course, that's privileged information)_.

The .json file containing the API key is expected to be found in the 'shared' folder.

**~ Make sure your git-ignore includes this file! ~**
