class A {
    #foo = this.#bar;
    #bar = 3;
}

class B {
    #foo = this.#bar;
    #bar = this.#foo;
}
