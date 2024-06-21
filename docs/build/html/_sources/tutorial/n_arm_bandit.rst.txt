Tutorial: N-Arm Bandit Task
===========================

This tutorial will show how you can build a variable N-arm bandit task from scratch using Psychex. In particular, we'll demonstrate:

- How to setup Psychex
- How to load static content
- How to use the Psychex *NArmBandit* class
- How to extend Psychex classes
- How to listen for user clicks
- How to store and store user data

Wow, sounds like a lot! Luckily, Psychex makes all of this a blissful experience. Let's get started!

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
but if you want scrollable content, then feel free to remove this.

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
    var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};

    function preload(){
    
    };

    function setup(){

    };

    function draw() {

    };

Let's go through each of these sections and explain what they do. ::

    var assets = {"imgs" : {}, "fonts" : {}}
    var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"}

The first variable, `assets` is an object that will store static content for use later on. Psychex comes with a custom image object, `PImage`. When we load
images and other static files like fonts and gifs, it's we'll load them as either Psychex or p5.js objects, so it's useful to keep a mapping of 
asset name to object. We'll show how this works shortly.

The second variable, `params` defines some global parameters that will tell Psychex how to render content.

- `verbose`: setting to `true` will log extra information to the console.
- `positionMode`: This can be set to either `PERCENTAGE` or `PIXELS`. Using `PERCENTAGE` will tell Psychex to expect dimensions such as x,y coordinates, width, and height, in terms of their percentage of the total available screen width or height, respectively. E.g., if positionMode: "PERCENTAGE", the centre of the screen would be `(x,y) = (50, 50)`. Setting this to `PIXELS` will use pixel values as default instead.
- `textAlign` : Sets the anchor point for text. If `CENTER`, then the position specified will be the center of the text. If `CORNER`, the anchor point will be the top left-hand corner.
- `imageMode` : Sets the anchor point for an image. Same as previously, `CENTER` uses the centre of the image for positioning, `CORNER` uses the top left-hand corner.
- `rectMode` : Sets the anchor point for a rectangle shape. Uses the same rules as `imageMode`.

After defining these parameters, we create 3 empty functions:

- `preload()` loads static content in advance.
- `setup()` contains code to be run once at the start of the experiment 
- `draw()` contains renderable content that can be run many times per second.

Drawing text
------------

Let's start by displaying some header text. We'll create a global variable that can hold our renderable objects: ::

    var assets = {"imgs" : {}, "fonts" : {}};
    var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
    // -- INSERT HERE -- //
    var canvas;
    var gameContent = {};

Before we can define anything, we need to create a canvas. Add the following to `setup()` ::

    function setup(){
        var canvas = createCanvas(window.screen.width, window.screen.height);
        canvas.parent("gameCanvas");
    }

This references the `gameCanvas` div we made before in `main.html` - so make sure the IDs match! Now we can add our first text component.
Psychex renderable classes have a lower case `p` as a prefix. The text class is called `pText`. If you want more details about each of the classes described
here, check the individual pages within the docs.

`pText` is instatiated with 3 parameters: `text`, `x`, `y`: ::

    function setup(){
        var canvas = createCanvas(window.screen.width, window.screen.height);
        canvas.parent("gameCanvas");

        // -- New code -- //
        gameContent.title = new pText("My Bandit Task!", 50, 10)
    }

Finally, we need to add this to the draw loop: ::

    function draw(){
        clear();

        gameContent.title.draw();
    }

All Psychex objects have a `draw` method that tells the main draw loop what they should look like. We've also added `clear()` at the start of the loop.
This removes all rendered content from the screen at the start of the function, before drawing it again. If we didn't do this, our content would be 
overlayed ontop of itself 30 (or more) times per second, which can create some weird effects, especially if we add animations!

// TODO add in details about changing font size etc. //

The NArmBandit Class
--------------------

Psychex offers a number of base classes for common experiments. One of these is the `NArmBandit` class. Psychex classes are designed to be extended
so that custom functionality can be built, while commonly used base components avoid the experimenter from duplicating effort.

We'll start by defining our own class, and extending the base class: ::

    class BanditTask extends NArmBandit {
        constructor(x, y, nArms, probs){
            super(x, y, nArms, probs);
        }
    }

`NArmBandit` expects 4 parameters: *x*, *y*, *nArms* and *probs*. The first two are coordinates, which can be useful as an anchor point for adding renderables
later (such as images as we'll see shortly). If you don't need these, simply use 0, 0 as inputs. nArms describes the number of arms in the task, and probs 
is an array of probabilities for each arm. See :doc:`../code_docs/primitives` for details on the class.

We can immediately use this created class for a bandit task. For instance the parent method `pullArm` will pull a specific arm and return a *boolean*
based on the assigned probabilities, e.g.: ::

    let myBanditTask = new BanditTask(0, 0, 2, [0.5, 0.5])
    myBanditTask.pullArm(1)

Let's build upon our class by adding some visuals. We'll add 2 slot machine images to represent the 2 arms in our task. First, let's load the slot machine img: ::

    preload() {
        assets.imgs.slotMachine = loadImage("https://raw.githubusercontent.com/agrogan97/psychex/dev/docs/build/html/_static/slotMachine.png")
    }

and now we'll add copies of this image to our new class: ::

    constructor(x, y, nArms, probs){
            super(x, y, nArms, probs);

            // -- New code -- //

            this.slotMachines = []

            for (let i=0; i<Arms; i++){
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

        // -- Draw bandit task here -- //
        gameContent.myBanditTask.draw();
    }

Refresh the page, and behold your slot machines. Now, we want a player to be able to choose a slot machine to sample from. To do this, we'll use a *click listener*.

Click Listeners
---------------


