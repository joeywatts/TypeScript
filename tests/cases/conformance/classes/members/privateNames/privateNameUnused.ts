// @noUnusedLocals:true 
// @noEmit: true

export class A {
    #used = "used";
    #unused = "unused";
    constructor () {
        console.log(this.#used);
    }
}
