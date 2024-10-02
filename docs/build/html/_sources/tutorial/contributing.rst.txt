Contributing to Psychex
=======================

Adding to these Docs
--------------------

The documentation is built using Sphinx. The majority is compiled by-hand, based on function documentation within the Psychex docstrings. The content is written into .rst files (restructured text) and compiled to HTML.

When contributing to Psychex, it's important to provide 2 things:

- Functional documentation that describes everything your code does. This includes JS docstrings following the `Google style guide <https://google.github.io/styleguide/jsguide.html#jsdoc>`_ included in the code itself.
- Clear, follow-along explanations of how to use your code, so that it can be easily implemented.

To compile the docs, install Sphinx from the requirements file in the root directory, navigate to the docs folder, and run ::

    make html

The compiled docs can be found in `docs/build/html/`.