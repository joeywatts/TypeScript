//// [privateNameDeclaration.ts]
export class A {
    // declaration file should not include the type of #name
    #name: string;
}


//// [privateNameDeclaration.js]
"use strict";
var _name;
exports.__esModule = true;
var A = /** @class */ (function () {
    function A() {
        // declaration file should not include the type of #name
        _name.set(this, void 0);
    }
    return A;
}());
exports.A = A;
_name = new WeakMap();


//// [privateNameDeclaration.d.ts]
export declare class A {
    #name;
}
