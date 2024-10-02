Getting Started
===============

In this section, we'll go through the steps necessary to set up Psychex and use it within an HTML project.

Installation
------------

Psychex can be installed from the Psychex Github repo. The source file can be found at:

- src/psychex.js

This includes code docs and tooltips, which offer a handy way of getting details about classes and methods within
an editor such as VS Code. It's also the version to use if you wish to extend contribute to Psychex.

When running in production, consider minifying your code using something like `Terser <https://terser.org/>`_. This will remove extra whitespace and comments and make file-size smaller, improving performance.

Once you've downloaded the code file, place it somewhere in your project, and import the file into your project by referencing in your base HTML file, as such::

    <script src="lib/psychex.js"></script>

Psychex is a wrapper for the `p5.js <https://p5js.org/>`_ library and uses the same required functions.

Starter Kit Setup 
-----------------

Alternatively, clone the repo and copy the folder *starter_kit* into your project directory - this contains barebones files that will work out of the box, and is a good foundation from which to build your project. If you choose to do this, you can serve the file by opening a terminal of your choice, navigating to the project root, and running
something like: ::

    python -m http.server

(if you encounter an error such as *command python not recognised*, try running `python3 -m http.server` or running `python -v` to check if you have Python installed). If you're more inclined towards JavaScript, instead run: ::

    npm install http-server -g
    http-server -p 8000

Or with php: ::

    php -S 0.0.0.0:8000

In a browser, navigate to `http://127.0.0.1:8000` to view your project.

Running Psychex with JATOS
--------------------------

Psychex integrates nicely with JATOS, if you're using that to serve experiments, and requires minimal changes to your codebase - in fact, they're a great pairing!

For details on how to get the most out of Psychex + JATOS, see :doc:`../tutorial/deploying`.

Manual Setup
------------

If you're using the starter kit, the file *static/js/main.js* contains the following functions by default.

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
This powers animations and dynamically rendered content. The frame rate can be queried or set with the function::

    // Return the current framerate:
    frameRate();
    // Set the framerate:
    // frameRate(24);

Next steps
----------

To continue learning about Psychex, either read through the function docs, or (recommended) work through the provided tutorials.



