Handling User Interactions
==========================

A user can interact with the experiment via mouse-clicks or keyboard key-presses. The following describes
how to register functions based on input type.

Mouse-Click Events
------------------

All primitives in Psychex can be turned into clickable objects. Being made *clickable* is turned on and off, 
so performance is optimised by reducing the amount of work the browser has to do. A primitive can be made clickable by running the ``toggleClickable`` method: ::

    someRectangle = new pRectangle(50, 50, 10, 10);
    someRectangle.toggleClickable();

We can run it again to turn off the click listener for this object.

Functionality can be attached to this click event using the ``onClick`` method that comes with primitives: ::

    someRectangle.onClick = (e) => {
        console.log(`Clicked on a primitive of type ${e.type}`);
    }   

The method has access to the clicked-on object via the first parameter. For instance, to change properties on click: ::

    someText.toggleClickable();
    someText.onClick = (e) => {
        e.update({textColor: 'blue', textSize: 32});
    }

Or, to make something clickable for one-use only: ::

    someCircle.toggleClickable();
    someCircle.onClick = (e) => {
        e.update({backgroundColor: 'red'});
        e.toggleClickable();
    }

Key-Press Events
----------------

Key-presses work slightly differently to click events, as they aren't tied to specific primitives.
Instead, key-presses are registered with psychex, which continuously listens and calls a function when it 
detects a press.

An event can be registered through the module ``psychex.keyPressEvents.register``, by providing a key code, and a callback
that triggers on press. For example: ::

    // Tell Psychex to listen for the left arrow key being pressed

    psychex.keyPressEvents.register('arrowLeft', () => {
        console.log(`Clicked on ${key}`)
    })

Here we use the keyword ``key``. This is a global variable that tracks the most recently pressed key, and stores it's keycode.

Key Codes
^^^^^^^^^

To register a key-press listener, you need to know the key's key code. In most cases, such as with alphanumerics, 
the key code is just the name of the key (eg. a == 'a', 5 == '5'). To check, you can use the a `key-code checker <https://www.toptal.com/developers/keycode>`_, making sure 
to use the `event.key` option.

Updating and Clearing Key-Press Events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For obvious reasons, only one callback can be attached to a key-press at a time. You can update the callback
by simply calling the register function again, passing in the same key. For example: ::

    psychex.keyPressEvents.register('arrowUp', () => {
        console.log(`The first time the up arrow is pressed`);
    })

    // Call again to re-register
    psychex.keyPressEvents.register('arrowUp', () => {
        console.log(`The second time the up arrow is pressed`);
    })

    // Now, pressing the up arrow will only call the second callback

All previously registered key-press events can be cleared by calling the attached *clear* function: ::

    psychex.keyPressEvents.clear();

.. note::

    p5.js offers some other raw functionality for handling key-press and click events, which you may find useful
    if you wish to extend Psychex base functionality - we recommend taking a deeper look into their docs if you're interested.
    You can also use standard JS event listeners for detecting key-presses too.