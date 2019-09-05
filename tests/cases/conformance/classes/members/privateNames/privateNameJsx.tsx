//@jsx: preserve
//@strict: true
//@target: es6

class A {
    #Foo = () => null;
    method () {
        const e1 = <this.#Foo />;
        const e2 = <this.#Nonexistent />; // Error

        class B extends A {
            #Foo = 3;
            #Bar = () => null;
            #baz = () => null;

            method () {
                const a = new A();
                const e3 = <a.#Foo />;    // Error: shadowed
                const b = new B();
                const e4 = <b.#Foo />     // Error: not a constructor
                const e5 = <b.#Bar />
                const e6 = <this.#Bar />
                const e7 = <b.#baz />
            }
        }
        const b = new B()
        const e8 = <b.#Foo />             // OK, is A's #foo
        const e9 = <b.#Bar />             // Error: not accessible
    }
}
