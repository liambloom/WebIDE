/*document.getElementById("editor").addEventListener("input", () => {
  
});*/
function formatSelection (formatElement) {
  const selection = window.getSelection();
  for (let i = 0; i < selection.rangeCount; i++) {
    selection.getRangeAt(i).surroundContents(document.createElement(formatElement));
  }
}
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