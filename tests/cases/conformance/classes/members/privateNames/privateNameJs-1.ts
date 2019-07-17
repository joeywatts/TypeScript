// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: privateNameJs-1.js

class A {
    constructor () {
        this.#foo = 3 // Error
    }
}
