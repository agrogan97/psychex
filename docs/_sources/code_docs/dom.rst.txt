Document Object Model (DOM)
===========================

Psychex offers classes to interact with the DOM, allowing you to build HTML elements alongside your canvas elements!
This helps contain all your needs within the Psychex framework, and can be used to incorporate forms, and questionnaires into your
experiments.

This page contains tutorials showing how to create a Psychex form. Further down the page are the details on the methods available for each of
the classes.

Create a Custom Form - Tutorial
-------------------------------

The following tutorial shows how you can build a custom form from scratch, using Psychex versions of normal HTML elements.

The purpose of this tutorial is to show how you can define, position, and style different elements using Psychex. The final form you'll
produce is perfectly usable for an experiment - but may have some limitations if you wanted something more complex. 

By the end of the tutorial, you'll be able to confidently use elements like checkboxes, sliders, text, and input fields to get data from users.

This can be extremely useful for implementing attention checks, inter-round feedback, or quick responses when using a mixture of canvas and DOM elements,
without having to redirect to a new page, or go through complex positioning in your HTML.

Start by downloading the `starter_kit` folder from the Github repo. Open up the entrypoint file: `static/js/main.js`.
This contains definitions of the core functions you need to get started.

The first thing we'll do is define a custom form class. Define this at the bottom of the page:

.. code-block:: javascript

    class MyTutorialForm{
        constructor(x, y){
            
        }
    }

This takes coordinates `x` and `y` as input.

Psychex DOM elements work in a different way to canvas elements, in that they don't need to be redrawn
continuously in an animation loop - **they only need to be drawn once**. This means that when we define a new element,
it is registered in the DOM, and kept on the page permanently (unless manually removed).

Let's start by defining a new *div*, and placing a *heading* and *subheading* inside it. We'll make the headings *children* 
of the *div*, so that they're positioned relative to its position. This is exactly the same as if we were writing pure HTML, and we nested
*<h1>* elements inside a *<div>* element. Inside the constructor of your new class, add the following:

.. code-block:: javascript

    // Create a new div element
    this.div = new Div(x, y, "formDiv", {'width': '50%', 'height': '75%', 'background-color': 'lightblue'});
    // Create a new empty element, and set it to be an <h2> - then append it to the div
    this.heading = new DomElement(50, 5, "h2", "New Data Form", "h2el")
        .appendTo(this.div, true);
    // Create a new empty element, set it to be an <h3> - and append it to the div
    this.subheading = new DomElement(50, 12.5, "h3", "Please answer the following questions:", "h3el")
        .appendTo(this.div, true);

Here, we start by defining a `Div` class, setting its position at `x`, `y`, giving it an `id` of 'formDiv', and passing in some styles.
Next, we create a new empty element, tell Psychex we'd like it to be an `h2` element, set the text value, and set the ID.
We then chain the method `appendTo` onto the end, where the first parameter is the target parent element (the div), and the second asks
if we want to reposition it relative to the parent - which we do. This means that as `x = 50`, the heading text will be placed `50%` along
the width of the div, *not* the width of the screen. This system makes Psychex DOM positioning much more flexible than regular HTML positioning.

Note that this code block above is the same as if we wrote:

.. code-block:: HTML

    <div id="formDiv" style="width: 50%; height: 75%; background-color: lightblue;">
        <h2 id="h2el">New Data Form</h2>
        <h3 id="h3el">Please answer the following questions:</h3>
    </div>

We could manually define form fields, inputs, labels, etc. right here in the constructor, but we'd like a more principled, organised
way of doing this - in particular, one that will help us reuse this class in the future.

.. note::

    The idea of writing classes once and reusing them in future work is often referred to as **DRY** coding: **Don't Repeat Yourself**!
    Time is valuable in research - do yourself a favour, and write good, clean code.

Define a class method for creating a text input, and start by creating a div to store it in. We want to be able to index any new fields we add,
so we'll include position and ID in the parameters:

.. code-block:: javascript

    newTextField(x, y, id, labelText){
        // Create a new object inside a class variable called formFields
        this.formFields[id] = {}
        this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
            .appendTo(this.div, true);
    }

and inside the constructor, define the object we've referenced here for storing form fields:

.. code-block:: javascript

    this.formFields = {};

In the new div definition, we've set the id to be `${id}_div`. This is a dynamic string that will insert the value of the variable 
`id` we pass into the method, into the string we use for the id. For example, if we set the field id to be `myField`, then the div will
have the id `myField_div`. 

We're also assigning styles in a very similar way to canvas elements, using an `aesthetics` (or `kwargs`) object. However, instead of using Psychex styling names,
we're using *CSS* names. Often these are similar, but it's worth checking what the keys are on something like `MDN <https://developer.mozilla.org/en-US/docs/Web/CSS>`_.
Here, we're setting the `background-color` property to inherit from the parent, and we're defining the width and height of the div.

Let's add a new label to the form field, using the `p` class:

.. code-block:: javascript

    this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
        .setAlignment('left')
        .appendTo(this.formFields[id].div, true);

And finally, a text input box, using the `Input` class:

.. code-block:: javascript

    this.formFields[id].field = new Input(50, 0, "", `${id}_input`, {'align' : 'left', 'width': '45%', 'height': '50%'})
        .setAlignment('left')
        .appendTo(this.formFields[id].div, true)
        .setPlaceHolder("Enter ID here");

This creates some text, positioned horizontally adjacent to a textbox input field. We've set the placeholder value, and attached both to the form field parent div.
For more details, look further down this page at the class documentation.

Let's call this within the constructor to add the text field to our form: 

.. code-block:: javascript

    // ... preamble ...

    this.newTextField(0, 20, 'f1', 'Enter ID:')

And instantiate your new form in the main `setup()` block:

.. code-block:: javascript

    content.dom = {};
    content.dom.myForm = new MyTutorialForm(25, 5);

Remember, this only needs to be written once in setup, and **not** within draw!

Now we have a reusable method to add input fields, you can add as many as you'd like, and save the functionality for future use.
You can also play around with styling and spacing to optimise how the form looks.

Next, let's add some different input types. We'll start with a checkbox, using the `Checkbox` class. Create a new method and add a div and label as previously: 

.. code-block:: javascript

    newCheckboxField(x, y, id, labelText){
        this.formFields[id] = {}
        this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
            .appendTo(this.div, true);
        this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
            .setAlignment('left')
            .appendTo(this.formFields[id].div, true);
    }

This is very similar to the text input field we previously created. Next, we'll define a new checkbox:

.. code-block:: javascript

    this.formFields[id].field = new Checkbox(51, 40, `${id}_input`, undefined, {'align' : 'center', 'margin-left' : '5px', 'transform': 'scale(2)', 'border':'0.5px'})
        .appendTo(this.formFields[id].div, true);

Finally, add this to the constructor so you can see your new checkbox:

.. code-block:: javascript

    this.newCheckboxField(0, 32.5, 'f2', "Are you enjoying Psychex?");

Now, let's add in a `Slider` element. These can be useful when asking for ratings of quantities like enjoyment or confidence, for example.
Create a new class as previously, and define a div and a label:

.. code-block:: javascript

    newSliderField(x, y, id, labelText){
        this.formFields[id] = {}
        this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
            .appendTo(this.div, true);
        this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
            .setAlignment('left')
            .appendTo(this.formFields[id].div, true);
    }

Now, within the same function block, we can define a new slider. We'll set the range to be between *0* and *1*, with
a default value of *0*. Feel free to try out different values here to see for yourself what the result is.

.. code-block:: javascript

    this.formFields[id].field = new Slider(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
        .appendTo(this.formFields[id].div, true)
        .setRange(0, 1)
        .setDefault(0);

And add it to the constructor:

.. code-block:: javascript

    this.newSliderField(0, 45, 'f3', "How much?");

Lastly, we'll create a `Select` element. This is essentially a drop-down menu that lets the player choose from a set of options.
Create a new select class, and add a div and label:

.. code-block:: javascript

    newSelectField(x, y, id, labelText){
        this.formFields[id] = {}
        this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
            .appendTo(this.div, true);
        this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
            .setAlignment('left')
            .appendTo(this.formFields[id].div, true);
    }

And define the select element:

.. code-block:: javascript

    this.formFields[id].field = new Select(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
        .appendTo(this.formFields[id].div, true);

Before we move on, we need to add some options to the menu. We can do this with the `Select` class' `addOption()` method.
Add a new parameter to the `newSelectField` method, called `selectOptions`, as such: ::

.. code-block:: javascript

    newSelectField(x, y, id, labelText, selectOptions=[]){
        // ...

where we've set a default value as an empty list. After defining our `select` element, add the following piece of code, which
will loop over the selectOptions we provide, and call `addOption` on each:

.. code-block:: javascript

    selectOptions.forEach(opt => {
            this.formFields[id].field.addOption(opt);
        })

And add this field in within the constructor:

.. code-block:: javascript

        this.newSelectField(0, 55, 'f4', "Choose an option:",
             ["Psychex is great", "Psychex is amazing", "Psychex will really help my research", "Psychex is bad"]);

Obviously, we won't need the user to ever select the last option in that list, so we can disable it:

.. code-block:: javascript

    this.formFields.f4.field.disableOption('Psychex is bad');

Now we need a submit button to act upon the data entered into the form fields. We can either use the default styling for this button, or define a styling object.
Separating out styling definitions into a separate object can help make code more organised. 
Within the constructor, add the following:

.. code-block:: javascript

    const btnStyles = {
            'background-color': '#008CBA', 
            'border': 'none',
            'color': 'white',
            'padding': '15px 32px',
            'text-align': 'center',
            'text-decoration': 'none',
            'display': 'inline-block',
            'font-size': '16px',
            'box-shadow': '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        };

    // Define the button
    this.submitBtn = new Button(50, 90, "Submit", "formSubmitBtn", btnStyles)
        .appendTo(this.div, true);

The final step is to define the functionality when the submit button is clicked. This will involve gathering the
input data from each form field into a single object, and saving it somewhere.
You can attach a click listener to the `Button` class (and all other pDOM classes) using `onClick`, similar to with canvas objects.
The only difference here is that in *DOM* elements, `onClick` takes the callback as a function parameter, whereas in *canvas* elements it is overwritten.

Set the onClick callback in the class constructor:

.. code-block:: javascript

    this.submitBtn.onClick(() => {

    })

We can loop over the `formFields` object and access each `field`. These classes have `getValue()` methods to return the value
entered by the user. We can aggregate these into a single object:

.. code-block:: javascript

    this.submitBtn.onClick(() => {
        let data = {};
        Object.keys(this.formFields).forEach(f => {
            data[f] = this.formFields[f].field.getValue();
            this.formFields[f].field.clear();
        });
        console.log(`Saved data: ${data}`);
    })

If you open up the developer tools and look at the console, you'll see the form data displayed.

What you want to do with the data now depends on your setup. For instance, if you were hosting your experiment on JATOS,
you might then call `Game.saveDataToJatos(data)`, and the data would be available through your interface within the current component.
If you were running an ExpressJS server, you could use `Game.saveDataToServer(data)`, (+ your endpoint), which would send a POST request
to the server where the data would be handled and saved to a file, added to a database, or whatever else you may need.

Now, you have a working form! You may be thinking that this seems like an excessive amount of code for a form - it probably is. There are a few ways
that this can be shrunk down and made more efficient, by reusing common structures (div + label), etc.

As an exercise, consider going through and playing around with making the code more compact and efficient, and changing the styling, display,
and aesthetics.

Code Documentation
------------------

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

    .. js:method:: getSize(asPercentage=false)

        Return the size of the element as object `{width: w, height: h}`.

        :param boolean asPercentage: If true, return the value as a % of canvas size. if false, return as pixels.
        :return: Width and height of thxe element
        :rtype: object with keys `x` and `y`.

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

.. js:class:: DomElement(x, y, el, value="", id=undefined, kwargs={})

    Create a new specified HTML element of any type, by naming the type. 
    For example, to create a new <h2> element:::

        content.dom.newEl = new DomElement(50, 10, "h2", "My Custom Heading", "h2el", {})
    
    :param number x: Horizontal position of the element
    :param number y: Vertical position of the element
    :param string el: The HTML element type, such as h3, h2, span, etc. 
    :param string value: The content of the HTML element
    :param string id: Unique identifier string for this element
    :param object kwargs: CSS styles for this element