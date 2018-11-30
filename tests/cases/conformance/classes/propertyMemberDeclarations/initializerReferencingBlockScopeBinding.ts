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
