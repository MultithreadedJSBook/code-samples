(module ;; <1>
  (func $add (param $a i32) (param $b i32) (result i32) ;; <2>
    local.get $a ;; <3>
    local.get $b
    i32.add)
  (export "add" (func $add)) ;; <4>
)
