Handling Static Content
=======================

Static content is loaded within the p5.js `preload()` function. It's typically stored within the object `assets`, but this is optional.

Images
------

Images are loaded within *preload* as: ::

    function preload(){
        assets.imgs["image1"] = loadImage("path/to/image1.png");
    }

To use this image, load it into a *pImage*, as such: ::

    let img1 = new pImage(x, y, assets.imgs.image1);

See the *pImage* docs for details on using this class. loadImage can also be used to load gifs.

Fonts
-----

Fonts are loaded within *preload* as: ::

    function preload(){
        assets.fonts["font1"] = loadImage("path/to/font1.ttf")
    }

To use the font, add it to the `aesthetics` object on a pText object: ::

    let newText = new pText("My new text", x, y, {"fontFamily" : assets.fonts.font1});

For details on aesthetics, see :doc:`aesthetics`.

Other
-----

Other datatypes can be loaded in this way:

- JSON via *loadJson()*
- XML via *loadXML()*
- Files via *loadBytes()*

For more details, see the p5.js documentation.