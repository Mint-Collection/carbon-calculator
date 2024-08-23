document.addEventListener("DOMContentLoaded", async function () {
  const postData = {};

  // 기본 변수 찾기
  let currentpage = 1;

  let prdName = document.getElementById("prd-name");
  let prdCategory = document.getElementById("prd-category");
  let prdSlashCategory = document.getElementById("prd-slash-category");
  let prdSlash = document.getElementById("prd-slash");

  let pageInputName = document.getElementById("calc-input-name");
  let pageInputCategory = document.getElementById("calc-input-category");
  let pageInputEmission = document.getElementById("calc-input-emission");
  let pageResult = document.getElementById("calc-result");

  let requirePrdName = document.getElementById("require-prd-name");

  let percentageBar = document.getElementById("percent-bar");
  let textPercent = document.getElementById("text-percent");
  let textWarn = document.getElementById("text-warn");

  let btnNext = document.getElementById("btn-next");
  let btnPrev = document.getElementById("btn-prev");

  let totalCarbon = document.getElementById("total-carbon");
  let toChargePhone = document.getElementById("toChargePhone");
  let toDistance = document.getElementById("toDistance");
  let toTree = document.getElementById("toTree");
  let toWater = document.getElementById("toWater");

  let valueManufacturing = document.getElementById("value-manufacturing");
  let valueTransport = document.getElementById("value-transport");
  let valueMaintaince = document.getElementById("value-maintaince");
  let valueRetire = document.getElementById("value-retire");

  let barManufacturing = document.getElementById("bar-manufacturing");
  let barTransport = document.getElementById("bar-transport");
  let barMaintaince = document.getElementById("bar-maintaince");
  let barRetire = document.getElementById("bar-retire");

  // 기본 변수 스타일 적용
  prdCategory.style.display = "none";
  prdSlashCategory.style.display = "none";
  pageInputCategory.style.display = "none";
  pageInputEmission.style.display = "none";
  pageResult.style.display = "none";

  requirePrdName.style.display = "none";

  percentageBar.style.display = "none";
  textPercent.style.display = "none";
  textWarn.style.display = "none";

  btnPrev.style.display = "none";
  prdName.style.display = "none";
  prdSlash.style.display = "none";

  // Input Category 색상 초기화
  let categoryItems = document.getElementsByClassName("class-item");
  Array.prototype.forEach.call(categoryItems, function (item) {
    let krNameElement = item.getElementsByClassName("class-item-name-kr")[0];
    let enNameElement = item.getElementsByClassName("class-item-name-en")[0];
    if (krNameElement) {
      krNameElement.style.color = "#999999";
    }
    if (enNameElement) {
      enNameElement.style.color = "#999999";
    }
  });

  // Input Category 클릭 이벤트 리스터 추가
  let scrollContainer = document.querySelector(".category-items");
  Array.prototype.forEach.call(categoryItems, function (item) {
    item.addEventListener("click", function () {
      // 모든 class-item 요소를 순회하며 스타일을 초기화
      Array.prototype.forEach.call(categoryItems, function (innerItem) {
        let krNameElement =
          innerItem.getElementsByClassName("class-item-name-kr")[0];
        let enNameElement =
          innerItem.getElementsByClassName("class-item-name-en")[0];
        if (krNameElement) krNameElement.style.color = "#999999";
        if (enNameElement) enNameElement.style.color = "#999999";
      });

      // 클릭한 요소의 스타일을 변경
      let krNameElement = item.getElementsByClassName("class-item-name-kr")[0];
      let enNameElement = item.getElementsByClassName("class-item-name-en")[0];
      if (krNameElement) krNameElement.style.color = "#000000";
      if (enNameElement) enNameElement.style.color = "#000000";

      // 해당 class-item의 id를 기반으로 관련된 class-name 요소를 찾기
      let classNameElements = document.getElementsByClassName("class-name");
      for (let i = 0; i < classNameElements.length; i++) {
        let classNameElement = classNameElements[i];
        if (
          classNameElement.textContent.trim() ===
          krNameElement.textContent.trim()
        ) {
          // 관련된 class-name 요소를 부모 컨텐츠의 맨 위에 위치하도록 스크롤
          classNameElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // 추가적으로 10px 더 아래로 스크롤
          setTimeout(function () {
            scrollContainer.scrollTop -= 25;
          }, 500); // 스크롤 완료 후 10px 이동

          break;
        }
      }
    });
  });

  // 에미션 추가 버튼 이벤트
  // add-emission-btn 요소 선택
  const addEmissionBtn = document.querySelector(".add-emission-btn");
  // calc-input-emission 컨테이너 선택
  const emissionContainer = document.getElementById("calc-input-emission");

  // add-emission-btn 클릭 이벤트 리스너 추가
  addEmissionBtn.addEventListener("click", function () {
    // 새로운 emission-item 생성
    const newEmissionItem = document.createElement("div");
    newEmissionItem.className = "emission-item";

    // emission-item 내부의 HTML 설정
    newEmissionItem.innerHTML = `
          <select class="custom-dropdown">
              <option value="" disabled selected>소재를 선택하세요.</option>
              <option value="nylon">나일론</option>
              <option value="polyester">폴리에스터</option>
              <option value="leather">가죽</option>
              <option value="wool">울</option>
              <option value="cashmere">캐시미어</option>
              <option value="fleece">플리스</option>
              <option value="fur">퍼</option>
              <option value="mohair">모헤어</option>
              <option value="acrylic">아크릴</option>
              <option value="poplin">포플린</option>
              <option value="flax">린넨</option>
              <option value="flannel">플란넬</option>
              <option value="jersey">저지</option>
              <option value="denim">데님</option>
              <option value="jute">마</option>
              <option value="rayon">네이온</option>
              <option value="silk">실크</option>
              <option value="spandex">스판덱스</option>
              <option value="modal">모달</option>
              <option value="viscose">비스코스</option>
              <option value="plyurethane">폴리우레탄</option>
              <option value="rubber">고무</option>
              <option value="wood">나무</option>
              <option value="plastic">플라스틱</option>
              <option value="pvc">PVC</option>
              <option value="suede">스웨이드</option>
          </select>
          <input type="number" placeholder="00%"  class="input-percentage" />
          <img src="cancel.svg" class="cancel-btn" />
      `;

    // 새로운 emission-item을 calc-input-emission 컨테이너에 추가
    emissionContainer.insertBefore(newEmissionItem, addEmissionBtn);
    const inputElements = document.querySelectorAll(".input-percentage");
    inputElements.forEach((input) => {
      input.addEventListener("input", function () {
        const inputs = document.querySelectorAll(".input-percentage");
        let percentTotal = 0;
        inputs.forEach((i) => {
          percentTotal += Number(i.value);
        });
        if (percentTotal >= 100) {
          document.getElementById("percent-value").style.width = "100%";
        } else {
          document.getElementById("percent-value").style.width =
            String(percentTotal) + "%";
        }
        textPercent.innerHTML = String(percentTotal) + "%";
        if (percentTotal > 100) {
          textWarn.style.display = "block";
        } else {
          textWarn.style.display = "none";
        }
      });
      // 음수 확인 이벤트 추가
      const positiveNumberInputs =
        document.getElementsByClassName("input-percentage");
      Array.from(positiveNumberInputs).forEach((input) => {
        input.addEventListener("input", function (event) {
          if (event.target.value < 0) {
            event.target.value = 0;
          }
        });
      });
    });
  });

  const inputElements = document.querySelectorAll(".input-percentage");
  inputElements.forEach((input) => {
    input.addEventListener("input", function () {
      // 음수 확인 이벤트 추가
      const positiveNumberInputs =
        document.getElementsByClassName("input-percentage");
      Array.from(positiveNumberInputs).forEach((input) => {
        input.addEventListener("input", function (event) {
          if (event.target.value < 0) {
            event.target.value = 0;
          }
        });
      });
      const inputs = document.querySelectorAll(".input-percentage");
      let percentTotal = 0;
      inputs.forEach((i) => {
        percentTotal += Number(i.value);
      });
      if (percentTotal >= 100) {
        document.getElementById("percent-value").style.width = "100%";
      } else {
        document.getElementById("percent-value").style.width =
          String(percentTotal) + "%";
      }
      textPercent.innerHTML = String(percentTotal) + "%";
      if (percentTotal > 100) {
        textWarn.style.display = "block";
      } else {
        textWarn.style.display = "none";
      }
    });
  });

  // 이벤트 위임을 사용하여 emission-item 내의 cancel-btn 클릭 이벤트 처리
  emissionContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("cancel-btn")) {
      const emissionItem = event.target.closest(".emission-item");
      if (emissionItem) {
        let deleteValue = emissionItem.querySelector(
          'input[type="number"]'
        ).value;
        let percent =
          Number(
            document
              .getElementById("percent-value")
              .style.width.replace("%", "")
          ) - deleteValue;
        document.getElementById("percent-value").style.width =
          String(percent) + "%";
        textPercent.innerText =
          String(Number(textPercent.innerText.replace("%", "")) - deleteValue) +
          "%";
        emissionContainer.removeChild(emissionItem);
      }
    }
  });

  // 다음 버튼 클릭 이벤트
  btnNext.addEventListener("click", async () => {
    switch (currentpage) {
      // 1번 페이지일 경우
      case 1:
        let inputValue = document.getElementById("input-prd-name").value;
        // 입력 값 확인
        if (!inputValue || inputValue.trim() === "") {
          requirePrdName.style.display = "block";
          document.getElementById("input-prd-name").style.border =
            "2px solid red";
          // 입력 값 문제 없을 경우
        } else {
          requirePrdName.style.display = "none";
          document.getElementById("input-prd-name").style.border =
            "2px solid #e6e6e6";
          pageInputName.style.display = "none";
          pageInputCategory.style.display = "flex";
          btnPrev.style.display = "block";
          prdName.style.display = "block";
          prdName.innerHTML = inputValue;
          prdSlash.style.display = "block";
          currentpage = 2;

          // step 조정
          document.getElementById("step-1").style.color = "#666666";
          document.getElementById("step-1").style.borderBottom = "none";
          document.getElementById("step-2").style.color = "#666666";
          document.getElementById("step-2").style.borderBottom =
            "2px solid #666666";
          document.getElementById("step-3").style.color = "#b3b3b3";
          document.getElementById("step-3").style.borderBottom =
            "0px solid #b3b3b3";
          document.getElementById("step-4").style.color = "#b3b3b3";
          document.getElementById("step-4").style.borderBottom =
            "0px solid #b3b3b3";
        }
        break;
      case 2:
        const radioBtn = this.documentElement.querySelectorAll(
          'input[name="category"]'
        );
        let data = null;
        radioBtn.forEach((radio) => {
          if (radio.checked) {
            console.log(radio.value);
            data = radio.value;
          }
        });
        if (!data) {
          alert("카테고리를 선택해주세요.");
          return;
        } else {
          delete postData["catgegory"];
          postData["category"] = data;
        }

        const selectedRadio = document.querySelector(
          'input[name="category"]:checked'
        );
        if (selectedRadio) {
          const label = document.querySelector(
            `label[for="${selectedRadio.id}"]`
          );
          prdCategory.innerText = label.innerText;
        }

        prdCategory.style.display = "block";
        prdSlashCategory.style.display = "block";
        pageInputEmission.style.display = "flex";
        pageInputCategory.style.display = "none";
        currentpage = 3;
        // step 조정
        document.getElementById("step-1").style.color = "#666666";
        document.getElementById("step-1").style.borderBottom = "none";
        document.getElementById("step-2").style.color = "#666666";
        document.getElementById("step-2").style.borderBottom = "none";
        document.getElementById("step-3").style.color = "#666666";
        document.getElementById("step-3").style.borderBottom =
          "2px solid #666666";
        document.getElementById("step-4").style.color = "#b3b3b3";
        document.getElementById("step-4").style.borderBottom =
          "0px solid #b3b3b3";

        // 퍼센트 보이기
        percentageBar.style.display = "block";
        textPercent.style.display = "block";

        break;
      case 3:
        const emissionItems = document.querySelectorAll(".emission-item");

        for (const item of emissionItems) {
          const selectElement = item.querySelector(".custom-dropdown");
          const inputElement = item.querySelector(".input-percentage");

          if (textPercent.innerHTML !== "100%") {
            alert("혼용률의 합은 100% 여야 합니다.");
            return;
          }

          if (!selectElement.value) {
            alert("소재 정보를 선택해주세요.");
            return; // 함수 전체를 종료합니다.
          }

          if (!inputElement.value) {
            alert("소재 비율을 입력해주세요.");
            return; // 함수 전체를 종료합니다.
          }

          postData[`${selectElement.value}`] = Number(inputElement.value);
        }
        let responseData = null;
        const url = "https://api.mntc-dev.com/calculator";
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => {
            if (!response.ok) {
              alert("API 서버로부터 응답이 옳지 않습니다.");
              return;
            }
            return response.json();
          })
          .then((data) => {
            responseData = data.result.data;
          })
          .catch((error) => {
            alert("API 서버로부터 응답이 옳지 않습니다.");
            return;
          });

        totalCarbon.innerText = responseData.total;
        toChargePhone.innerText =
          responseData.toChargePhone.toLocaleString() + " 회";
        toDistance.innerText = responseData.toDistance.toLocaleString() + " Km";
        toTree.innerText = responseData.toTree.toLocaleString() + " 그루";
        toWater.innerText = responseData.toWater.toLocaleString() + " L";

        valueManufacturing.innerText = responseData.manufacturing.toFixed(3);
        valueTransport.innerText = responseData.transport.toFixed(3);
        valueMaintaince.innerText = responseData.maintaince.toFixed(3);
        valueRetire.innerText = responseData.retire.toFixed(3);

        // 바 1
        barManufacturing.style.height =
          String((responseData.manufacturing / responseData.total) * 100) + "%";
        if ((responseData.manufacturing / responseData.total) * 100 >= 50) {
          barManufacturing.style.backgroundColor = "#41d98d";
        } else if (
          (responseData.manufacturing / responseData.total) * 100 >=
          25
        ) {
          barManufacturing.style.backgroundColor = "#B3B3B3";
        } else {
          barManufacturing.style.backgroundColor = "#CCCCCC";
        }

        // 바 2
        barTransport.style.height =
          String((responseData.transport / responseData.total) * 100) + "%";
        if ((responseData.transport / responseData.total) * 100 >= 50) {
          barTransport.style.backgroundColor = "#41d98d";
        } else if ((responseData.transport / responseData.total) * 100 >= 25) {
          barTransport.style.backgroundColor = "#B3B3B3";
        } else {
          barTransport.style.backgroundColor = "#CCCCCC";
        }

        // 바 3
        barMaintaince.style.height =
          String((responseData.maintaince / responseData.total) * 100) + "%";
        if ((responseData.maintaince / responseData.total) * 100 >= 50) {
          barMaintaince.style.backgroundColor = "#41d98d";
        } else if ((responseData.maintaince / responseData.total) * 100 >= 25) {
          barMaintaince.style.backgroundColor = "#B3B3B3";
        } else {
          barMaintaince.style.backgroundColor = "#CCCCCC";
        }

        // 바 4
        barRetire.style.height =
          String((responseData.retire / responseData.total) * 100) + "%";
        if ((responseData.retire / responseData.total) * 100 >= 50) {
          barRetire.style.backgroundColor = "#41d98d";
        } else if ((responseData.retire / responseData.total) * 100 >= 25) {
          barRetire.style.backgroundColor = "#B3B3B3";
        } else {
          barRetire.style.backgroundColor = "#CCCCCC";
        }

        let elements = [
          barManufacturing,
          barTransport,
          barMaintaince,
          barRetire,
        ];
        let highestElement = findHighestElement(elements);
        highestElement.style.backgroundColor = "#41D98D";

        btnNext.style.display = "none";
        percentageBar.style.display = "none";
        textPercent.style.display = "none";
        textWarn.style.display = "none";
        pageInputEmission.style.display = "none";
        pageResult.style.display = "flex";
        currentpage = 4;
        // step 조정
        document.getElementById("step-1").style.color = "#666666";
        document.getElementById("step-1").style.borderBottom = "none";
        document.getElementById("step-2").style.color = "#666666";
        document.getElementById("step-2").style.borderBottom = "none";
        document.getElementById("step-3").style.color = "#666666";
        document.getElementById("step-3").style.borderBottom = "none";
        document.getElementById("step-4").style.color = "#666666";
        document.getElementById("step-4").style.borderBottom =
          "2px solid #666666";
        break;
    }
  });

  // 이전 버튼 클릭 이벤트
  btnPrev.addEventListener("click", () => {
    switch (currentpage) {
      case 4:
        percentageBar.style.display = "flex";
        textPercent.style.display = "flex";
        btnNext.style.display = "block";

        pageInputEmission.style.display = "flex";
        pageResult.style.display = "none";
        document.getElementById("step-1").style.color = "#666666";
        document.getElementById("step-1").style.borderBottom = "none";
        document.getElementById("step-2").style.color = "#666666";
        document.getElementById("step-2").style.borderBottom = "none";
        document.getElementById("step-3").style.color = "#666666";
        document.getElementById("step-3").style.borderBottom =
          "2px solid #666666";
        document.getElementById("step-4").style.color = "#b3b3b3";
        document.getElementById("step-4").style.borderBottom =
          "0px solid #b3b3b3";
        currentpage = 3;
        break;
      case 3:
        btnNext.style.display = "block";
        prdCategory.style.display = "none";
        prdSlashCategory.style.display = "none";
        pageInputCategory.style.display = "flex";
        pageInputEmission.style.display = "none";
        percentageBar.style.display = "none";
        textPercent.style.display = "none";

        document.getElementById("step-1").style.color = "#666666";
        document.getElementById("step-1").style.borderBottom = "none";
        document.getElementById("step-2").style.color = "#666666";
        document.getElementById("step-2").style.borderBottom =
          "2px solid #666666";
        document.getElementById("step-3").style.color = "#b3b3b3";
        document.getElementById("step-3").style.borderBottom =
          "0px solid #b3b3b3";
        document.getElementById("step-4").style.color = "#b3b3b3";
        document.getElementById("step-4").style.borderBottom =
          "0px solid #b3b3b3";
        currentpage = 2;
        break;
      case 2:
        btnNext.style.display = "block";
        btnPrev.style.display = "none";
        pageInputName.style.display = "flex";
        pageInputCategory.style.display = "none";
        percentageBar.style.display = "none";
        textPercent.style.display = "none";
        prdName.style.display = "none";
        prdSlash.style.display = "none";
        document.getElementById("step-1").style.color = "#666666";
        document.getElementById("step-1").style.borderBottom =
          "2px solid #b3b3b3";
        document.getElementById("step-2").style.color = "#b3b3b3";
        document.getElementById("step-2").style.borderBottom =
          "0px solid #b3b3b3";
        document.getElementById("step-3").style.color = "#b3b3b3";
        document.getElementById("step-3").style.borderBottom =
          "0px solid #b3b3b3";
        document.getElementById("step-4").style.color = "#b3b3b3";
        document.getElementById("step-4").style.borderBottom =
          "0px solid #b3b3b3";
        currentpage = 1;
        break;
    }
  });
  const hoverManufacturing = document.getElementById("hover-manufacturing");
  const hoverBoxManufacturing = document.getElementById(
    "hover-box-manufacturing"
  );
  hoverManufacturing.addEventListener("mouseover", function (event) {
    const rect = hoverManufacturing.getBoundingClientRect();
    hoverBoxManufacturing.style.left = `${rect.left}px`;
    hoverBoxManufacturing.style.top = `${rect.bottom + window.scrollY}px`;
    hoverBoxManufacturing.style.display = "flex";
  });
  hoverManufacturing.addEventListener("mouseout", function () {
    hoverBoxManufacturing.style.display = "none";
  });
  //
  const hoverTransport = document.getElementById("hover-transport");
  const hoverBoxTransport = document.getElementById("hover-box-transport");
  hoverTransport.addEventListener("mouseover", function (event) {
    const rect = hoverTransport.getBoundingClientRect();
    hoverBoxTransport.style.left = `${rect.left}px`;
    hoverBoxTransport.style.top = `${rect.bottom + window.scrollY}px`;
    hoverBoxTransport.style.display = "flex";
  });
  hoverTransport.addEventListener("mouseout", function () {
    hoverBoxTransport.style.display = "none";
  });
  const hoverMaintaince = document.getElementById("hover-maintaince");
  const hoverBoxMaintaince = document.getElementById("hover-box-maintaince");
  hoverMaintaince.addEventListener("mouseover", function (event) {
    const rect = hoverMaintaince.getBoundingClientRect();
    hoverBoxMaintaince.style.left = `${rect.left}px`;
    hoverBoxMaintaince.style.top = `${rect.bottom + window.scrollY}px`;
    hoverBoxMaintaince.style.display = "flex";
  });
  hoverMaintaince.addEventListener("mouseout", function () {
    hoverBoxMaintaince.style.display = "none";
  });

  const hoverRetire = document.getElementById("hover-retire");
  const hoverBoxRetire = document.getElementById("hover-box-retire");
  hoverRetire.addEventListener("mouseover", function (event) {
    const rect = hoverRetire.getBoundingClientRect();
    hoverBoxRetire.style.right = `50px`;
    hoverBoxRetire.style.top = `${rect.bottom + window.scrollY}px`;
    hoverBoxRetire.style.display = "flex";
  });
  hoverRetire.addEventListener("mouseout", function () {
    hoverBoxRetire.style.display = "none";
  });

  const hoverCompare = document.getElementById("hover-compare");
  const hoverBoxCompare = document.getElementById("hover-box-compare");
  hoverCompare.addEventListener("mouseover", function (event) {
    const rect = hoverCompare.getBoundingClientRect();
    hoverBoxCompare.style.right = `0px`;
    hoverBoxCompare.style.top = `60px`;
    hoverBoxCompare.style.display = "flex";
  });
  hoverCompare.addEventListener("mouseout", function () {
    hoverBoxCompare.style.display = "none";
  });
});

function findHighestElement(elements) {
  let highestElement = elements[0];

  elements.forEach((element) => {
    let currentHeight = parseFloat(element.style.height);
    let highestHeight = parseFloat(highestElement.style.height);

    if (currentHeight > highestHeight) {
      highestElement = element;
    }
  });

  return highestElement;
}
