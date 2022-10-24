async function f() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 2000)
    });
  
    let result = await promise; // wait until the promise resolves (*). 
    //JS engine can run other functions while this resolves, but this function is suspended until promise resolves
    
    g();  
    console.log(result); // "done!"
  }
  function g() {
    console.log("g");
  }
  
  f();
  

  