// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: privaateNameJsBadAssignment.js

exports.#nope = 1;           // Error (outside class body)
function A() { }
A.prototype.#no = 2;         // Error (outside class body)

class B {}
B.#foo = 3;                  // Error (outside class body)

class C {
    #foo = 4;
    #bar = 6;
    constructor () {
        exports.#bar = 6;    // Error
        this.#foo = 3;       // Error (undeclared)
    }
}
