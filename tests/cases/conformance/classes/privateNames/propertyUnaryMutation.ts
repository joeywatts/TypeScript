class A {
    #property: number = 1;
    postfixPlusPlus() {
        this.#property++;
    }
    prefixPlusPlus() {
        ++this.#property;
    }
    prefixMinusMinus() {
        --this.#property;
    }
    postfixMinusMinus() {
        this.#property--;
    }
}
