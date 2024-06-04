Getting Started
===============

In this section, we'll go through the steps necessary to set up Psychex and use it within an HTML project.

Installation
------------

Psychex can be installed from Github. Download the source code file and place in a `lib` folder (or equivalent folder of your liking).
Import the file into your project by referencing in your base HTML file, as such::

    <script src="lib/psychex.core.js"></script>

Psychex is a wrapper to the .. _p5.js library: https://p5js.org/ and uses the same required functions. 

Skeleton Setup 
--------------

Alternatively, download the skeleton folder from examples/skeleton - this contains barebones files that will work out of the box. If you choose to do this, you can serve the file by opening a terminal of your choice, navigating to the project root, and running
something like: ::

    python -m http.server

(if you encounter an error such as *command python not recognised*, try running `python3 -m http.server` or running `python -v` to check if you have Python installed). If you're more inclined towards JavaScript, instead run: ::

    npm install http-server -g
    http-server -p 8080

Or with php: ::

    php -S 0.0.0.0:8000

In a browser, navigate to `http://127.0.0.1:8000` to view your project.

Manual Setup
------------

The following can be used as a basic template::

    function preload(){
    
    }

    function setup(){

    }
    
    function draw(){

    }

Let's break down each of these functions individually.

Preload
^^^^^^^^^

The preload() function is responsible for loading *static* content before the rest of the display renders. *Static* content refers to 
external content that's delivered to the user unchanged, for example:

- Images
- Fonts
- Gifs

This function is *blocking*, i.e. it will wait until all specified content is loaded before continuing.
See :doc:`loading_static_content` for details on how this function can be used.

Setup
^^^^^^^

The setup() function should contain any code that needs to be run *once*, before any rendering happens.
Think of this as a sort of *init* method. For example, the kind of things that might be placed in setup():

- *createCanvas()* - the p5 function that defines the canvas to which you can render your experiment visuals
- Experiment-specific structures: such as images, shapes, text, etc., that should be loaded as soon as the experiment begins.
- Event listeners: while Psychex ships with a primitive click listener, any additional event listeners can be defined here. For example, defining a fullscreen checker function could be done here.

Setup() is where the core game function is defined and initialised. The tutorials provided here will show lots more examples of how it can be used!

Draw
^^^^

The draw() function is an *animation loop*: it extends the JS *requestAnimationFrame()* function.
This function is run many times per second, typically based on the display refresh rate: e.g., for a 60Hz display, *draw()* will run 60 times per second.
This powers animations and dynamically rendered content. The frame rate can be queried with the p5.js function::

    // Return the current framerate:
    frameRate();
    // Set the framerate:
    // frameRate(24);

Next steps
----------

This describes the barebones content required to use Psychex. In the next steps, we'll show how to create 
an experiment from scratch.



