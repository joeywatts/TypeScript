function A() { }
A.prototype = {
  #x: 1         // Error
}
class B { }
B.prototype = {
  #y: 2         // Error
}
