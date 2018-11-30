//// [initializerReferencingBlockScopeBinding.ts]
let arr = [];
for (let i = 0; i < 5; ++i) {
    arr.push(class C {
        test = i;
    });
    class A {
        test = i * 2;
    }
    arr.push(A);
}
arr.forEach(clazz => console.log(new clazz().test));


//// [initializerReferencingBlockScopeBinding.js]
var arr = [];
var _loop_1 = function (i) {
    arr.push(/** @class */ (function () {
        function C() {
            this.test = i;
        }
        return C;
    }()));
    var A = /** @class */ (function () {
        function A() {
            this.test = i * 2;
        }
        return A;
    }());
    arr.push(A);
};
for (var i = 0; i < 5; ++i) {
    _loop_1(i);
}
arr.forEach(function (clazz) { return console.log(new clazz().test); });
