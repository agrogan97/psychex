# Templates

While Psychex is a frontend library and doesn't offer server-side functionality, when building more complex games it can become important to implement bespoke logic for handling data-saving, participants, loading, checkpointing, etc.

In this file we include some templates for commonly used tools that solve a range of problems.

## ExpressJS

The ExpressJS server included here provides a simple method of serving HTML pages, and provides an endpoint for loading data, and an endpoint for saving data locally as JSON.
It should serve as a jumping-off point, not necesarily as a production server.