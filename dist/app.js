// Lightweight site JS: fake-submit handling for demo forms (newsletter,
// contact, add-listing). Replace with your ESP / form backend before launch.
document.addEventListener("submit", function (e) {
  var f = e.target;
  if (f && f.classList && f.classList.contains("js-form")) {
    e.preventDefault();
    var ok = f.parentNode.querySelector(".form-success");
    if (ok) {
      f.style.display = "none";
      ok.style.display = "block";
      ok.setAttribute("role", "status");
    }
  }
});
