Tutorial: Ho, M. *et al.* (2022)
================================

This example recreates Ho & colleagues' experiment from their 2022 Nature paper titled *People construct simplified mental representations to plan*.

In this work, they use an experimental paradigm where participants see a gridworld populated by obstacles, 
a start point, and an end point. The participant is tasked with navigating to the end point while avoiding the obstacles. 
Initially, all obstacles are visible during navigation (this is changed in later experiments). 
Finally, they are queried about their awareness of a particular obstacle during the trial.

Setting Up
----------

We'll start by copying the skeleton folder from *examples*. This contains all the dependencies and boilerplate code we need to get started.
Next, we can open a terminal, navigate to the root directory, and deploy a server to serve static files. For example, using Python: ::

    python -m http.server

If we open a browser at ``127.0.0.1:8000``, we'll see the Psychex welcome text.

Building a Gridworld
--------------------

From the skeleton, we've already got out preload, setup, and draw functions. Let's delete the Psychex welcome text, so *setup* looks like this: ::

    function setup(){
        var canvas = createCanvas(windowWidth, windowHeight);
        pixelDensity(1);
        frameRate(60)
        canvas.parent("gameCanvas")
        myGame = new Game();
    }

Psychex has a gridworld class that provides helpful functionality and will handle a chunk of the heavy lifting. 
You can look behind the scenes in more detail from the docs (TODO ref docs).

Gridworld Background
^^^^^^^^^^^^^^^^^^^^

Before we fully dive into the tutorial, let's explore a couple of the features of the gridworld class. If you're already familiar with it, you may
wish to skip this part. We can instantiate a gridworld in the following way: ::

    var myGrid = new GridWorld(x, y, w, h, nRows, nCols, align, kwargs);

where *x, y* are the coordinates on the screen, *w, h* are the width and height of the gridworld respectively, *nRows, nCols* are the number of rows
and number of columns respectively, *align* indicates whether the anchor point (i.e. where *x, y* is placed) is at the centre or top-LHS corner of the grid,
and kwargs is optional and allows for keyword-arguments to be passed in. For instance, we might initialise the grid with ::

    content.myGrid = new GridWorld(50, 40, 50, 70, 4, 4, "CENTER");

if we want a 4x4 grid positioned around a central anchor point at *50, 40*.

Each cell in a grid holds a *pRectangle* object, which means that anything you could do to a *pRectangle*, you can do to individual grid cells.
For instance, if we want to make a single cell clickable and have its colour change on click, we can use the `onCellClick` method.
This makes a single cell clickable, and accepts a callback to run `onClick`: ::

    // Make the first cell in the grid (index 0) turn red onClick
    content.grid.onCellClick(0, (e) => {
        // e contains a reference to the cell rectangle, and is a handy shortcut
        e.update({backgroundColor: "red"});
    })

    // We can also access a cell by it's [row, col] coordinates, without changing the method
    content.grid.onCellClick([2, 3], (e) => {
        // randomly change to a new colour from the list
        e.update({backgroundColor: _.sample(["red", "green", "yellow", "blue"])});
    })

And to set the aesthetics of a single cell in advance, we can use the wrapper method `setCellProps`, in a similar way: ::

    content.grid.setCellProps([3, 2], {backgroundColor: "red"});

which makes setting properties a little simpler. 

We'll see more details of the Gridworld class as we proceed with the tutorial.

Extending the Gridworld Class
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We'll begin by creating a new class that extends the Psychex Gridworld class. In this experiment, we want a few components of the grid to
remain the same between trials, and others to vary, so by having a custom wrapper this will be much easier.

Start by defining the class. You can either do this inside `main.js`, or in a new file. If you do it in a new file, don't forget to import it 
inside `main.html`. We can extend the class and pass parameters into the ``super`` method: ::

    class CustomGrid extends GridWorld{
        constructor(){
            super(50, 40, 50, 70, 11, 11, "CENTER");
        }
    }

This grid has 11 rows and 11 columns, following the grid used by the original authors. Since we're extending from the Gridworld class, we still have
access to the parent *draw* method, and can render define and render it as normal: ::

    function setup(){
        // ... preamble ... //

        content.grid = new CustomGrid();
    }

    function draw(){
        clear();

        content.grid.draw();
    }

Each grid in a trial contains a black cross that is impassible by the player. Let's draw the cross. Don't worry about player movement and setting things
as obstacles etc. for now, we'll get to that. The cross is defined on row 5, cols 3 -> 7 inclusive, and column 5, rows 3-> 7 inclusive.

.. warning::

    Remember, indexing always starts from 0!

We'll define this within the constructor: ::

    class CustomGrid extends GridWorld{
        constructor(){
            super(50, 40, 50, 70, 11, 11, "CENTER");

            // ... New code ... //
            _.range(3, 8).forEach(i => {
                this.setCellProps([5, i], {backgroundColor: "black"});
                this.setCellProps([i, 5], {backgroundColor: "black"});
            })
        }
    }

This uses ``_.range()``, a function from `lodash <https://lodash.com/>`_. Lodash is included in the skeleton library, so you can use all the
utlities it provides out of the box. The `range(a, b)` function creates an array of integers between *a* and *b-1*, which we can then iterate through.

In the original paper, the authors use 12 base mazes, where each maze contains 7 teronimo-shaped obstacles. These base mazes can also be rotated, while the start and 
end points are kept fixed, to create visually different trials. Let's start by defining a couple of methods:

    #. A method that takes in a maze layout and applies it to the grid
    #. A method that contains base maze layout definitions

To begin, we'll use a single maze layout, taken from the original paper. ::

    class CustomGrid extends GridWorld{
        constructor(){
            super(50, 40, 40, 70, 11, 11, "CENTER");

            // ... New code ... //
            _.range(3, 8).forEach(i => {
                this.setCellProps([5, i], {backgroundColor: "black"});
                this.setCellProps([i, 5], {backgroundColor: "black"});
            })

            // ... New code ... //
            this.generateRounds();
        }

        // ... New code ... //
        displayRound(layout){
            // Place blue (i.e. variable) obstacles on the grid
            layout.forEach(i => {
                this.setCellProps(i, {backgroundColor: "#0606cd"})
            })
        }

        generateRounds(){
            // Each maze contains 7 tetronimo obstacles, each of which is 4 blocks in an 'L' shape
            this.mazes = {
                // These are the coordinates of all the obstacles, not including the central cross
                1: [
                    [[0, 0], [0, 1], [0, 2], [1, 0]],
                    [[4, 0], [5, 0], [5, 1], [5, 2]],
                    [[2, 3], [2, 4], [3, 4], [4, 4]],
                    [[7, 4], [8, 4], [8, 5], [8, 6]],
                    [[7, 7], [8, 7], [9, 7], [9, 8]],
                    [[1, 9], [2, 9], [3, 9], [3, 10]],
                    [[5, 9], [6, 9], [7, 9], [7, 10]]
                ]
            }
        }
    }

This is a solid starting point, as it allows us to render a maze to the grid. In the coming sections, we'll define more robust ways of applying layouts.
Refreshing the page won't show anything, as we need to manually call ``displayRound``. Add the following into your `setup` function, or call from the console: ::

    content.grid.displayRound(_.flatten(content.grid.mazes[1]))

Here, we're using another lodash function: *_.flatten*. Our maze layout is a length-7 array, where each row is an array of 4 coordinates. Flattening the array
works like *numpy.flatten* or *torch.flatten* in Python - we're changing the array shape from (7, 4, 2) to (28, 2).

Let's add in another function that initialises the grid - this will let us define the player start coordinates, and we'll add a player token to show current position.
Inside our custom class, add the following: ::

    initialiseRound(){
        this.playerStart = [10, 0];
        this.playerPos = this.playerStart;
        // Overlay a circle to act as a player token
        this.overlay(this.playerStart, new pCircle(0, 0, 1, {backgroundColor: "yellow"));
    }

In this function, we set the starting position at the 10th row, 0th column - i.e. the bottom left cell of the grid.

We also introduce the ``overlay`` method. This allows us to place another object within a single cell, by simply specifying the coordinates
of that cell, and the object to place. This could be anything: a *pCircle*, a *pImage*, *pText* - you could even place another gridworld object
in a cell! ``overlay`` takes in 2 arguments:

    #. *id*: the ID of the cell to overlay something onto. This could be as an index (eg. 0, 1, 25, etc.) or coordinates (eg. [0, 0], [10, 0], etc.)
    #. *obj*: a Psychex object, instantiated as you would normally. Here, we're creating a new pCircle object.

.. Note:: 

    The position parameters when overlaying an object work differently to how you'd use them normally. Instead of being coordinates on the screen,
    they denote the distance from the centre of the specified cell. Overlays are designed to *always* be centred, so passing in coordinates *0, 0*
    means the object is centered on the cell, and *1, 1* means it is *1%* in *x* and *y* off-centre. This can be useful especially with elements such as 
    text, where you might want to fine-tune alignment. This also accepts negative offsets.

Movement Control and Key-Press Events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Make it mooooove*

Now we'll go over how to attach events to key-presses, so the player can move the token. Psychex allows you to attach callbacks to any key-press. The 
browser will then listen for key-presses and run the appropriate function. The *Gridworld* class provides an additional wrapper for this, called *toggleControls*.

When building a game like this where a player moves through a maze, you may want 2 separate callbacks:

    #. *before movement* - to implement rules about where they can move, i.e. not into walls or obstacles
    #. *after movement* - to apply logic after a move, such as updating position, changing an aesthetic, etc.

The *toggleControls* allows you to pass in each of these, which it'll wrap into a single callback. The first will run, and if it returns *true*, 
it will trigger the second. You can also define a control *mode*, and specify whether the player should use arrow keys, the *wasd* keys, or just operate 
through mouse clicks.

Of course, if you don't want to use this, you can just write your own using the ordinary key-press register (see user interactions docs).

We'll make a new method called *movementControl*: ::

    movementControl(){
        // Define a function we can use as a callback to see if the player is allowed to move

        const preMovementCallback = () => {
            // Use the gridworld `checkBounds` method that detects grid boundaries and computes new position based on input type
            // It takes the current player position, and the keyword 'key', which is the most recently pressed key.
            let canMove = this.checkBounds(this.playerPos, key);
            if (canMove.allowed){
                // If the move is allowed, update position
                this.playerPos = res.pos;
                // clear all existing overlays
                this.clearOverlays();
                // Draw the circle on our new position
                this.overlay(this.playerPos, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));
            }
        }

        // We'll leave the post-movement callback empty for the moment, and call the toggleControls parent method to build our key-press logic

        this.toggleControls("arrows", preMovementCallback);
    }

Now, call *movementControl* in the constructor class to register it when we start: ::

    class CustomGrid extends GridWorld {
        constructor(){
            // ... preamble ... //

            // Register movement control
            this.movementControl();
        }
    
        // ... //

    }

Let's now update our code to block the user from going through obstacles, or the central cross. 

First, we'll add a property called *isCross* to each of the central cross cells. Inside the constructor, when we set the background colour as black, change the code to the following: ::

    _.range(3, 8).forEach(i => {
        this.setCellProps([5, i], {backgroundColor: "black"});
        this.setCellProps([i, 5], {backgroundColor: "black"});

        // ... Add new code below ... //
        this.getCell([5, i]).isCross = true;
        this.getCell([i, 5]).isCross = true;
    })

We do this in the constructor since they'll stay constant every round.

Now, let's add a property called *isObstacle* to the tetronimos, inside *initialiseRound*. While we're here, we'll update it to randomly pick a new maze to display.
This function will in due course control what the player sees each round. Update the code to the following: ::

    initialiseRound(){
        this.playerStart = [10, 0];
        this.playerPos = this.playerStart;
        this.overlay(this.playerStart, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));

        // Remove the isObstacle tag from all cells, to create a fresh start when a new round is started
        this.cells.forEach(cell => {
            // We're storing this inside cell.obj, not cell!
            cell.obj.isObstacle = false;
        });

        // Let's randomly pick a maze ID
        let mazeId = _.sample(Object.keys(this.mazes));

        // Move the displayRound call into here
        this.displayRound(_.flatten(this.mazes[mazeId]));

        // set all obstacle cells as isObstacle = true by looping over the maze
        _.flatten(this.mazes[1]).forEach(coord => {
            this.getCell(coord).isObstacle = true;
        })

    }

Now all of our maze cells are marked as obstacles automatically when we initialise a new round!

Finally, we'll update the movement control to check if the next cell is an obstacle or a cross: ::

    movementControl(){
        // Set a mapping of the keyboard click to its effect on position

        const preMovementCallback = () => {
            let res = this.checkBounds(this.playerPos, key);
            // ... New code ... //

            // Check if this is an obstacle or a cross
            let isObstacle = this.getCell(res.pos).isObstacle || this.getCell(res.pos).isCross;

            // Update to only proceed if it's not an obstacle or a boundary
            if (res.allowed && !isObstacle){
                // TODO now check if the square has an obstacle tag
                this.playerPos = res.pos;
                this.clearOverlays();
                this.overlay(res.pos, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));
            }
        }

        this.toggleControls("arrows", preMovementCallback);
    }

Now we have movement, and the player can't walk through walls!

We have a couple more changes to make to match the original study, namely:

    - Add a path to show where the player's been
    - Add an endpoint that acts as a countdown timer
    - Start a new round when the countdown elapses, or when they reach the endpoint.

The first is simple. If the movement is allowed, but before position is updated, we'll set the colour of the previous cell to be a light green. Inside *movementControl* ::

    if (res.allowed && !isObstacle){
        // ... New code ... //
        // Update cell backgroundColor to be green 
        this.setCellProps(this.playerPos, {backgroundColor: '#5f9c56'}); // a green hex code

        // -- Previous code -- //
        this.playerPos = res.pos;
        this.clearOverlays();
        this.overlay(res.pos, new pCircle(0, 0, 1, {backgroundColor: "yellow"}));
    }

.. Note:: 

    The authors originally used a line path through, rather than colouring the squares. We could implement this adding an `line` overlay to
    each cell instead of setting the cell props - but changing colour works just fine.

Secondly, we'll add a countdown timer overlay on the endpoint cell.