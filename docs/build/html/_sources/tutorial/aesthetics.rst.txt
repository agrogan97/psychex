Styles and Aesthetics
=====================

Psychex handles object styling through its *aesthetics* system. This essentially takes care of how everything looks, from font colour, font size, 
shape fill colour, rectangle border thickness, etc.

This page shows how to do the following:

    #. Set default style properties on primitives
    #. Set style on individual elements
    #. Set styles interactively, such as at certain times, or through user interaction.

To make best use of this guide, download the skeleton template, launch an local browser instance, and open a web console.

Setting Default Styles
----------------------

All primitives, such as pText, pRectangle, pCircle, etc., have default aesthetics. These are contained within the global variable `psychex.aesthetics`.
Within this, there contains objects for each of the primitives. You can get details on this by opening a console, and running: ::

    psychex.aesthetics.show();

Similarly, to get details about the default settings on a specific primitive, run: ::

    psychex.aesthetics.pText.show();

Where `pText` can be replaced with any other primitive.

The properties listed are the default settings for that primitive type. These properties are set for all primitives of that type, unless manually specified.
We'll cover manual settings in the next section.

To edit the default properties, you can use the `edit()` function in each `psychex.aesthetics` object. Eg:

.. py:function:: psychex.aesthetics.pText.edit(aes)

    Update the default settings for the chosen (in this case pText) primitive.

    :param object aes: A dict mapping property to the new default value. The named properties in this parameter must match the values in the object. You can view these parameters by running psychex.aesthetics.pText.show()

Here's an example of how to set the global defaults for a pText object: ::

    var content = {};

    function setup(){

        // ... preamble .. //

        psychex.aesthetics.pText.edit({fontColor: "blue", textSize: 32});
        content.myText = new pText("Welcome to Psychex", 50, 50);
    }

    function draw(){
        content.myText.draw();
    }

.. note::
    If you update the default aesthetics, only the elements defined **after** the update will have the new settings applied. 
    If you wish to apply custom defaults to all elements, do this before defining any elements in `setup()`. To apply one set of defaults to a handful
    of elements, and different default settings to other elements, define the first group, then edit the settings, then define the next group. For instance ::

        // .. setup preamble .. //
        content.text1a = new pText("Block 1", 50, 30);
        content.text1b = new pText("Defaults 1", 50, 35);

        // Define new defaults //
        psychex.aesthetics.pText.edit({fontColor: "blue", textSize: 34});

        // Text with new defaults //
        content.text2a = new pText("Now they're...", 50, 50);
        content.text2b = new pText("Big and blue", 50, 55);

        // ... and draw as normal


Manually Overriding and Setting Specific Styles
-----------------------------------------------

It's likely you'll want individual elements to be styled in specific ways. Each Psychex primitive can be styled through its `kwargs` parameter.
For more details on this, check the :doc:`../code_docs/primitives` docs.

`kwargs` is an optional parameter included at the end of every Psychex class, that allows you to override settings.

To update the aesthetics for an element, add the styles to `kwargs`, for instance: ::

    content.text = new pText("Hello World", 50, 50, {fontColor: 'blue');
    content.moreText = new pText("I <3 Psychex", 50, 60, {fontSize: 48});
    content.myRect = new pRectangle(10, 10, 10, 10, {borderWidth: 5, backgroundColor: 'yellow'});

Applying aesthetics in this way will **override** the specified properties, but **keep** any defaults not specified.

Dynamic Styling
---------------

Perhaps you want to update styles in a dynamic way, such as on user-click. No problem!

Each `primitive` object has an `update()` method that allows you to update kwargs and aesthetics at any time. For example: ::

    // Imagine a rectangle shape that's initialised with a red background
    content.someRect = new pRectangle(50, 50, 10, 10, {backgroundColor: "red");

    // This can be updated by calling its update method:

    content.someRect.update({backgroundColor: "blue"});

.. note::
    Calling `update()` and passing in parameters will update only the specified parameters, while keeping all others at their default value.

Examples
--------

Let's consider a couple of examples where we might want to apply styling dynamically or from an interaction.

Change On-Click
***************

Imagine you want the colour of a rectangle to change when it's clicked by a user. This might be used to give the player feedback on an interaction, for example.
Firstly, we'll create a rectangle object inside setup: ::

    var content = {};

    function setup(){
        // ... setup preamble ... //

        // Create a pRectangle inside content
        content.myRect = new pRectangle(50, 50, 10, 10, {backgroundColor: "green", stroke: "green"});

    }

    function draw(){

        content.myRect.draw();

    }

The rectangle is initially rendered with a green background, and a green border.

Let's now make the shape clickable, and edit its `onClick()` property. For a deeper dive into user interactions, 
check out the tutorial on :doc:`interactions`. Let's register the shape as a clickable object, and edit `onClick`: ::

    // ... previous setup code ... //

    // tell Psychex to listen for clicks on this object
    content.myRect.toggleClickable();
    // Define the function to be run when the object is clicked
    content.myRect.onClick = () => {
        content.myRect.update({backgroundColor: "yellow", stroke: "yellow"});
    }

Simple as that! Now, when the user clicks the rectangle, it's background and border colour will turn yellow.

We can set this to automatically change back after some time by adding a timeout within the same function: ::

    content.myRect.onClick = () => {
        content.myRect.update({backgroundColor: "yellow", stroke: "yellow"});
        setTimeout(() => {
            // Change colour back to green after 1 second (1000 milliseconds)
            content.myRect.update({backgroundColor: "green", stroke: "green"});
        }, 1000)
    }

Traffic Lights
**************

Let's use the same logic to create traffic lights that change colour based on a user-click.
For this, we want 3 lights (green, amber, and red), that go from red -> red + amber -> green, and then from green ->
green + amber -> red.

Let's start by defining all our shapes in `setup`: ::

    var content = {};

    function setup(){
        // ... setup preamble ... //

        // Define 3 lights, and a button to request a change in lights
        content.redLight = new pRectangle(50, 10, 5, 10, {backgroundColor: "red", stroke: "red"});
        content.amberLight = new pRectangle(50, 21, 5, 10, {backgroundColor: "white", stroke: "orange"});
        content.greenLight = new pRectangle(50, 32, 5, 10, {backgroundColor: "white", stroke: "green"});
        content.crossing = new pButton(50, 45, 3, 6, {backgroundColor: "white", stroke: "black"})
            .addText("Go", {textSize: 24});
    }

    function draw() {
        // draw the lights and button
        content.redLight.draw();
        content.amberLight.draw();
        content.greenLight.draw();
        content.crossing.draw();
    }

Note that, for the crossing button, we've used a `pButton` object. These are clickable by default, so we don't need to run `toggleClickable()`,
but we do need to specify what will happen `onClick`. Buttons can also contain either `pText` or `pImage` objects. Here, we're adding some text
through the `addText` method.

Let's go through and add all the rules for changing lights into `onClick`, under our previous definitions: ::

    // ... previous setup() code //

    content.crossing.onClick = () => {
        // Set the amber light to come on after 1 second
        setTimeout(() => {
            content.amberLight.update({backgroundColor: "orange"});
            // turn on the gren light after another second
            setTimeout(() => {
                content.greenLight.update({backgroundColor: "green"});
                // turn off the amber light
                content.amberLight.update({backgroundColor: "white"});
                // turn off the red light
                content.redLight.update({backgroundColor: "white"});

                // Reset all
                setTimeout(() => {
                    // Turn on the amber light, and turn off the green light
                    content.amberLight.update({backgroundColor: "orange"});
                    content.greenLight.update({backgroundColor: "white"});
                    setTimeout(() => {
                        // turn on the red light, and turn off the amber light
                        content.redLight.update({backgroundColor: "red"});
                        content.amberLight.update({backgroundColor: "white"});
                    }, 1000)
                }, 3000)
            }, 1000)
            
        }, 1000)
    }

That's it! We're using several nested setTimeouts() to schedule events, but this is just one way of doing it.
This could also be simplified by predefining the colour changes, such as by defining: ::

    const lightChanges = {
        green: {
            on: {backgroundColor: "green"},
            off: {backgroundColor: "white"}
        },
        amber: {
            on: {backgroundColor: "orange"},
            off: {backgroundColor: "white"}
        },
        red: {
            on: {backgroundColor: "red"},
            off: {backgroundColor: "white"}
        }
    }

    // and making the logic slightly easier to read:

    content.crossing.onClick = () => {
        setTimeout(() => {
            content.amberLight.update(lightChanges.amber.on)
            // etc. //
        }, 1000)

    }

Colour-Changing Timer
*********************

Finally, this example shows how we can update the styling on a composite item - i.e. a class that contains primitives.
For this, we'll use the Countdown class. Let's start by initialising a countdown timer: ::

    function setup(){
        // ... setup preamble ... //

        // Create a countdown object with a 5-second timer
        content.timer = new Countdown(50, 50, 5);
    }

    function draw(){

        content.timer.draw();

    }

Currently, this has no graphics object (eg. a progress bar etc.) attached to it. The class provides 2 built-in objects: an arc, and a progress bar.
Let's attach an arc graphic to the underlying countdown logic. ::

    // ... preamble ... //

    // previous code //
    content.timer = new Countdown(50, 50, 5);
    // add an arc graphic with a width of 5 and a height of 10
    content.timer.setGraphic("arc", {w: 5, h: 10});

This shape starts with the same default graphics as *pCircle*. Similarly, the *progressBar* graphic uses the *pRectangle* defaults.

Let's change the timer so that, when it elapses, the background colour changes randomly. Under the last code we wrote, add the following: ::

    // ... previous code ... //
    
    // write a callback - i.e. a function that calls when the timer elapses
    // NB: onTimeUp is a class-specific name - so this method name must be used!
    content.timer.onTimeUp = () => {
        // randomly sample from a list of colours
        content.timer.graphic.update({backgroundColor: _.sample(["green", "yellow", "pink", "blue"])});
        // Reset the timer once it elapses
        content.timer.reset();
    }

    // And reset it at the start, so it begins once the page loads
    content.timer.reset();

The key point here is that we call the update on *content.timer.graphic*, **not** *content.timer* - the countdown object is just a container for code
and logic, the *graphics* object contains the primitive that is drawn to the screen!

Table of Settings
-----------------

The following describes all styles that can be applied, their keywords, and defaults:

.. list-table:: pText
    :header-rows: 1

    * - Key/s
      - Description 
      - Default
    * - textColor
      - The text colour, similar to *color* in CSS.
      - *black*
    * - textSize
      - Size of the font in pixels
      - 20
    * - textStyle
      - The style of font used. One of *NORMAL*, *ITALICS*, *BOLD*, or *BOLDITALIC*
      - *NORMAL*
    * - strokeWeight
      - The thickness of the draw stroke, i.e. line thickness
      - 1
    * - fontFamily
      - The font type to use: eg. "Times New Roman", "Calibri", "Aptos" - or one loaded by *loadFont*
      - *sans-serif*
    * - lineSpacing
      - The additional spacing in pixels between lines arranged vertically
      - 0

.. list-table:: Geometries: pRectangle, pCircle, pTriangle
    :header-rows: 1

    * - Key/s
      - Description 
      - Default
    * - backgroundColor
      - The colour of the area within the shape
      - *white*
    * - borderColor
      - The colour of the border wrapping the shape
      - *black*
    * - borderWidth
      - The width or thickness of the shape outline in pixels
      - 2