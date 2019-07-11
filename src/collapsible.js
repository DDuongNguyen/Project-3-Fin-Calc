function collapse(collapsible) {
  let i;
  for (i = 0; i < collapsible.length; i++) {
    collapsible[i].addEventListener("click", function() {
      // debugger
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
