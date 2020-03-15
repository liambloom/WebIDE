function onDocumentReady (callback) {
  if (document.readyState === "complete") callback();
  else window.addEventListener("load", callback);
}