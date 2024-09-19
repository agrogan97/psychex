Document Object Model (DOM)
===========================

.. js:class:: DOM(x=0, y=0, id=undefined, kwargs={})

    Base class offering wrappers for interacting with the DOM. Specific element classes can inherit from this class and use methods such as `setId`, `setText`, `center`, `setPosition`, and more. See below for an exhaustive list.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string id: unique identifier. If *undefined*, will be set to randomly generated string
    :param object kwargs: styles and additional kwargs

    .. js:method:: setId(id)

        Sets the HTML id property of the element. This allows it to be accessed via `document.getElementById(id)` as you would with any ordinary DOM element.
        Can be read through the `getId()` method of this class. This is called automatically when an element is drawn, but can be used to update id.

        :param string id: Unique id of the element or *undefined*. If *undefined*, will be assigned a random string of length 8.
        :return: this object reference
        :rtype: object

    .. js:method:: getId(id)

        Read the id of the element

        :return: The element id
        :rtype: string

    .. js:method:: setText(t, append=false)

        Set the text value of the element. This directly edits the `innerHTML` property of the HTML element.
        This accepts HTML as an input. For instance, passing `Some <b>bold<\b> text` in would render 'bold' in bold.

        :param string t: New innerHTML of the element. Accepts HTML or rich text.
        :param boolean append: If true, append this to the existing innerHTML. If false, overwrite. Default = false.
        :return: this object reference
        :rtype: object

    .. js:method:: getText()

        Return the innerHTML of the element as a string.

        :return: The innerHTML content of the element, including HTML tags.
        :rtype: string

    .. js:method:: center()

        Center the element within its div. If it has no parent div, it will be placed centrally on the page.
        Note that updating the innerHTML won't recenter the element, this must be manually called afterwards.

        :return: this object reference
        :rtype: object

    .. js:method:: appendTo(parentObj, reposition=false)

        Make this element the child of the input parent. 
        This is performed at 2 levels: the DOM level, where the child element is set as the child of the parent element, and at a Psychex level, where references to each Psychex object are stored as `parent` and added to the list of `children`, respectively.
        Once an element is made into a child, its position becomes relative to the parent.

        :param object parentObj: The Psychex parent object that this object will be appended to. NB: this is not the DOM element, but the Psychex object.
        :param boolean reposition: If true, automatically reposition the child to make its stored position relative to the parent. If false, do nothing.
        :return: this object reference
        :rtype: object

    .. js:method:: setSize(width, height)

        Set the width and height of the element.
        Passing in a single value will edit just the width, and height is adjusted automatically to maintain the w/h ratio.
        Passing in integers for both width and height will manually set both values.
        Either value can be replaced with `AUTO`, a constant that keeps ratio the same.

        e.g: ::
    
            setSize(50, AUTO) // Sets width to 50 while autoing height
            setSize(100, 100) // Sets width to 100 and height to 100

        :param number width: Width value in pixels, or AUTO
        :param number height: Height value in pixels, or AUTO
        :return: this object reference
        :rtype: object

    .. js:method:: getSize()

        Return the size of the element as object `{width: w, height: h}`.

        :return: Width and height of the element
        :rtype: object with keys `width` and `height`.

    .. js:method:: setValue(value)

        Set the contents of the element's value parameter. Accepts HTML string as input.

        :param string value: The new value string
        :return: this object reference
        :rtype: object

    .. js:method:: getValue()

        Return the element's value.

        :return: the element's value
        :rtype: string

    .. js:method:: setPosition(x, y)

        Sets the current position of the element using the provided coordinates. Expects numerical `%` inputs.
        Unlike in the canvas objects, this will be anchored by the top-right-hand corner of the element.

        :param number x: The x-coordinate of the element in percentage
        :param number y: The y-coordinate of the element in percentage
        :return: this object reference
        :rtype: object

    .. js:method:: getPosition(asPixels=false)

        Return the current position of the element, either as % or in pixels

        :param boolean asPixels: If true, return in pixels, if false return in terms of %
        :return: The element coordinates with keys `x` and `y`
        :rtype: object

    .. js:method:: update(kwargs={})

        Set element CSS styling by passing in a styling object. Also allows width and height to be set through kwargs.
        Calls the `setId()` method to update ID on instantiation. For example, to instantiate some text: ::

            content.dom.styledText = new p(50, 60, "Some styled text", "styledText", {'color': 'blue'});

        :param object kwargs: Object mapping CSS properties to their values. Takes in standard CSS names as keys (must be strings).

    .. js:method:: mouseOver(callback)

        Set callback when mouse is over the element

        :param function callback: Callback to run
        :return: Callback return
        :rtype: any

    .. js:method:: mouseOut(callback)

        Set callback when mouse leaves the element

        :param function callback: Callback to run
        :return: Callback return
        :rtype: any

    .. js:method:: mouseMoved(callback)

        Set callback when mouse move is detected within the bounds of the element

        :param function callback: Callback to run
        :return: Callback return
        :rtype: any

    .. js:method:: mouseReleased(callback)

        Set callback when the mouse click is released on the element

        :param function callback: Callback to run
        :return: Callback return
        :rtype: any

    .. js:method:: mouseWheel(callback)

        Set callback when the mouse wheel is used on the element

        :param function callback: Callback to run
        :return: Callback return
        :rtype: any

    .. js:method:: show()

        Show the current element. If it is already showing, do nothing.

        :return: this object reference
        :rtype: object

    .. js:method:: hide()

        Hide the current element. If it is already hidden, do nothing.

        :return: this object reference
        :rtype: object

.. js:class:: Div(x, y, id=undefined, kwargs={})

    Create a new HTML <div> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

.. js:class:: p(x, y, value, id=undefined, kwargs={})

    Create a new HTML <p> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string value: The text content of the string. Accepts html and rich text.
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

.. js:class:: Input(x, y, value="", id=undefined, kwargs={})

    Create a new HTML <input> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string value: The starting value of the input. Can be set to "" to have an empty value.
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

    .. js:method:: onInput(callback)

        Provide a callback that runs when data is input to this element. This is reactive, and runs each time there is a change.

        :param function callback: A callback to be run on each input - i.e. each time a key is typed while the box is active.
        :return: Callback return
        :rtype: any

    .. js:method:: setPlaceholder(t)

        Set the placeholder text for the input (if applicable). For instance, in a text input, this might be the text shown on instantation before the user starts typing, and disappears when the input is interacted with.

        :param string t: The placeholder text
        :return: this object reference
        :rtype: object

    .. js:method:: getPlaceholder(t)

        Return the current placeholder text

        :return: the placeholder text
        :rtype: string

    .. js:method:: clear()

        Clear the value of the current input. Useful for when building forms.

        :return: this object reference
        :rtype: object

.. js:class:: Button(x, y, value, id=undefined, kwargs={})

    Create a new HTML <button> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string value: The text content of the button
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

    .. js:method:: onClick(callback)

        Pass a callback to be called when the button is clicked.
        Note that unlike Psychex canvas objects, this accepts a callback as the parameter, rather than being the callback itself.
        This is because we need to call the additional `mousePressed` method to update the callback in the DOM.

        :param function callback: The callback to run when a click is detected on the element
        :return: Callback return
        :rtype: any

.. js:class:: Slider(x, y, id=undefined, kwargs={})
    
    Create a new HTML <slider> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

    .. js:method:: setRange(min, max)

        Set the minimum and maximum values stored for the slider. This doesn't change the slider aesthetics, but will change the value returned when the slider is moved.

        :param number min: The lower-bound (LHS of the slider scale)
        :param number max: The upper-bound (RHS of the slider scale)
        :return: this object reference
        :rtype: object

    .. js:method:: setDefault(d)

        Set default (starting) value for the slider notch. E.g. if the range is set to [0, 1], then the midpoint would be 0.5.

        :param number d: notch default value
        :return: this object reference
        :rtype: object

    .. js:method:: onChange(callback)

        Register a callback that will fire continuously as the slider value is being changed. Useful if you need to make changes immediately responsive to input.

        :param function callback: The callback to run as the slider is continuously changed.
        :return: Callback return
        :rtype: any

    .. js:method:: onChangeEnd(callback)

        Register a callback that fires at the end of each slider interaction, i.e. after the slider has been moved, and the mouseclick released.

        :param function callback: Callback to run once the slider interaction is complete. Will run once.
        :return: Callback return
        :rtype: any

.. js:class:: A(x, y, url, text, id=undefined, kwargs={})

    Create a new anchor <a> element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string url: URL to redirect the window to
    :param string text: Text value for the hyperlink
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

    .. js:method:: setUrl(url)

        Update the redirect URL for this anchor tag

        :param string url: New URL for redirecting
        :return: this object reference
        :rtype: object

.. js:class:: Checkbox(x, y, id=undefined, label="", kwargs={})

    Create a new HTML checkbox element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string id: Unique identifier string for this element
    :param string label: Option to add a text label to the checkbox
    :param object kwargs: CSS styles for this element

    .. js:method:: isChecked()

        Return a boolean indicating if the chechbox is currently checked or not.

        :return: true if checked, false if not
        :rtype: boolean

    .. js:method:: onChange()

        Set a callback to run when a change (check or unchecked) is detected. Pair with the method `isChecked()` to run callback only when checked.

        :return: Callback return
        :rtype: any

.. js:class:: Select(x, y, id=undefined, kwargs={})

    Create a new select-style HTML input element.

    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element

.. js:class:: Element(x, y, el, value="", id=undefined, kwargs={})

    Create a new specified HTML element of any type, by naming the type. 
    For example, to create a new <h2> element:::

        content.dom.newEl = new Element(50, 10, "h2", "My Custom Heading", "h2el", {})
    
    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string el: The HTML element type, such as h3, h2, span, etc. 
    :param string value: The content of the HTML element
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element