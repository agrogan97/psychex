Handling Static Content
=======================

Static content is loaded within the `preload()` function. Static content is typically stored within a global variable object called `assets`, but this is optional.

Images
------

Images are loaded within *preload* as:

.. code-block:: javascript

    function preload(){
        assets.imgs["image1"] = loadImage("path/to/image1.png");
    }

To use this image, load it into a *pImage*, as such: 

.. code-block:: javascript

    let img1 = new pImage(x, y, assets.imgs.image1);

See the *pImage* docs for details on using this class. loadImage can also be used to load gifs.

Fonts
-----

Fonts are loaded within *preload* as: 

.. code-block:: javascript

    function preload(){
        assets.fonts["font1"] = loadImage("path/to/font1.ttf")
    }

To use the font, add it to the `aesthetics` object on a pText object: 

.. code-block:: javascript

    let newText = new pText("My new text", x, y, {"fontFamily" : assets.fonts.font1});

For details on aesthetics, see :doc:`aesthetics`. You can download fonts (*.ttf* files) from somewhere like `Google fonts <https://fonts.google.com/>`_ .

Other
-----

Other datatypes can be loaded in this way:

- JSON via *loadJson()*
- XML via *loadXML()*
- Files via *loadBytes()*

For more details, see the p5.js documentation.