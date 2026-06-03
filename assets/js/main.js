// phosphor theme — progressive enhancement only
(function () {
  "use strict";

  // Add a copy button to every code block
  document.querySelectorAll("pre").forEach(function (pre) {
    var code = pre.querySelector("code");
    if (!code) return;

    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    btn.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "copied";
        setTimeout(function () { btn.textContent = "copy"; }, 1400);
      }).catch(function () {
        btn.textContent = "err";
        setTimeout(function () { btn.textContent = "copy"; }, 1400);
      });
    });

    pre.appendChild(btn);
  });
})();
