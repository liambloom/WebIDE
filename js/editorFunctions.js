function formatSelection(formatElement) {
  const selection = window.getSelection();
  for (let i = 0; i < selection.rangeCount; i++) {
    selection.getRangeAt(i).surroundContents(document.createElement(formatElement));
  }
}