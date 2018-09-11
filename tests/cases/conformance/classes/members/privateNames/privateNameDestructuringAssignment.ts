class Test {
    #myPropDefault = 23;
    #myProp: number;
    constructor() {
        ({ value: this.#myProp } = { value: 10 });
        ({ something: this.#myProp } = { something: this.#myPropDefault });
    }
}
