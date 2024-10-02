JavaScript - Important Concepts
===============================

ES6
___

ES6, or ECMAScript 2015, is a revision to the JavaScript language made in 2015 and introduced many new features.
Essentially, it can be thought of broadly as *modern JavaScript*.

Psychex uses ES6 patterns extensively throughout the core code and the tutorials, and it's important to understand
some of the ideas. Being able to use these patterns can greatly improve your code, helping you write cleaner code faster.

Scoping
*******

Variables can be declared using `let` and `const`. `const` describes an unchanging (immutable) variable.
`let` describes a variable with a value limited to within the block it's defined. For example:

.. code-block:: JavaScript

    const name = "alex";
    let age = 150;

Arrow-Functions
***************

These are short and concise ways of writing functions. Importantly, they inherit the value of `this` from the context they're defined in.
For example, if defined within a wider function, `this` will refer to the wider function. As a result, they're convenient for defining callbacks.

.. code-block:: JavaScript

    const add = (a, b) => {a + b};

Template Literals
*****************

This is a convenient way of embedding variables into strings (just like f-strings in Python, for example). They're defined using
backticks ('`'), and variables are defined within blocks wrapped in '${}'. For example:

.. code-block:: JavaScript

    let library = "Psychex";
    console.log(`My research is really efficient, because I use ${library}`);

Destructuring
*************

If you have an object made up several values, destructuring allows you to seperate the object into individual variables.
This works for both arrays and objects. For example:

.. code-block:: JavaScript

    // Array destructuring
    const [a, b] = [1, 2];

    // Object destructuring
    const person = { name: 'Alex', age: 625};
    const { name, age } = person; // name = 'Alex', age = 625

Rest and Spread
***************

The spread operator expands an array or object into its individual elements. E.g.:

.. code-block:: JavaScript

    const myArray = [1, 2, 3];
    const newArray = [...myArray, 4, 5];
    // newArray = [1, 2, 3, 4, 5];

Similarly, the rest operator collects multiple elements into a single array or object:

.. code-block:: JavaScript

    function sumNumbers(...numbers){
        return numbers.reduce((a, b) => a + b, 0);
    }

Classes
*******

The introduction of classes (over the previous prototyping system in JS) made OOP in JS more familiar to developers from other languages.
Classes can be defined with the `Class` keyword, and initialised with a `constructor` method. For example:

.. code-block:: JavaScript

    class ResearchLab {
        constructor(name, university, PI) {
            this.name = name;
            this.university = university;
            this.PI = PI;
            this.members = [];
        }

        addStudent(name){
            this.members.push(name);
        }
    }

Promises
********

Promises are essential when writing asynchronous code. It allows functionality to be chained together,
so that once one process is completed, another one begins - all while a primary set of functions can run in parallel.
One common use of this (and used throughout Psychex) is when making API calls - i.e. when saving or loading data from a server.
Promises have 2 parameters, `resolve` and `reject`. Which allow the user to provide instructions on what to do depending on the outcome of a process.

Promises can be quite tricky to get the hand of, but are a really useful tool to get the hang of. 
`MDN <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>`_ have a good, more detailed explanation
of promises.

In the meantime, here's an example:

.. code-block:: JavaScript

    const fetchData = new Promise((resolve, reject) => {
        setTimeout(resolve("Data received"), 2000);
    });

    fetchData
        .then(data => console.log(data))

The `.then()` function acts on a promise to instruct the asynchronous thread on what to do when the first function is resolved.