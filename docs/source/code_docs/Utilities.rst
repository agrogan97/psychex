Meta-Classes, Utilities, and Support Classes
============================================

Things like Game, Utils, any comms with server stuff

Fullscreen Mode
---------------

In many games, you may wish to enforce that the user is in fullscreen mode to minimise the chance of cheating or distractions.

Psychex offers a class that supports this and offers some helpful functionality.

.. py:class:: Fullscreen()

    A wrapper providing various methods used to handle fullscreen behaviour.

    .. py:method:: beforeFullscreen(callback)

        In order to turn the window into fullscreen mode, the user must agree by interacting (such as via a click).
        This method sets up the functionality to listen for a user click and launch fullscreen mode. It also takes 
        a callback from the user to run additional functionality - such as instructions to render some text explaining
        that the user needs to click. ::

            // Render some text explaining that the user can click to launch fullscreen
            var fs = new Fullscreen();
            fs.beforeFullscreen(() => {
                // This uses the pText static method, so no need to instantiate the text object in advance
                pText.draw_("The game must be played in fullscreen. Click anywhere to launch.", 50, 50, {textSize: 42});
            })

        :param function callback: A user-defined callback that will be run before the player clicks to launch fullscreen. Will run every draw loop until fullscreen is launched. Default returns an empty function.

    .. py:method:: onFullscreenExit()

        Method that is run once every draw loop when the user exits fullscreen mode. This method is **empty** and can be overwritten by the user. May be used to redirect to a new window, call a save method, etc. ::

            // Using a previously defined fullscreen instance called fs
            fs.onFullscreenExit = () => {
                pText.draw_("Fullscreen exit detected.", 50, 50, {textSize: 34})
                // or perhaps some code to redirect the user
            }

    .. py:method:: detect()

        Logic that handles continuos fullscreen method detection. Once `beforeFullscreen()` detects fullscreen-launch, this method is run continuously until fullscreen mode is no longer detected. Updates the class attribute `isFullScreen`.
        Once isFullScreen = false, the class `draw` method is replaced with `onFullscreenExit()`, which may be defined by the user.

    .. py:method:: draw()

        A wrapper that runs one of 3 other methods: `beforeFullscreen` (before the user clicks to launch fullscreen), `detect` (loop that checks if the user is in fullscreen), and `onFullscreenExit` (that loops when fullscreen is exited).
        This method is called in the global `draw` loop, just like any other renderable. For example: ::

            function draw(){

                fullscreenMode.draw();

                // other drawables ...
                // eg. text.draw()
                // eg. rect.draw()
                // ... etc.
            }


Example
^^^^^^^

The following is an example of how fullscreen mode can be fully implemented into a game. The flow here needs to work as follows:
    #. Tell the user they need to click to enter fullscreen mode, and wait for the click.
    #. Launch fullscreen.
    #. Render the game content as normal, and listen for if the player leaves fullscreen.
    #. Tell the user the game has detected they've left fullscreen.

::

    // NB: `fullscreen` is protected by p5, and can't be used as a variable name
    var fs = new Fullscreen()

    function setup(){
        // ... Setup preamble ... //
        // ... some game objects etc. ///
        // ... //

        // NB: that beforeFullscreen takes a callback, so it can handle other background logic
        fs.beforeFullscreen(() => {
            pText.draw_("The game must be played in fullscreen. Click anywhere to launch.", 50, 50, {textSize: 42});
            return true;
        })

        // declare func to run when the user leaves fullscreeen
        fs.onFullscreenExit = () => {
            pText.draw_("Fullscreen exit detected.", 50, 50, {textSize: 34})
            return true;
        }

    }

    function draw(){
        clear();

        // We return true from our pre- and post- fullscreen methods, so we can use that to block any other renders
        // While in fullscreen, draw just returns undefined

        let block = fs.draw();
        if (a) {return}

        // ... draw other content as normal ... //
    }

Utilities
---------

.. py:class:: Utils()

    A utilities class containing predominantly static methods for useful tasks and tools.

    .. py:method:: getUrlParams(searchParams=[], url=undefined)

        Static method that reads the contents of a URL and return any parameters included in the string. If no URl is provided to the 
        input parameter *url*, the URL of the current window will be used. This can also be used to search for specific 
        params by including them in the array *searchParams*.

        :param Array[string] searchParams: *Optional* An array of parameters to search for. Including this will return only the specified parameters.
        :param string url: *Optional* The URL to use for the search. If one isn't provided, the current window URL is used.
        :return: A dict-object mapping URL-Param key to value
        :rtype: Object

Game Manager
------------

.. py:class:: Game()

    Game-manager class. Contains a range of function used throughout the lifecycle of the game, including data and state management, 
    saving and loading methods, and playerId management. 

    .. py:method:: saveDataToServer(data, url='api/save/')

        Asynchronous function that saves data to an *HTTP* server via *POST* and returns a Promise.

        :param Object data: The data object to be saved to the server. This data will be prepared for sending within this function call using ``JSON.stringify``.
        :param string url: The endpoint URL that the data will be saved to, such as the address on an external server.
        :return: The promise of a response from the target endpoint.
        :rtype: Promise

        ::

            // Example Usage //

            let myGame = new Game();
            let res = myGame.saveDataToServer({someData}: [1, 2, 3, 4, 5]}, "https://myAPIServer/api/save/")
            // etc TODO finish

    .. py:method:: loadDataFromServer(url='api/load/', data={},)

        Asynchronous function that requests data from an *HTTP* server via *GET* and returns a Promise.

        :param string url: The URL of the endpoint that the data's is being requested from.
        :param Object data: Any body content to be included in the GET request to the server. For instance, playerID, levelID etc. Any data passed will have ``JSON.stringify`` applied before being sent.
        :return: The promise of a response from the target endpoint.
        :rtype: Promise

        ::

            // Example Usage //

            let myGame = new Game();
            let res = myGame.loadDataFromServer("https://myAPIServer/api/load/")
            // etc TODO finish

