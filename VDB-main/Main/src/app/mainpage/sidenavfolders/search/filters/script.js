    document.addEventListener("DOMContentLoaded", function() {
        const selectBtn = document.querySelector(".select-btn"),
            items = document.querySelectorAll(".item"),
            btnText = document.querySelector(".btn-text");

        selectBtn.addEventListener("click", () => {
            selectBtn.classList.toggle("open");
        });

        items.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");

                let checkedItems = document.querySelectorAll(".checked");

                if (checkedItems.length > 0) {
                    btnText.innerText = `${checkedItems.length} Selected`;
                } else {
                    btnText.innerText = "Select Language";
                }
            });
        });
    });

      document.addEventListener("DOMContentLoaded", function() {
        const selectBtns = document.querySelectorAll(".Level"),
            items = document.querySelectorAll(".High"),
            btnTexts = document.querySelectorAll(".Select");

        selectBtns.forEach(selectBtn => {
            selectBtn.addEventListener("click", () => {
                selectBtn.classList.toggle("open");
            });
        });

        items.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");

                let checkedItems = document.querySelectorAll(".checked");

                checkedItems.forEach((checkedItem, index) => {
                    if (checkedItem.parentElement.parentElement.parentElement === item.parentElement.parentElement) {
                        let btnText = btnTexts[index];
                        if (checkedItems.length > 0) {
                            btnText.innerText = `${checkedItems.length} Selected`;
                        } else {
                            btnText.innerText = "Select Language";
                        }
                    }
                });
            });
        });
    });