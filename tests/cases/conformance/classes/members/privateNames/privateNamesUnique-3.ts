class Parent {
    #x;
    copy(child: Child) {
        this.#x = child.#x; // Error: because private names are lexically scoped
    }
}

class Child extends Parent {
    #x; // OK (Child's #x does not conflict, as paren't #x is not accessible)
}

const parent = new Parent();
const child = new Child();
parent.copy(child); // OK


export default 3;
