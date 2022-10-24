function f() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 2000)
    });
  
    let result = promise.then((res) => {
        console.log(res); // "done!"
    })
    
    g();
  }
  function g() {
    console.log("g");
  }
  
  f();