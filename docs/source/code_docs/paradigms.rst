Composite Classes
=================

Composite classes are ways of wrapping common, useful tools into a single package.
They typically handle 2 jobs:

    - *Logic*: Such as handling random number generation, packaging data, defining user interactions
    - *Graphics*: Creating visuals by combining primitives into one complete *draw* call.

Composites are designed to be extended by the user, so that they can customise exactly what they need 
without having to start from scratch.

Gridworld
---------

The gridworld class offers a collection of utilities for creating a 2-dimensional grid that can be 
populated by images, shapes, text, or any other Psychex object. It contains methods for accessing individual
cells by index or coords, and allows the experimenter to easily build in user-control by keyboard or mouse-click.

.. py:class:: Gridworld()