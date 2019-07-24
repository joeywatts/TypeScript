//// [privateNameFieldDestructuredBinding.ts]
class A {
    #field = 1;
    otherObject = new A();
    testObject() {
        return { x: 10, y: 6 };
    }
    testArray() {
        return [10, 11];
    }
    constructor() {
        let y: number;
        ({ x: this.#field, y } = this.testObject());
        ([this.#field, y] = this.testArray());
        ({ a: this.#field, b: [this.#field] } = { a: 1, b: [2] });
        [this.#field, [this.#field]] = [1, [2]];
        ({ a: this.#field = 1, b: [this.#field = 1] } = { b: [] });
        [this.#field = 2] = [];
        [this.otherObject.#field = 2] = [];
    }
    static test(_a: A) {
        [_a.#field] = [2];
    }
}


//// [privateNameFieldDestructuredBinding.js]
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };
var _field;
var A = /** @class */ (function () {
    function A() {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        _field.set(this, 1);
        this.otherObject = new A();
        var y;
        (_b = this.testObject(), (_l = this, { set value(_b) { __classPrivateFieldSet(_l, _field, _b); } }.value) = _b.x, y = _b.y);
        (_c = this.testArray(), (_m = this, { set value(_b) { __classPrivateFieldSet(_m, _field, _b); } }.value) = _c[0], y = _c[1]);
        (_d = { a: 1, b: [2] }, (_o = this, { set value(_b) { __classPrivateFieldSet(_o, _field, _b); } }.value) = _d.a, (_p = this, { set value(_b) { __classPrivateFieldSet(_p, _field, _b); } }.value) = _d.b[0]);
        _e = [1, [2]], (_q = this, { set value(_b) { __classPrivateFieldSet(_q, _field, _b); } }.value) = _e[0], (_r = this, { set value(_b) { __classPrivateFieldSet(_r, _field, _b); } }.value) = _e[1][0];
        (_f = { b: [] }, _g = _f.a, (_s = this, { set value(_b) { __classPrivateFieldSet(_s, _field, _b); } }.value) = _g === void 0 ? 1 : _g, _h = _f.b[0], (_t = this, { set value(_b) { __classPrivateFieldSet(_t, _field, _b); } }.value) = _h === void 0 ? 1 : _h);
        _j = [][0], (_u = this, { set value(_b) { __classPrivateFieldSet(_u, _field, _b); } }.value) = _j === void 0 ? 2 : _j;
        _k = [][0], (_v = this.otherObject, { set value(_b) { __classPrivateFieldSet(_v, _field, _b); } }.value) = _k === void 0 ? 2 : _k;
    }
    A.prototype.testObject = function () {
        return { x: 10, y: 6 };
    };
    A.prototype.testArray = function () {
        return [10, 11];
    };
    A.test = function (_a) {
        ({ set value(_b) { __classPrivateFieldSet(_a, _field, _b); } }.value = [2][0]);
    };
    return A;
}());
_field = new WeakMap();
