# Strips

Strips is an easy minimalistic console based utility that conceptually divides the console into many strips. Each strip can be updatable or nonupdatable.

  - Updatable Strip
  - Nonupdatable Strip

> Updatable Strip is the one that logs on the same line every time it is called. Best for showing progess. Like Download progress, processing progress. 

> Updatable Strip is the one that logs on the separate line each time it is called. Just like console.log

### Version
1.0.0


### Usage

One Strips unit is for one output stream. Never register same stream with two different  Strips.

Initialize the Strips for one output stream
```sh
var strip = new Strip(process.stdout);
```

Name the updatable and nonupdatable strip
```sh
var _log = strip.nonupdatable;
var _ulog = strip.updatable;
var _uulog = strip.updatable;
```

Use it to log
```sh
_log("Application using Strip");
_uulog("Application Status: Download in progress");
_ulog("Download status: 10%");
_ulog("Download status: 55%");
_ulog("Download status: 100%");
_uulog("Application Status: Download completed");
```

### Limitations

Suggested not to use console.log as the behaviour is weird.

License
----

MIT


