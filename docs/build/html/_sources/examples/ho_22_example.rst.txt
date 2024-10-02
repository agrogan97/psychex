Tutorial: Ho, M. *et al.* (2022)
================================

This example recreates Ho & colleagues' experiment from their 2022 Nature paper titled *People construct simplified mental representations to plan*.

In this work, they use an experimental paradigm where participants see a gridworld populated by obstacles, 
a start point, and an end point. The participant is tasked with navigating to the end point while avoiding the obstacles. 
Initially, all obstacles are visible during navigation (this is changed in later experiments). 
Finally, they are queried about their awareness of a particular obstacle during the trial.

Setting Up
----------

We'll start by copying the starter kit folder from the Github repo. This contains all the dependencies and boilerplate code we need to get started.
Next, we can open a terminal, navigate to the root directory, and deploy a server to serve static files. For example, using Python: ::

    python -m http.server

If we open a browser at ``127.0.0.1:8000``, we'll see the Psychex welcome text.

Building a Gridworld
--------------------

From the starter kit, we've already got out preload, setup, and draw functions. Let's delete the Psychex welcome text, so *setup* looks like this: ::

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

    var myGrid = new GridWorld(x, y, w, h, nRows, nCols, align, {});

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
-----------------------------

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

This uses ``_.range()``, a function from `lodash <https://lodash.com/>`_. Lodash is included in the starter kit, so you can use all the
utlities it provides out of the box. The `range(a, b)` function creates an array of integers between *a* and *b-1*, which we can then iterate through.

In the original paper, the authors use 12 base mazes, where each maze contains 7 teronimo-shaped obstacles. These base mazes can also be rotated, while the start and 
end points are kept fixed, to create visually different trials. Let's start by defining a couple of methods:

    #. A method that takes in a maze layout and applies it to the grid
    #. A method that contains base maze layout definitions

To begin, we'll use a single maze layout, taken from the original paper. ::

    class CustomGrid extends GridWorld{
        constructor(){
            super(50, 40, 40, 70, 11, 11, "CENTER");

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

Let's add a player token to the grid. The starting position is fixed at [10, 0], i.e. the bottom left hand cell of the grid. To do this, we'll introduce 
the idea of *overlays*, which are primitives that can be placed ontop of specified grid cells. This makes it easy to build up mazes with multiple
interactive components, that can be addressed separately to the cell objects. Overlays take in 3 parameters:

    - *name*: A unique identifier for the overlay, such as "character", "portal", "endpointIMage", etc.
    - *cellId*: An id indicating which cell to place the overlay 'in'. This accepts either index or coordinates. Multiple overlays can be placed in a cell at once.
    - *overlayObj*: A psychex object - what you actually want to draw. Could be a pImage, pCircle, pRectangle - even another gridworld object!

Inside our constructor, we'll create a reference to our character token and overlay it on the start position: ::

    // Add character token
    this.character = new pCircle(0, 0, 1, {backgroundColor: "yellow"});
    this.playerStart = [10, 0];
    this.addOverlay("player", this.playerStart, this.character);

.. Note:: 

    The position parameters when overlaying an object work differently to how you'd use them normally. Instead of being coordinates on the screen,
    they denote the distance from the centre of the specified cell. Overlays are designed to *always* be centred, so passing in coordinates *0, 0*
    means the object is centered on the cell, and *1, 1* means it is *1%* in *x* and *y* off-centre. This can be useful especially with elements such as 
    text, where you might want to fine-tune alignment. This also accepts negative offsets.

Let's also create a method called *initialiseRound*, where we can store and reset round-based settings, and create a variable called *playerPos* to track step-by-step position: ::

    initialiseRound(){
        this.playerPos = this.playerStart;
    }

And call this is the constructor: ::

    constructor(){

        // ... preamble ... //

        this.initialiseRound();
    }

Movement Control and Key-Press Events
-------------------------------------

Now we'll go over how to attach events to key-presses, so the player can move the token. Psychex allows you to attach callbacks to any key-press. The 
browser will then listen for key-presses and run the appropriate function. The *Gridworld* class provides an additional wrapper for this, called *handleMovement*.

When building a game like this where a player moves through a maze, you may want 2 separate callbacks:

    #. *before movement* - to implement rules about where they can move, i.e. not into walls or obstacles
    #. *after movement* - to apply logic after a move, such as updating position, changing an aesthetic, etc.

The gridworld *handleMovement* method allows you to pass in each of these, which it'll wrap into a single callback. The first will run, and if it returns *true*, 
it will trigger the second. You can also define a control *mode*, and specify whether the player should use arrow keys, the *w-a-s-d* keys, or just operate 
through mouse clicks.

Of course, if you don't want to use this, you can just write your own using the ordinary key-press register (see user interactions docs).

We'll make a new wrapper function called *movementControl*: ::

    movementControl(){

        // Define a function we can use as a callback to see if the player is allowed to move
        const preMovement = () => {
            // Use the gridworld `checkBounds` method that detects grid boundaries and computes new position based on input type
            // It takes the current player position, and the keyword 'key', which is the most recently pressed key,
            // and returns {allowed: true/false, pos: coords}
            let canMove = this.checkBounds(this.playerPos, key);
            if (canMove.allowed){
                // If the move is allowed, canMove.allowed == true, and canMove.pos is the new position
                // Update the player position
                this.playerPos = canMove.pos;
                // Draw the overlay at the new position, using updateOverlay()
                this.updateOverlay("player", {coords: canMove.pos});
            }
        }

        // Pass this function into handleMovement, the parent function
        this.handleMovement("arrows", preMovement);
    }
    
And as always, call it in the constructor. NB: this needs to be called **before** *initialiseRound*, so we have access to *playerPos*: ::

    // ... constructor preamble ... //
    this.generateRounds();
    // Calling it here, for instance, would be fine
    this.movementControl();

If you refresh the page, you should be able to move freely around the grid (including through the obstacles!).

Let's now update our code to block the user from going through obstacles or through the central cross. 

First, we'll add a property called *isCross* to each of the central cross cells. Inside the constructor, when we set the cross background colour as black, change the code to the following: ::

    _.range(3, 8).forEach(i => {
        this.setCellProps([5, i], {backgroundColor: "black"});
        this.setCellProps([i, 5], {backgroundColor: "black"});

        // ... Add new code below ... //
        this.getCell([5, i]).isCross = true;
        this.getCell([i, 5]).isCross = true;
    })

We do this in the constructor since they'll stay constant every round. Let's edit the function *displayRound* that we previously wrote, so that after we
change the colour of an obstacle to blue, we also give it a tag called *isObstacle*: ::

    displayRound(layout){
        // Place blue (i.e. variable) obstacles on the grid
        layout.forEach(i => {
            this.setCellProps(i, {backgroundColor: "#0606cd"})

            // --- New code --- //
            this.getCell(i).isObstacle = true;
        })
    }

This uses *getCell*, a method from the parent class that returns a reference to a cell from a given index.

Finally, we'll update the movement control to check if the next cell is an obstacle or a cross. We can do this but getting a reference to the 
proposed next cell returned by *canMove* and passing it into *getCell()*, then checking if it has either the *isCross* or *isObstacle* attributes. Inside *movementControl*: ::

    let canMove = this.checkBounds(this.playerPos, key);

    // --- New code --- //
    let isBlocked = (this.getCell(canMove.pos).isCross || this.getCell(canMove.pos).isObstacle);

    // And update to check it's not a boundary or a blocked cell
    if (canMove.allowed && !isBlocked){
        // If the move is allowed, canMove.allowed == true, and canMove.pos is the new position
        // Update the player position
        this.playerPos = canMove.pos;
        // Draw the overlay at the new position, using updateOverlay()
        this.updateOverlay("player", {coords: canMove.pos});
    }

Now we have movement, and the player can't walk through walls!

We have a couple more changes to make to match the original study, namely:

    - Add a path to show where the player's been
    - Add an endpoint that acts as a countdown timer
    - Start a new round when the countdown elapses, or when they reach the endpoint.

The first is simple. If the movement is allowed, but before position is updated, we'll set the cell colour to be a light green. Inside *movementControl* ::

    if (canMove.allowed && !isBlocked){
        // ... New code ... //
        // Update cell backgroundColor to be green 
        this.setCellProps(this.playerPos, {backgroundColor: '#5f9c56'}); // a green hex code
    }

.. Note:: 

    The authors originally used a dashed line as a path rather than colouring the squares. We could implement this adding an `line` overlay to
    each cell instead of setting the cell props - but changing colour works just fine and is easier to implement.


Adding More Complex Overlays
---------------------------- 

Secondly, we'll add a countdown timer overlay on the endpoint cell. Inside the constructor, define a timer object and overlay it onto the end position. 
Again, we want this to be called before *initialiseRound* or *movementControl*, so we have a reference to it within those methods: ::

    // Add timer
    this.timer = new Countdown(0, 0, 5).setGraphic("arc", {w: 2, h:4, borderColor: "green", borderWidth: 5, backgroundColor: "rgba(0, 0, 0, 0)"});
    this.addOverlay("timer", [0, 10], this.timer);

The timer is set to ellapse 5 seconds after being started, and we've attached a decreasing arc as a graphic. Bear in mind that it won't start counting
down until we run *this.timer.reset()*. Now, let's populate *initialiseRound* with everything we need to start a new round. Our flow is:

    - Reset player position to *playerStart*
    - Clear the path of the previous round
    - Clear everything marked as an obstacle (otherwise we'll have invisible walls!)
    - Display a new maze layout
    - Reset the timer

To reset player position, call the *updateOverlay* method: ::

    initialiseRound(){
        this.playerPos = this.playerStart;
        this.updateOverlay("player", {coords: this.playerPos});
    }

To clear the path, we need to track where we've been. This is useful data to have anyway, so let's add a variable called *path* into the constructor (again, before we call *initialiseRound*
or *movementControl*): ::

    // We can start it off with the start position
    this.path = [this.playerStart];

And after we've moved to a new position in *movementControl*, after we update the overlay: ::

    this.updateOverlay("player", {coords: canMove.pos});

    // --- New code --- //
    // Update the path
    this.path.push(this.playerPos);

Now we have a path, back in *initialiseRound* we can clear it: ::

    // Clear previous path
    this.path.forEach(id => {this.setCellProps(id, {backgroundColor: 'white'})});
    // Reset path variable
    this.path = [this.playerPos];

To remove all obstacles, we need to do the opposite to the `displayRound` function. Let's create another function called `clearRound`. This
will take in the current maze ID as input: ::

    clearRound(mazeId){
        // Skip if this is the first round
        if (mazeId == undefined){return}
        let layout = _.flatten(this.mazes[this.mazeId])
        layout.forEach(i => {
            this.setCellProps(i, {backgroundColor: "white"});
            this.getCell(i).isObstacle = false;
        })
    }

Let's randomly generate a new maze layout each time. Currently, we've only defined one, but we'll have more soon! If you're calling *displayRound* in the constructor,
you can delete that line and we'll replace it here: ::

    // Randomly select a maze:
    this.mazeId = _.sample(Object.keys(this.mazes))
    // Display the round
    this.displayRound(_.flatten(this.mazes[this.mazeId]));

In the first line, we take all the maze IDs, where ``this.mazes = {1: [...], 2: [...], 3: [...]}``, and ``Object.keys(this.mazes) = [1, 2, 3]``.
Then, we flatten and display our chosen maze. Remember, this also assigns those cells with *isObstacle* using our previous code.

Now, we can set the timer. In the original study, the player has 5 seconds to move on their **first** step, before the time elapses. After this,
they only have 1 second to move per step. We can edit the amount of time they have via the *endtime* attribute of the timer. Add the following: ::

    // Reset timer to 5 seconds for first movement, and then start it
    this.timer.endtime = 5;
    this.timer.reset();

We want the timer to reset every time the player makes a move. Remember earlier when we were building *movementControl*, and we could pass a 
pre-move and post-move callback into the parent *handleMovement*? Now we're going to use the post-movement callback to handle the timer. Underneath our
*preMovement* function, add a *postMovement* function: ::

    const postMovement = () => {

    }

In here, we're going to check if this is the end state or not, and act accordingly. First of all, let's create a vbariable to store out end state. In the constructor, add: ::

    this.playerEnd = [0, 10];

And back in our *postMovement* callback: ::

    const postMovement = () => {
        if (_.isEqual(this.playerPos, this.playerEnd)){
            // ... //
        } else {
            // ... //
        }
    }

.. note:: What's the point of the ``_.isEqual()``? Why not do ``if (this.playerPos == this.playerEnd){}``?

    Try it out for yourself, open up a console, and type: ::

        [1, 2, 3] == [1, 2, 3];

    You'll see that it returns ``false``! That's because JavaScript is looking to see if these are the *exact same object*, not just if
    they are the same type of object, containing the same elements. What we want to do is a *shallow comparison*, where we just look to see 
    if they contain the same values. So, we use the Lodash ``isEqual()`` function.

Let's populate our *postMovement* callback with the logic for both outcomes: ::

    const postMovement = () => {
            if (_.isEqual(this.playerPos, this.playerEnd)){
                // If this is the end position
                this.timer.pause();
                this.initialiseRound();
            } else {
                this.timer.endtime = 1;
                this.timer.reset();
            }
        }

Now, if we land at the end state, the timer will pause, and we'll begin a new round. If this isn't the end state, we'll set the timer to only last for 1 second,
and then we'll reset it. Don't forget to add this callback to *handleMovement*: ::

    this.handleMovement("arrows", preMovement, postMovement);

And, importantly, we have to ``return true`` from the preMovement callback - remember, the *postMovement* will only run if *preMovement* tells it it
can do by returning true! ::

    // ... previous code ... //
    // Update the path
    this.path.push(this.playerPos);

    // ... new code ... //
    return true;

Now you should be able to go from start to end, and see it reset. The final thing to do is set the rule for when the timer elapses.
To do this, we'll define *timer.onTimeUp*. Check out the `Countdown` docs for more info, but essentially this just 
gives the timer a function to call once it runs out. Inside the constructor, where we define the timer, add the following: ::

    this.timer.onTimeUp = () => {
            this.initialiseRound();
        }

Now, refresh your page to see the changes!

Perhaps we don't want to endure the Sisyphean nightmare of endless mazes and timers. Let's add a manual pause that we can turn off for the actual
experiment, but makes debugging more pleasant. In the constructor: ::

    psychex.keyPressEvents.register("Enter", () => {
        console.log("Enter")
        this.timer.pause();
    })

Now, hitting "Enter" will pause the timer, and moving as normal will resume it.

So we can experience playing the game more realistically, here are a set of 3 mazes the authors give in the original paper. Feel free to copy them into 
the *generateRounds* function: ::

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
            ],
            2: [
                [[0, 2], [0, 3], [0, 4], [1, 4]],
                [[2, 2], [3, 2], [3, 3], [3, 4]],
                [[5, 1], [5, 2], [6, 2], [7, 2]],
                [[8, 5], [9, 5], [10, 5], [10, 6]],
                [[1, 10], [2, 10], [3, 10], [3, 9]],
                [[4, 10], [5, 10], [6, 10], [6, 9]],
                [[8, 10], [9, 10], [9, 9], [9, 8]],
            ],
            3: [
                [[1, 2], [0, 2], [0, 3], [0, 4]],
                [[3, 1], [3, 2], [3, 3], [4, 3]],
                [[5, 0], [6, 0], [7, 0], [7, 1]],
                [[0, 6], [1, 6], [2, 6], [2, 5]],
                [[1, 10], [1, 9], [1, 8], [2, 8]],
                [[6, 10], [7, 10], [7, 9], [7, 8]],
                [[7, 7], [8, 7], [9, 7], [9, 6]],
            ]
        }

There are various ways you generate mazes in a more procedural way, for instance:

    - Write a function that randomly places the tetronimos, test out playing the round, and write a keypress event that logs the maze layout if it's playable
    - Design rounds by hand to gain the finest-grain control over the stimuli, and then paste them in here, or as an object in another file that you load in
    - Write an offline script that creates maze layouts (this doesn't even have to be in JavaScript, you could use Python, Java, or anything else you like). Then place these server-side and load them using the Psychex ``Game.loadDataFromServer()`` function into your gridworld class.

Psychex supports all of these options, and offers the extensibility to create alternatives.

Overriding the Parent Draw Method
---------------------------------

Finally, let's enhance the user experience by adding some feedback text throughout the round. Inside the constructor, define an empty string: ::

    this.displayText = "";

We want to show a message to the user after they complete a round, and after they're timed out. Inside the function we use for ``timer.onTimeUp``, 
we'll update this text, and we'll add a *timeout*. This instructs the code to run a function after a prescribed amount of time. ::

    this.timer.onTimeUp = () => {
        this.timer.pause();
        this.displayText = "Time's up! Moving to the next round...";
        setTimeout(() => {
            this.initialiseRound();
        }, 2000);
    };

Now, when the timer ellapses, the game will wait 2s (2000ms in the code, as *setTimeout* takes milliseconds) before beginning the next round. This will
give the player chance to read the displayed text message. Importantly, note that we also add ``this.timer.pause()``. This is an important concept to remember
when building games that use an *animation loop* - i.e. where a draw function runs ~60 times a second. The callback *onTimeUp* will be run every time there's a draw loop, 
so once the time has elapsed, if we created a *timeout* that waited 2 seconds before calling *reset*, it would mean that *onTimeUp* would run ~60x2=120 times until it was
next reset. So we pause the timer, to stop it calling that function. This is a common source of bugs when building games like this!

Next, update the *postMovement* function inside *movementControl* - where we listen for if the player is at the endpoint - doing the same as we've just done: ::

    if (_.isEqual(this.playerPos, this.playerEnd)){
        // If this is the endpoint
        this.timer.pause();

        // --- New code --- //
        this.displayText = "Round Complete! Beginning next round...";
        setTimeout(() => {
            this.initialiseRound();
        }, 2000)

    } else {
        this.timer.endtime = 1;
        this.timer.reset();
    }

And add some instructional text to *initialiseRound*: ::

    this.displayText = "Use your arrow keys to move the player token";

Finally, we have to actually draw the text. Recall that so far, we've just called ``content.grid.draw()`` inside the global *draw* function. By doing this,
we're referencing the draw method from the parent class (psychex.Gridworld). That draw function contains all the instructions necessary to draw the grid structure
and the overlays, but if we want to add any additional custom objects, we need to extend it. Fortunately, this is very easy. Within our CusatomGridworld class, add the following method: ::

    draw(){
        super.draw();
    }

This creates a new *draw* method, and then uses ``super`` to call the draw from the parent class. Effectively, this is just like saying *"run the parent draw function first, and 
then do everything else I want in my custom class"*. This is exactly what we're going to do. Let's draw our displayText: ::

    draw(){
        // Parent draws (grid, overlays)
        super.draw();

        // Our display text
        pText.draw_(this.displayText, 50, 80, {fontSize: 32});
    }
    
As a final learning exercise, here we're using a different version of *draw*. You may notice that this has an underscore attached to the end of the function name - 
in Psychex, this means that this is a *static method*. A static method is just a way of drawing a primitive without having to actually create it first - note that this
will render our text, but we haven't written ``this.someText = new pText(this.displayText, 50, 50, {})`` anywhere. Static methods can be handy as a quick way of rendering things,
especially when you won't need to access them later or they're unlikely to change. In this case, if we change our *displayText* variable, the static pText will update with it.