document.addEventListener("DOMContentLoaded", async function () {
  // 드롭다운 기능
  document.querySelectorAll(".emission-item").forEach((emissionItem) => {
    const dropdownBtn = emissionItem.querySelector(".dropdown-btn");
    const dropdownMenu = emissionItem.querySelector(".dropdown-menu");
    const selectedItem = emissionItem.querySelector("#selected-item");

    dropdownBtn.addEventListener("click", () => {
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    dropdownMenu.querySelectorAll(".item").forEach((item) => {
      item.addEventListener("click", () => {
        selectedItem.textContent = item.textContent;
        dropdownMenu.style.display = "none";
      });
    });

    document.addEventListener("click", (event) => {
      if (!emissionItem.contains(event.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  });
});
