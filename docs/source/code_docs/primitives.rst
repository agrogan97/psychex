Primitives
==========

Primitives are the building blocks of more complex composite classes, and represent simple rendereable instances.

.. js:class:: pText(text, x, y, kwargs={})
    
    Instructions to render a string of text
    
    :param string text: String of text to be rendered.
    :param number x: The x-coordinates of the string using current *positionMode*
    :param number y: The y-coordinates of the string using current *positionMode*
    :param object kwargs={}: An dict-object containing additional keyword args 

   .. js:method:: draw()

        Render the text to the screen and create the underlying p5.js object.

::

    < // -- How to Use -- //>

    let helloWorld = new pText("Hello World!", 50, 50, {fontSize:32, color: 'black'});
    // pText can also handle newlines, by adding '\n'
    let multiLineText = new pText("In this experiment, participants \nhave 30 minutes to solve a complex\ntask.");

    // Run the draw methods within draw():
    draw(){
        // -- ... --
        helloWorld.draw();
        multiLineText.draw();
    }

    < // -- How to extend -- // >

    class customText extends pText {
        constructor(text, x, y, kwargs={}){
            super(text, x, y, kwargs);
            // -- custom content -- //
        }

        draw(){
            super.draw();
        }
    }

    let myCustomText = new customText("some text", 50, 50);

    draw() {
        // -- ... -- //
        myCustomText.draw();


.. js:class:: pRectangle(x, y, w, h, kwargs={})

    Object that can draw a 4-sided shape to the screen.

    :param number x: The x-coordinates of the shape using current *positionMode*
    :param number y: The y-coordinates of the shape using current *positionMode*
    :param number w: The width of the shape using current *positionMode*
    :param number h: The height of the shape using current *positionMode*
    :param object kwargs: An dict-object containing additional keyword args 

    .. js:method:: withImage(imgObj, kwargs)

        Creates a new pImage object under `this.img` and renders it to the center of the shape.

        :param object imgObj: An image loaded in using `p5.loadImage()`
        :param object kwargs: An dict-object containing additional keyword args 
        :return undefined:
        :rtype undefined:

    .. js:method:: draw()

        Draw method that creates the underlying p5.rect

    .. js:method:: draw_(x, y, w, h, kwargs)

        Static method that creates a rectangle object on the fly without instantiating an object

        :param number x: The x-coordinates of the shape using current *positionMode*
        :param number y: The y-coordinates of the shape using current *positionMode*
        :param number w: The width of the shape using current *positionMode*
        :param number h: The height of the shape using current *positionMode*
        :param object kwargs: A dict-object containing additional keyword args 

::

    < // -- How to Use -- //>

    </ / -- How to extend -- //>

    class customRect extends pRectangle {
        constructor(x, y, w, h kwargs={}){
            super(x, y, w, h, kwargs);
            // -- custom content -- //
        }

        draw(){
            super.draw();
        }
    }


.. js:class:: pCircle(x, y, r, kwargs={})

    Object that draws a circle to the screen

    :param number x: The x-coordinates of the shape using current *positionMode*
    :param number y: The y-coordinates of the shape using current *positionMode*
    :param number r: The radius of the circle
    :param object kwargs: A dict-object containing additional keyword args 

    .. js:method:: draw()

        Creates the underlying p5.circle object and renders it

    .. js:method:: draw_()

        Static method that creates a circle object and renders it on the fly without instantiating an object

::

    < // -- How to Use -- //>

    < // -- How to extend -- // >

    class customRect extends pRectangle {
        constructor(x, y, w, h kwargs={}){
            super(x, y, w, h, kwargs);
            // -- custom content -- //
        }

        draw(){
            super.draw();
        }
    }

.. js:class:: pTriangle(x1, y1, x2, y2, x3, y3, kwargs={})

    :param number x1: x-coordinate of the first point of the triangle
    :param number y1: y-coordinate of the first point of the triangle
    :param number x2: x-coordinate of the second point
    :param number y1: y-coordinate of the second point
    :param number x3: x-coordinate of the third point
    :param number y3: y-coordinate of the third point
    :param object kwargs: A dict-object containing additional keyword args 

    .. js:method:: draw()

        Draws a triangle to the screen using the coordinates provided to the class constructor.

.. js:class:: pImage(x, y, img, kwargs={})

    Renders an image to the screen.

    :param number x: The x-coordinates of the shape using current *positionMode*
    :param number y: The y-coordinates of the shape using current *positionMode*
    :param p5.Image img: A p5.image object, loaded using `loadImage()`. See example below for usage.
    :param object kwargs: A dict-object containing additional keyword args 

    .. js:method:: draw()

        Draw the image

    .. js:method:: draw_()

        Draw the image but statically

.. js:class:: pButton(x, y, w, h, kwargs)

    A composite object that replicates a clickable button. Internally creates a rectangle object (`this.rect`) and either a text or image object rendered within the rectangle. See methods below for details. Note that *pButton* objects are clickable by default, and don't need to have `toggleClickable()` run.

    :param number x: The x-coordinates of the button using current *positionMode*
    :param number y: The y-coordinates of the button using current *positionMode*
    :param number w: The width of the button using current *positionMode*
    :param number h: The height of the button using current *positionMode*
    :param object kwargs: An dict-object containing additional keyword args 

    .. js:method:: addImage(...)

    .. js:method:: addText(text, kwargs)

        :param string text: Text to be added to the button
        :param object kwargs: An dict-object containing additional keyword args. Includes as default `{textAlign: CENTER}.`
        
    .. js:method:: clickAnimation()
        
        TODO

    .. js:method:: draw()

        Render the button to the screen.

.. js:class:: Countdown(x, y, endtime, kwargs={})

    A countdown timer that allows a callback to be set for when time elapses, with the option to attach a countdown bar or circular timer.

    :param number x: The x-coordinates of the timer using current *positionMode*
    :param number y: The y-coordinates of the timer using current *positionMode*
    :param number endtime: The number of seconds after which the timer elapses.
    :param object kwargs: An dict-object containing additional keyword args 

    .. js:method:: setGraphic(graphic, params={})

        Sets the countdown graphic to either a circular arc that spans from 360deg to 0, or a progress bar. Also allows the user to extend and add their own graphic using p5.js.
        TODO: instructions on how to create custom graphic

        :param string graphic: A string denoting the type of graphic to be added. Allows `"arc"` for arc, `"bar"` for progress bar, and `"custom"`, which creates an object called `this.graphic`, where the user can extend the draw method.
        :param object params: Dict containing params for the graphic. Both arc and bar graphics require width (`w`) and height (`h`)

    .. js:method:: reset()

        Reset the timer. Also used to start the timer.

    .. js:method:: onTimeUp()

        Empty method that can be set to a callback for when the timer elapses. For example: ::

            content.timer.onTimeUp = () => {
                console.log("Time's up!")
                // Reset the timer, creating a loop
                content.timer.reset();
            }

    .. js:method:: pause()

        Pause the timer.