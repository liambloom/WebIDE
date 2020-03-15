document.addEventListener("keydown", event => {
  if (event.ctrlKey) {
    switch (event.keyCode) {
      case 66: // b
        event.preventDefault();
        console.log("bold");
        formatSelection("b");
    }
  }
});