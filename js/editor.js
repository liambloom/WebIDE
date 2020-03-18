const title = document.getElementById("documentTitle");
const test = document.getElementById("titleTest");
const doc = document.getElementsByClassName("page")[0];

function titleOnBlur () {
  if (!/\S/.test(title.value)) {
    title.value = "Untitled Document";
    titleWidth();
  }
  if (title.value === "Untitled Document") title.style.setProperty("color", "#707070");
}
function titleWidth () {
  test.innerHTML = title.value;
  title.style.setProperty("width", test.clientWidth + "px");
}
title.addEventListener("keyup", event => {
  if (event.keyCode === 13) doc.focus(); // enter 
});
document.getElementById("documentTitle").addEventListener("input", titleWidth);
title.addEventListener("focus", () => {
  title.style.setProperty("color", "#282830");
  if (title.value === "Untitled Document") title.select();
});
title.addEventListener("blur", titleOnBlur);
titleOnBlur();
onDocumentReady(titleWidth);
function underlineOption(option, marker) {
  const bcr = option.getBoundingClientRect();
  const styles = getComputedStyle(option);
  marker.style.left = bcr.left + parseFloat(styles.getPropertyValue("padding-left")) + "px";
  marker.style.top = bcr.top + bcr.height - parseFloat(styles.getPropertyValue("padding-bottom")) + "px";
  marker.style.width = bcr.width - parseFloat(styles.getPropertyValue("padding-right")) - parseFloat(styles.getPropertyValue("padding-left")) + "px";
}
{
  const group = document.getElementById("menu");
  const marker = document.createElement("div");
  marker.classList.add("marker");
  group.appendChild(marker);
  const children = Array.from(group.children);
  for (let option of children) {
    option.addEventListener("mousedown", () => {
      group.getElementsByClassName("selected")[0].classList.remove("selected");
      option.classList.add("selected");
      underlineOption(option, marker);
    });
  }
  onDocumentReady(() => { underlineOption(children[0], marker); });
}
for (let group of Array.from(document.getElementsByClassName("select1"))) {
  const children = Array.from(group.children);
  for (let option of children) {
    option.addEventListener("mousedown", () => {
      group.getElementsByClassName("selected")[0].classList.remove("selected");
      option.classList.add("selected");
    });
  }
}
for (let tabMenu of Array.from(document.getElementsByClassName("tab-menu"))) {
  const menu = tabMenu.getAttribute("data-for");
  document.getElementById(menu).querySelector(`[data-option="${tabMenu.getAttribute("data-tabName")}"]`).addEventListener("click", () => {
    document.querySelector(`.open[data-for="${menu}"]`).classList.remove("open");
    tabMenu.classList.add("open");
  });
}
for (let e of document.getElementsByClassName("sticky")) {
  e.addEventListener("click", () => {
    e.classList.toggle("selected");
  });
}
doc.focus();

for (let select of Array.from(document.getElementsByClassName("custom-select"))) {
  const display = select.getElementsByClassName("display")[0];
  const textSelect = display.tagName === "INPUT";
  const toggle = () => { select.classList.toggle("open"); };
  const close = () => { select.classList.remove("open"); };
  select.getElementsByClassName("arrow-container")[0].addEventListener("click", toggle);
  document.addEventListener("click", event => {
    if (!select.contains(event.target)) close();
  });
  document.addEventListener("blur", close);
  for (let option of Array.from(select.getElementsByClassName("options")[0].children)) {
    option.addEventListener("click", () => {
      if (textSelect) display.value = option.innerHTML;
      else display.innerHTML = option.innerHTML;
      select.value = option.innerHTML;
      select.dispatchEvent(new Event("input"));
      select.dispatchEvent(new Event("change"));
      close();
    });
  }
  if (textSelect) {
    select.value = display.value;
    display.addEventListener("focus", () => {
      display.select();
    });
    display.addEventListener("input", () => {
      select.dispatchEvent(new Event("input"));
    });
    display.addEventListener("change", () => {
      let value = parseInt(display.value);
      if (isNaN(value)) display.value = select.value;
      else {
        const min = parseInt(select.getAttribute("data-min"));
        const max = parseInt(select.getAttribute("data-max"));
        const decorator = select.getAttribute("data-decorator");
        if (!isNaN(min)) value = Math.max(value, min);
        if (!isNaN(max)) value = Math.min(value, max);
        if (decorator) value += decorator;
        display.value = value;
        select.value = display.value;
        select.dispatchEvent(new Event("change"));
      }
      doc.focus();
      close();
    });
  }
  else {
    select.getElementsByClassName("display")[0].addEventListener("click", toggle);
    select.value = display.innerHTML;
  }
}

function formatSelection (formatElement) {
  const selection = window.getSelection();
  for (let i = 0; i < selection.rangeCount; i++) {
    const selector = formatElement.match(/(?:^|[#\.\[])[^#\.\[]+/g);
    const styledElement = document.createElement(/[#\.\[]/.test(selector[0].charAt(0)) ? "div" : selector[0]);
    for (let rule of selector) {
      switch (rule.charAt(0)) {
        case "#":
          styledElement.id = rule.substring(1);
          break;
        case ".":
          styledElement.classList.add(rule.substring(1));
          break;
        case "[":
          const attr = rule.substring(1, rule.length - 1).split("=");
          styledElement.setAttribute(attr[0], attr[1].substring(1, attr[1].length - 1));
      }
    }
    selection.getRangeAt(i).surroundContents(styledElement);
  }
}

function addFunc (element, key, callback) {
  if (typeof callback === "string") {
    const command = callback;
    callback = () => { document.execCommand(command); };
  }
  if (element !== null) {
    if (typeof element === "string") element = document.getElementById(element);
    if (element.tagName === "INPUT" || element.classList.contains("custom-select")) element.addEventListener("change", callback);
    else element.addEventListener("click", callback);
    if (element.classList.contains("sticky")) {
      // do stuff
    }
  }
  if (key !== null) {
    if (typeof key === "string") key = { key: keyCodes[key] };
    else if (typeof key === "number") key = { key };
    else if (typeof key.key === "string") key.key = keyCodes[key.key];
    key.ctrl = !(key.ctrl === false || false);
    key.alt = key.alt || false;
    key.shift = key.shift || false;
    doc.addEventListener("keydown", event => {
      if (key.key === event.keyCode && key.ctrl === event.ctrlKey && key.alt === event.altKey && key.shift === event.shiftKey) {
        event.preventDefault();
        callback();
      }
    });
  }
}

addFunc("undo", "z", "undo");
addFunc("redo", "r", "redo");
addFunc("print", "p", () => print()); // fix margins

addFunc("zoom", null, function () { doc.style.setProperty("transform", `scale(${parseInt(this.value) / 100})`); });// no margin bottom

// normal text / headings required doing/undoing

addFunc("font", null, function () { document.execCommand("fontName", false, `'${this.value}'`); });

// font size must be done manually

addFunc("bold", "b", "bold");
addFunc("italics", "i", "italic");
addFunc("underline", "u", "underline");

addFunc("align-left", { key: "l", shift: true }, "justifyLeft");
addFunc("align-center", { key: "e", shift: true }, "justifyCenter");
addFunc("align-right", { key: "r", shift: true }, "justifyRight");
addFunc("align-justify", { key: "j", shift: true }, "justifyFull");

addFunc(null, { key: "5", ctrl: false, shift: true, alt: true }, "strikeThrough");
addFunc(null, "period", "superscript");
addFunc(null, "comma", "subscript");
addFunc(null, "backslash", "removeFormat");

