Tutorial: N-Arm Bandit Task
===========================

This tutorial will show how you can build a variable N-arm bandit task from scratch using Psychex. In particular, we'll demonstrate:

- How to setup Psychex
- How to load static content
- How to use the Psychex *NArmBandit* class
- How to extend Psychex classes
- How to listen for user clicks
- How to store and store user data

Setup
-----

If you haven't already, download Psychex from Github. We'll set up a standard directory structure for a vanilla web-project,
which will look like this:

::

    Bandit_Tutorial_Project
    |--- static/
    |--- lib/
         |--- lodash
              |--- lodash.core.js
         |--- p5
              |--- p5.js
         |--- psychex
              |--- psychex.js
    |--- js
         |--- main.js
    |--- index.html

HTML Setup
^^^^^^^^^^

We can start by populating our HTML entrypoint, `index.html`. ::

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>MyTestProject</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <!-- Lib files -->
        <script src="lib/lodash/lodash.core.js"></script>
        <script src="lib/p5/p5.js"></script>
        <script src="lib/psychex.js"></script>
        <!-- Stylesheets -->
    </head>

    <body style="overflow-y: hidden; overflow-x: hidden;">
        <div class="mainContent">
            <div id="gameCanvas" class="gameCanvas">
                <!-- Canvas inserted via JavaScript -->
            </div>
        </div>
        
        <script src="js/main.js"></script>

    </body>

    </html>

Let's break down the contents of this file and look at what isn't boilerplate HTML.

First, we import our library files: ::

    <!-- Lib files -->
    <script src="lib/lodash/lodash.core.js"></script>
    <script src="lib/p5/p5.js"></script>
    <script src="lib/psychex.js"></script>

Next, we'll set use an inline style to block x and y-scrolling on our page. ::

    <body style="overflow-y: hidden; overflow-x: hidden;">
        <...>
    </body>

We want the experiment to feel like a single page,
but if you want scrollable content, then feel free to remove this. Yo can also add `margin: 0; padding: 0;` to remove any whitespace between the canvas and page body.

Importantly, we define a div that will hold our canvas. ::

    <div id="gameCanvas" class="gameCanvas">
        <!-- Canvas inserted via JavaScript -->
    </div>

We've named it `gameCanvas` - you can name this whatever you want, but it will be referenced when we initialise Psychex in the next steps.

Finally, we import our entrypoint javascript: ::

    <script src="js/main.js"></script>

Now we can set up our main Psychex file.

JS Setup
^^^^^^^^

Open `js/main.js` in your code editor of choice, and paste the following code in: ::

    // Global settings
    var assets = {"imgs" : {}, "fonts" : {}};

    function preload(){
    
    };

    function setup(){

    };

    function draw() {

    };

Let's go through each of these sections and explain what they do. ::

    var assets = {"imgs" : {}, "fonts" : {}}

The first variable, `assets` is an object that will store static content for use later on. Psychex comes with specific methods for 
loading assets (images, fonts, gifs) in a *blocking* way - which means it requires all static assets to be loaded before the game can start.
We'll demonstrate how to use this shortly.

After defining these parameters, we create 3 empty functions:

- `preload()` loads static content in advance.
- `setup()` contains code to be run once at the start of the experiment 
- `draw()` contains renderable content that can be run many times per second.

Drawing text
------------

Let's start by displaying some header text. We'll create a global variable that can hold our renderable objects: ::

    var assets = {"imgs" : {}, "fonts" : {}};
    // -- Global variables -- //
    var canvas;
    var gameContent = {};

Before we can define anything, we need to create a canvas. Add the following to `setup()` ::

    function setup(){
        var canvas = createCanvas(windowWidth, windowHeight);
        canvas.parent("gameCanvas");
    }

`windowWidth` and `windowHeight` are global variables that store the available width and height of the browser window. 
Note that the variables `width` and `height` are also available, and store the dimensions of the entire screen, not just the window.

The canvas variable references the `gameCanvas` div we made before in `main.html` - so make sure the IDs match. Now we can add our first text component.
Psychex renderable classes have a lower case `p` as a prefix. The text class is called `pText`. If you want more details about each of the classes described
here, check the individual pages within these docs.

`pText` is instatiated with 3 parameters: `text`, `x`, `y`: ::

    function setup(){
        var canvas = createCanvas(window.screen.width, window.screen.height);
        canvas.parent("gameCanvas");

        // -- New code -- //
        gameContent.title = new pText("My Bandit Task", 50, 10)
    }

Finally, we need to add this to the draw loop: ::

    function draw(){
        clear();

        gameContent.title.draw();
    }

All Psychex objects have a `draw` method that tells the main draw loop what they should look like. We've also added `clear()` at the start of the loop.
This removes all rendered content from the screen at the start of the function, before drawing it again. If we didn't do this, our content would be 
overlayed ontop of itself 30 (or more) times per second, which can create some weird effects, especially if we add animations!

We may wish to change the design of the header text. To do this, we use an `aesthetics` object. This is a mapping of 
style-keywords to their values that's passed to an object when it's instantiated. This is similar to ordinary HTML, where you 
would attach CSS styles to an HTML object. To make our heading bigger and in bold typeface, edit `gameContent.title` as follows:::

    gameContent.title = new pText("My Bandit Task", 50, 50, {textSize: 48, textStyle : "bold"});

You can check what the style keywords are within the :doc:`../tutorial/aesthetics` section of the docs.

The NArmBandit Class
--------------------

Psychex offers some base classes for building experiments. One of these is the `NArmBandit` class. Psychex classes are designed to be extended
so that custom functionality can be built, while having commonly used base components avoid effort duplication.

We'll start by defining our own class, and extending the base class: ::

    class BanditTask extends NArmBandit {
        constructor(x, y, nArms, probs){
            super(x, y, nArms, probs);
        }
    }

`NArmBandit` expects 4 parameters: *x*, *y*, *nArms* and *probs*. The first two are coordinates, which can be useful as an anchor point for adding renderables
later (such as images, as we'll see shortly). If you don't need these, simply use 0, 0 as inputs. nArms describes the number of arms in the task, and probs 
is an array of probabilities for each arm. See :doc:`../code_docs/paradigms` for details on the class.

We can immediately use this created class for a bandit task. For instance the parent method `pullArm` will pull a specific arm and return a *boolean*
based on the assigned probabilities, e.g.: ::

    gameContent.myBanditTask = new BanditTask(0, 0, 2, [0.5, 0.5])
    let banditResult = gameContent.myBanditTask.pullArm(1);
    console.log(banditResult);

Which will either print out `true` or `false`.

Let's build upon our class by adding some visuals. We'll add 2 slot machine images to represent the 2 arms in our task. First, let's load the slot machine img: ::

    preload() {
        assets.imgs.slotMachine = loadImage("https://raw.githubusercontent.com/agrogan97/psychex/dev/docs/build/html/_static/slotMachine.png")
    }

To load this image, we're using the function `loadImage()`. This preloads the image, caching it before the experiment starts.
Doing this ensures all your stimuli are loaded and ready before the participant can begin playing. See :doc:`../tutorial/aesthetics`.

Now we'll add copies of this image to our new class: ::

    constructor(x, y, nArms, probs){
            super(x, y, nArms, probs);

            // -- New code -- //

            this.slotMachines = []

            for (let i=0; i<this.nArms; i++){
                this.slotMachines.push(
                    new pImage(25 + i*50, 50, assets.imgs.slotMachine);
                )
            }

        }

We can now add a `draw()` method to the class, to contain the individual draw methods for each *pImage*: ::

    // ... BanditTask class preamble ... //

    draw(){
        super.draw();

        this.slotMachines.forEach(sm => {
            sm.draw();
        })
    }

Let's instantiate the class and render our images! If you didn't previously, create a reference within `gameContent`, which we made earlier: ::

    gameContent.myBanditTask = new BanditTask(0, 0, 2, [50, 50]);

and add call its draw method inside the draw loop: ::

    function draw(){
        clear();
        gameContent.title.draw();

        // -- Draw bandit task here -- //
        gameContent.myBanditTask.draw();
    }

Refresh the page, and behold your slot machines. Now, we want a player to be able to choose a slot machine to sample from. To do this, we'll use a *click listener*.

Click Listeners
---------------

All *Psychex* elements have click listeners attached to them by default, but they need to be turned on before they can be used.
Let's turn them on: ::

    // Define an array to store slot machine referencesq
    this.slotMachines = [];

    for (let i=0; i<this.nArms; i++){
        this.slotMachines.push(
            // Create a new image object and store it in the slot machines object
            new pImage(25 + i*50, 50, assets.imgs.slotMachine)
        );
    }

    // -- New code here -- //
    this.slotMachine.forEach(sm => {
        sm.toggleClickable();
    })

You can double-check that an object is clickable in a console by typing `<Object>.isClickable`. We can set a function that will
be run when the object is clicked on by overriding the object's `onClick` method. This can be done for the slot machines as follows: ::

    // Define an array to store slot machine referencesq
    this.slotMachines = [];

    for (let i=0; i<this.nArms; i++){
        this.slotMachines.push(
            // Create a new image object and store it in the slot machines object
            new pImage(25 + i*50, 50, assets.imgs.slotMachine)
        );
    }

    this.slotMachine.forEach(sm => {
        sm.toggleClickable();

        // -- New code here -- //
        sm.onClick = (e) => {
            console.log(e)
        }
    })

In this case, when the slot machine is clicked on it will print the object `e`. Here, `e` is a reference to the object that's being clicked on,
and needs to be included as a parameter to the function overwriting `onClick`. If you open the console, you can look at the printed object reference, 
and see it's of type `pImage`. Let's set the function so that when the player clicks, it pulls the respective slot machine arm:::

    // Define an array to store slot machine referencesq
    this.slotMachines = [];

    for (let i=0; i<this.nArms; i++){
        this.slotMachines.push(
            // Create a new image object and store it in the slot machines object
            new pImage(25 + i*50, 50, assets.imgs.slotMachine)
        );
        // --- New code here ---
        // Give each machine an ID, so we know which has been clicked
        this.slotMachines[i].id = `arm${i+1}`;
    }

    // --- New code here -- //
    // Create an object to store arm pull results
    this.pullResults = {"arm1" : [], "arm2" : []}

    this.slotMachine.forEach((sm, ix) => {
        sm.toggleClickable();

        // --- New code here --- //
        sm.onClick = (e) => {
            // Pull the arm and get the result
            let result = this.pullArm(ix)
            console.log(`${e.id} pulled ${result}`)
            this.pullResults[e.id].push(result);
            
        }
    })

There are a few changes here, so let's go through them one at a time. In the original loop where we define the slot machines, we add
the following: ::

    this.slotMachines[i].id = `arm${i+1}`;

This will assign the property `id` to each slot machine, which is arm + the id+1, i.e. either `arm1` or `arm2`. In the next
new line, we create an object to store results for each line: ::

    this.pullResults = {"arm1" : [], "arm2" : []}

With names that match the arm IDs, so we can easily access the arrays later. In the loop that sets clicable rules, we add another parameter: ::

    this.slotMachines.forEach((sm, ix) => {

The first parameter, `sm` is a reference to the current object in the array, and `ix` is a copy of its numerical index in the array.
For instance, if you use Python you may be familiar with `enumerate` - this works the exact same way (except the order of parameters is switched around!).

Finally, in the new `onClick`, we pull the arm, and add the result to the tracking object using the arm.id: ::

    let result = this.pullArm(ix)
    console.log(`${e.id} pulled ${result}`)
    this.pullResults[e.id].push(result);

Check the console to confirm this is working properly.

Next up, let's show the player the outcome of their pull, and keep track of a total score. 
Add 3 text objects to the `setup` loop of the bandit object: ::

    this.textA = new pText("", 25, 62, {textSize: 32});
    this.textB = new pText("", 75, 62, {textSize: 32});
    this.resultText = new pText("Score: 0", 50, 70, {textSize: 32});

Add variable to track score in `setup`: ::

    this.score = 0;

And we'll extend the click function, first to display the score after clicking on a slot machine: ::

    if (e.id == "arm1"){
        result ? this.textA.setText("Score +1") : this.textA.setText("No Score")
    } else if (e.id == "arm2"){
        result ? this.textB.setText("Score +1") : this.textB.setText("No Score")
    }

`p5.js <https://p5js.org/>`_

(If you're not familiar with `? :` notation, it's called the ternary operator. See `Mozilla docs <ref:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator>`_).

Finally, update the score, and the score text: ::

    if (result) {
        this.score += 1;
    }
    this.resultText.setText(`Score: ${this.score}`)

We don't necessarily want the score to stay under the slot machine forever, so let's add a timeout that will clear it after a 
period of time. Again, inside the new `onClick`: ::

    setTimeout(() => {
        // Set the text to an empty string after 1.5s
        e.id == "arm1" ? this.textA.setText("") : this.textB.setText("");
    }, 1500)

Where you can change the delay by changing the second parameter. This is set here to 1.5s (1500ms).

Finally, we can add in a couple of buttons to reset and end the experiment. To do this, we'll use the `pDOM` framework.

pDOM
----

The pDOM is exactly what it sounds like, a Psychex wrapper for (the p5.js wrapper for) the `Document Object Model`.
This allows you to use Psychex to build ordinary HTML elements, like divs, paragraphs, and forms. We can position and style
these objects in a very similar way to other Psychex objects. Unlike `canvas-based` Psychex classes, `pDOM` classes aren't
suffixed with `p`. Let's define 2 buttons within the main setup window of the task: ::

    gameContent.restart = new Button(40, 25, "Restart", "restartBtn");
    gameContent.endGame = new Button(60, 25, "End Game", "endBtn");

..warning::

    Unlike `canvas-based` Psychex objects, HTML objects do not need to be included in the main draw loop. 
    This is because they are rendered in a fundamentally different way, and only need to be instantiated once.

We can add styling to these by adding an aesthetics object when instantiating. The only difference is that the keys and values 
must all be valid CSS properties and valids, so don't forget to include things like `px` after units, etc.

Define a style object and add it to the buttons: ::

    const btnStyles = {
        "background-color" : '#ed1c24',
        "border" : "#b4b4b4",
        "color" : "white",
        "padding" : "15px",
        "font-size" : "20px",
        "width" : "175px",
        "box-shadow": "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
        "cursor" : "pointer"
    }

    gameContent.restart = new Button(37.5, 25, "Restart", "restartBtn", btnStyles);
    gameContent.endGame = new Button(55, 25, "End Game", "endBtn", btnStyles);


We can now attach click functionality to the buttons. When we click restart, we'll reset the score variable
we created before in the bandit task, and when we click end, we'll redirect the user: ::

    gameContent.restart.onClick(() => {
        gameContent.myBanditTask.score = 0;
        gameContent.myBanditTask.resultText.setText("Score: 0");
    })
    
    gameContent.endGame.onClick(() => {
        window.location.href = `https://agrogan97.github.io/psychex/`
    })

And there you have it! You now have a simple game where you can pull bandit arms and count your score.

Next steps
----------

To practice using Psychex, why not try implementing some additional features:

- Add in more slot machines
- Change the probability distribution behind the arms
- Improve how the score appears and disappears, so it doesn't remove new scores prematurely
- Anything else you might want to do!

Or, if you'd like a more challenging tutorial, move on to :doc:`../examples/ho_22_example`...