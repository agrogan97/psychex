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

.. py:class:: Gridworld(x, y, w, h, nRows, nCols, align="CORNER", kwargs={})

    Gridworld class that defines a 2-D matrix of pRectangle objects.

    :param number x: The x-coordinate of the anchor point, specified by the value of *align*
    :param number y: The y-coordinate of the anchor point, specified by the value of *align*
    :param number w: The width of the grid
    :param number h: The height of the grid
    :param number nRows: The number of rows in the grid as an integer
    :param number nCols: The number of columns of the grid as an integer
    :param string align: Specifies where the anchor point of the grid is. If "CORNER", the *(x, y)* specified will be in the top-left corner of the grid. If "CENTER", the *(x, y)* will be the center. Default is "CORNER".
    :param object kwargs={}: An dict-object containing additional keyword args

    .. py:method:: getWidth()

        Returns the width value originally supplied to the constructor.

        :return: width
        :rtype: number

    .. py:method:: getHeight()

        Returns the height value originally supplied to the constructor.

        :return: height
        :rtype: number

    .. py:method:: setWidth(w)

        Update the width of the grid. If called, must be followed by calling *drawOutline* to update.

        :param number w: The new width of the grid

    .. py:method:: setHeight(h)

        Update the height of the grid. If called, must be followed by calling *drawOutline* to update.

        :param number h: The new height of the grid

    .. py:method:: drawOutline()

        Takes the provided x, y, w, h, nRows, nCols, and constructs a grid of pRectangle objects. Each of these objects is stored in
        an array called ``cells``. Each *cell* is an object containing an index, *ix*, the coords *coords*, and a reference to the pRectangle object, *obj*.
        The array can be indexed directly, or a reference directly to the pRectangle can be obtained from *getCell*.
        Each of these can be acted upon like normal pRectangles, and methods such as *update* or *onClick* can be applied.

        :return: this

    .. py:method:: getCell(id)

        Returns a reference to a cell's pRectangle object. This object contains all normal pRectangle attributes, as well as copies of 
        the *ix* and *coords* gridworld properties. The cell can be referenced by either grid index (*ix*) (*0 -> (nRows*nCols - 1)*), or by 
        coords (*[0, 0] -> [nRows-1, nCols-1]*). Indexing **always** begins at 0.

        :param number/Array id: A unique identifier for the cell, either the grid index, or grid coords. Indexing begins at 0.
        :return: cell reference
        :rtype: Object
    
    .. py:method:: setCellProps(id, props)

        Update the aesthetic properties of a cell (eg. backgroundColor, borderWidth, etc.)

        :param number/Array id: A unique identifier for the cell, either the grid index or grid coords. Indexing begins at 0.
        :param props: A dict-object containing the usual allowed aesthetics properties for a *pRectangle*
        :return: A ref to the edited cell 
        :rtype: Object

    .. py:method:: indexToCoords(ix)

        Convert grid index to the equivalent coordinates using the values of *nRows* and *nCols* provided to the constructor.

        :param number ix: A grid index (*0 -> (nRows*nCols -1)*) to be converted to coords.
        :return: The equivalent coords
        :rtype: Array

    .. py:method:: coordsToIndex(coords)

        :param Array coords: An array of coordinates (*[0, 0] -> [nRows-1, nCols-1]*) to be converted to the equivalent index.
        :return: The equivalent index
        :rtype: number

    .. py:method:: toggleClickable()

        **NB:** Not directly equivalent to calling ``toggleClickable()`` on a primitive - this runs ``toggleClickable()`` on every cell
        in the grid iteratively, adding them all to *clickables*. Useful as a precursor for applying a single *onClick* to every cell.

    .. py:method:: onCellClick(id, callback)

        Wrapper for attaching a click listener to a single cell by providing its grid index or grid coords.

        .. warning::  
            
            This method runs ``toggleClickable`` automatically, so you don't need to run it beforehand! If you do, the two calls will cancel
            eachother out.

        :param number/Array id: A unique identifier for the cell, either the grid index or grid coords.
        :param function callback: A callback that will run when the particular cell is clicked.
        :return: A reference to the clicked-on cell.
        :rtype: Object

    .. py:method:: addOverlay(name, cellId, overlayObj)

        There are 2 layers in the gridworld visuals: the base *pRectangle* layer, and the *overlay* layer. Overlays are objects placed on top of 
        the base grid, and are typically the stimuli presented to the participant. These can be any kind of psychex object - or, a custom object 
        created from scratch if you wish to create a new object using *p5.js* draw calls.

        :param string name: A unique name for the overlay. This can be useful for referencing it later, for instance if using an image that represents a player token, and naming it "player".
        :param number/Array cellId: The id of the cell onto which the object is overlaid. Objects are placed within cells so that they're automatically aligned.
        :param object overlayObj: A reference to the object being overlayed. This can be a pre-defined object, or a new object can be created in the function call. This would typically be another psychex object, such as *pImage* or *pCircle* for example.

    .. py:method:: updateOverlay(id, updateParams)

        Update the aesthetics for the specified overlay. Similar to calling ``update`` on the object, but offers a wrapper that handles index/coords as input.

        :param number/Array id: A unique identifier for the overlay, either the name provided on instantiation, or grid index or grid coords of the cell containing the overlay.
        :param Object updateParams: A dict-object of aesthetics to apply to the overlay. Must map the typical values for that object type.
        :return: A reference to the edited overlay
        :rtype: Object

    .. py:method:: getOverlay(id)

        Get a reference to a specific overlay from its id, either the name provided on instantiation, or the index/coords of the cell containing the overlay.

        :param number/Array id: A unique identifier for the overlay, either the name provided on instantiation, or grid index or grid coords of the cell containing the overlay.
        :return: A reference to the edited overlay
        :rtype: Object

    .. py:method:: clearAllOverlays()

        Remove all existing overlays from the grid, and delete all references to them.

    .. py:method:: removeOverlay(id)

        Remove a single overlay, or all overlays from a single cell, depending on input provided.

        :param number/Array id: A unique identifier for the overlay, either the name provided on instantiation, or grid index or grid coords of the cell containing the overlay.

    .. py:method:: handleMovement(mode, preMovementCallback = () => {}, postMovementCallback = () => {})

        Handle user-interactions with the gridworld. Wraps functionality for player movement with keyboard arrow-keys, or with the 'w-a-s-d' keys. Also includes options for mouse-click
        interactions. This method takes in 2 callbacks: the first may be applied *pre-movement*, such as for handling logic as to whether or not this movement is allowed (e.g. if building a maze,
        there may be obstacles/wall boundaries to consider, etc.). The second is a *postMovement* callback, applied if and only if the *preMovementCallback* runs successfully and returns *true*.
        This might handle logic for after the player has moved, or after any other user interaction. Both callbacks contain default empty functions, meaning if a pre-movement function isn't needed, 
        the user may simply pass a single callback in which will be used upon specification.

        :param string mode: The interaction-mode to be applied. One of either "arrows" (for arrow-keys), "wasd" (for w-a-s-d keys), or "click" (for mouse-clicks.)
        :param function preMovementCallback: The first callback run on player interaction. Must return *true* for the second callback to proceed. Default ``() => {}``.
        :param function postMovementCallback: The second callback run after successful calling of the first. Default ``() => {}``.

    .. py:method:: checkBounds(pos, k)

        Utility for automatically checking gridworld outer boundaries when building a world that the player moves through. Contains key-mappings of the arrow and w-a-s-d keys
        and returns a boolean for if the proposed movement is within or out of bounds.

        :param Array pos: The current position (eg. at time *t*), to be compared with the proposed new position, after movement (eg. at time *t+1*). Must be grid coords - indices can be converted using ``indexToCoords()``.
        :param string k: The key-code of the pressed key. Accepts "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d". Each of these is mapped to the vector-equivalent of the movement.
        :return: A dict containing 2 values: *allowed* a boolean for an allowed movement (true) or not, and *pos* the coordinates of the new position after the movement, regardless of it allowed or not.
        :rtype: Object

    .. py:method:: draw()
        
        The draw call that renders all the *pRectangles* in the grid, and all overlays.


