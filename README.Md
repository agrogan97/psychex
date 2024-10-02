Usage
=====

To update from dev directory, checkout this branch and run `git checkout dev -- docs`. Make sure there is an empty `.nojekyll` file within the docs/build/html/ folder so that statics load.

Rename the docs file to `src/`, and copy `docs/build/html` (the whole folder) into the root. Rename this folder `docs`. It's ready to serve now.