class A {
    #func: (x: string) => number;
    test() {
        const x = this.#func("hello");
        this.#func = function (x: string) {
            return parseInt(x);
        };
        const y = (this.#func)("test");
        (this.#func = function (x: string) {
            return 4;
        })("");
    }
}
