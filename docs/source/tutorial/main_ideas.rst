Key Concepts in Psychex 
=======================

The following page introduces the main components available in Psychex. There are 2 types of element in Psychex:

- Canvas elements
- DOM elements

See below for more details on each.

Canvas Elements
---------------

Canvas elements are built upon the HTML canvas API. Think of these elements in exactly this way: like shapes painted onto a canvas.
The underlying technology here means whatever is drawn can be removed and redrawn many times per second, allowing us to create animations
and dynamic content in the browser.

This API also gives us greater power when it comes to positioning content on the page. Like a blank canvas, elements can be placed by specifying
their exact position - no more trying to remember how to centre elements in a *div*!

Psychex aims to be customisable, while having a strong base of standard classes and utilities to build upon.
The main building block in Psychex is the *Primitive*.

A primitive is a single, simple object, such as a gemoetric shape (eg. a rectangle, circle, or line), an image, or some text.
All primitives come with the same set of base classes, such as click listeners, and tools to edit styles. They can all be positioned 
and drawn in the same way. 

Primitives may be combined together to form more complex units. These more complex units provided within Psychex are typically referred to as either:

    - *Compounds*: utilities, or grouped objects that perform a wider function together
    - *Paradigms*: A common experimental paradigm or structure containing logic for that experiment, and with options for drawable components

For instance, the Psychex class ``NArmBandit`` contains some standard logic for instantiating an N-Arm bandit task, and can have drawable objects 
added to it to render out each of the *arms*. This is an example of *paradigm* made up of *primitives* plus background logic.

We also have a handful of other *utility* classes that contain common patterns. For instance, the ``Game`` class has methods for loading and saving data
from a range of sources, such as via *HTTP* or using a tool like *JATOS*, and the *Fullscreen* class handles rules for keeping the game in fullscreen, with callbacks
for when a player leaves early.

DOM Elements
------------

Psychex also exposes DOM elements - classic HTML elements that you may be familiar with, such as <h1> (heading text), <a> (anchors for redirecting), or <div> (divs for grouping content).
These can be created and styled in an easy and familiar way, and use similar syntax to canvas elements.

As a result, it's easy to incorporate subjective data forms, attention checks, debrief forms, and any other typical HTML elements you might need alongside your game,
keeping all the data together and under the same framework.

Aesthetics
----------

Psychex uses *aesthetics* objects to control styling. Aesthetics are simply design choices applied to primitives.
This might include things like background colour, text-size, or font-family. Aesthetics can be applied on a global level by setting default values to
different primitive types, or by setting styles in-line.

For more details on aesthetics, see :doc:`aesthetics`.

User-Interaction
----------------

Users may interact with the game through mouse-clicks, key-presses, or via touches on a touch-screen.

Clicks and touches work in the same way, and Psychex will auto-detect which type is being used. This type of interaction is attached to specific elements - 
this might be a specific primitive, or a compound object. Similar to JavaScript 'click' event listeners, they respond to an interaction with the specified element
by running a callback function.

Key-presses are handled by registering events tied to each key with the Psychex key-press register. Key-press events aren't tied to any particular primitive or other object,
and simply run a callback function whenever a specific key-press is detected.

DOM elements have access to all the usual JS events, including hover, mouse-wheel interactions, etc. 

For more information and tutorials on user-interactions, see the dedicated page of the docs. :doc:`interactions`.

Feature Requests
----------------

Psychex is open-source, and contributions from the community are welcome. Similarly, if you feel a particular feature, function, or experiment paradigm 
would make a valuable addition to Psychex but can't write it yourself, feel free to submit a feature request on our Github page.