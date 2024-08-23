document.addEventListener("DOMContentLoaded", async function () {
  let sk_name = null;
  let sk_author = null;
  let sk_maxPage = null;
  let sk_currentPage = 1;

  let currentPage = 1;
  let archiveItems;

  let archiveID = null;

  const inputName = document.getElementById("calc-input-name");
  const inputCategory = document.getElementById("calc-input-category");
  const inputEmission = document.getElementById("calc-input-emission");
  const inputTransport = document.getElementById("calc-input-transport");
  const loadingPage = document.getElementById("calc-loading");
  const resultPage = document.getElementById("calc-result");

  const btnNext = document.getElementById("btn-next");
  const btnPrev = document.getElementById("btn-prev");
  const btnSave = document.getElementById("btn-save");

  const percentBar = document.querySelector(".percent-bar .percent-value");
  const percentText = document.getElementById("percent-text");
  const percentWarn = document.getElementById("percent-warn");

  const inputDistance = document.getElementById("input-distance");
  const unknownDistance = document.getElementById("unknown-distance");
  const inputAmount = document.getElementById("input-amount");
  const unknownAmount = document.getElementById("unknown-amount");
  const inputEfficiency = document.getElementById("input-efficiency");
  const unknownEfficiency = document.getElementById("unknown-efficiency");
  const inputElectricity = document.getElementById("input-electricity");
  const unknownElectricity = document.getElementById("unknown-electricity");
  const inputWTT = document.getElementById("input-diesel-wtt");
  const unknownWTT = document.getElementById("unknown-diesel-wtt");
  const inputTTW = document.getElementById("input-diesel-ttw");
  const unknownTTW = document.getElementById("unknown-diesel-ttw");
  const inputDensity = document.getElementById("input-diesel-density");
  const unknownDensity = document.getElementById("unknown-diesel-density");
  const inputRecondition = document.getElementById("input-recondition-elec");
  const unknownRecondition = document.getElementById(
    "unknown-recondition-elec"
  );

  const dontknowhbr = document.getElementById("check-dont-know");

  let postData = {};
  let globalResponseData = {};

  //* ------------------------------- 다음 버튼 클릭
  btnNext.addEventListener("click", async () => {
    switch (currentPage) {
      // 이름 입력 페이지일때
      case 1:
        // 이름 유효성 검사
        let inputValue = document.getElementById("input-project-name").value;
        if (!inputValue || inputValue.trim() === "") {
          document.getElementById("text-warning").style.display = "block";
          document.getElementById("input-project-name").style.border =
            "2px solid red";
          break;
        } else {
          btnPrev.style.display = "flex";
          inputName.style.display = "none";
          inputCategory.style.display = "flex";
          document.getElementById("text-warning").style.display = "none";
          document.getElementById("input-project-name").style.border =
            "1px solid #e6e6e6";
          document.getElementById("slash-1").style.display = "block";
          document.getElementById("prd-name").style.display = "block";
          document.getElementById("prd-name").innerText = inputValue;
          currentPage += 1;
          break;
        }
      // 카테고리 입력 페이지 일때
      case 2:
        const radioBtn = this.documentElement.querySelectorAll(
          'input[name="category"]'
        );
        let data = null;
        radioBtn.forEach((radio) => {
          if (radio.checked) {
            data = radio.value;
          }
        });
        if (!data) {
          alert("카테고리를 선택해주세요.");
          break;
        } else {
          postData["category"] = data;
          document.getElementById("slash-2").style.display = "block";
          document.getElementById("prd-category").style.display = "block";
          document.getElementById("prd-category").innerHTML = data;
        }
        inputCategory.style.display = "none";
        inputEmission.style.display = "flex";
        document.getElementById("percent-bar").style.display = "flex";
        document.getElementById("percent-text").style.display = "flex";
        currentPage += 1;
        break;
      // 에미션 입력 페이지 일때
      case 3:
        const isValiable = document
          .getElementById("percent-text")
          .innerText.replace("%", "");
        if (isValiable !== "100") {
          alert("소재의 총 합은 100% 여야 합니다.");
          return;
        }
        let flag = false;
        let emissionItem = document.querySelectorAll(".emission-item");
        emissionItem.forEach((item) => {
          const dropDown = item.querySelector(".dropdown-wrapper");
          const selectedItem =
            dropDown.querySelector(".selected-item").innerHTML;
          const inputValue = item.querySelector(".input-percentage").value;

          if (selectedItem === "소재 선택 ( Select Material )") {
            alert("선택되지 않은 소재 항목이 있습니다.");
            flag = true;
          } else {
            let key = selectedItem.split("/")[1].toLowerCase().replace(" ", "");
            postData[key] = Number(inputValue);
          }
        });

        let duplicateFlag = false;
        let isduplicated = document.querySelectorAll(".emission-item");
        let dict = {};
        for (let i = 0; i < isduplicated.length; i++) {
          const dropDown = isduplicated[i].querySelector(".dropdown-wrapper");
          const selectedItem =
            dropDown.querySelector(".selected-item").innerHTML;
          if (dict.hasOwnProperty(selectedItem)) {
            duplicateFlag = true;
          } else {
            dict[selectedItem] = 0;
          }
        }
        if (duplicateFlag === true) {
          alert("선택된 소재에 중복 값이 존재합니다.");
          break;
        }

        if (flag === true) {
          break;
        }

        inputEmission.style.display = "none";
        inputTransport.style.display = "flex";
        document.getElementById("percent-bar").style.display = "none";
        document.getElementById("percent-text").style.display = "none";
        document.getElementById("percent-warn").style.display = "none";
        currentPage += 1;
        break;
      // 운송 입력 페이지 일 때
      case 4:
        let flag_stop = false;
        postData["destination"] = null;
        postData["stopover"] = null;
        postData["departure"] = null;
        postData["dist"] = null;

        const strhbrseq = document.getElementById("select-departure").value;
        const endhbrseq = document.getElementById("select-destination").value;

        if (dontknowhbr.checked) {
          postData["destination"] = null;
          postData["stopover"] = null;
          postData["departure"] = null;
          postData["dist"] = null;
        } else if (strhbrseq.value === 0 || strhbrseq === "0") {
          alert("출발항을 선택해주세요.");
          break;
        } else if (endhbrseq.value === 0 || endhbrseq === "0") {
          alert("도착항을 선택해주세요.");
          break;
        }

        const url =
          "https://api.careid.xyz/proxy/kcom/cnt/getAjaxHbrDistList.do";

        const params = {
          strhbrseq: Number(strhbrseq),
          endhbrseq: Number(endhbrseq),
          domst: "N",
        };

        let resultArr = null;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(params).toString(),
        };

        await fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              alert("해상 거리 정보를 불러올 수 없습니다. ERROR");
            }
            return response.json();
          })
          .then((data) => {
            resultArr = data["RESULT_DATA"];
          })
          .catch((error) => {
            alert("해상 거리 정보를 불러올 수 없습니다. ERROR");
          });

        if (!document.getElementById("check-dont-know").checked) {
          let maxHbr = resultArr.reduce((max, current) => {
            return current.dist > max.dist ? current : max;
          });
          postData["destination"] = maxHbr.dest_hbr_nm;
          postData["stopover"] = maxHbr.via_hbr_nm;
          postData["departure"] = maxHbr.dprt_hbr_nm;
          postData["dist"] = maxHbr.dist;
        }

        if (unknownDistance.checked) {
          postData["transport_distance"] = null;
        } else {
          if (!inputDistance.value) {
            flag_stop = true;
          }
          postData["transport_distance"] = parseFloat(inputDistance.value);
        }
        if (unknownAmount.checked) {
          postData["transport_amount"] = null;
        } else {
          if (!inputAmount.value) {
            flag_stop = true;
          }
          postData["transport_amount"] = parseFloat(inputAmount.value);
        }
        if (unknownEfficiency.checked) {
          postData["transport_efficiency"] = null;
        } else {
          if (!inputEfficiency.value) {
            flag_stop = true;
          }
          postData["transport_efficiency"] = parseFloat(inputEfficiency.value);
        }
        if (unknownAmount.checked) {
          postData["transport_electricity"] = null;
        } else {
          if (!inputElectricity.value) {
            flag_stop = true;
          }
          postData["transport_electricity"] = parseFloat(
            inputElectricity.value
          );
        }
        if (unknownWTT.checked) {
          postData["transport_wtt"] = null;
        } else {
          if (!inputWTT.value) {
            flag_stop = true;
          }
          postData["transport_wtt"] = parseFloat(inputWTT.value);
        }
        if (unknownTTW.checked) {
          postData["transport_ttw"] = null;
        } else {
          if (!inputTTW.value) {
            flag_stop = true;
          }
          postData["transport_ttw"] = parseFloat(inputTTW.value);
        }
        if (unknownDensity.checked) {
          postData["transport_diesel_density"] = null;
        } else {
          if (!inputDensity.value) {
            flag_stop = true;
          }
          postData["transport_diesel_density"] = parseFloat(inputDensity.value);
        }
        if (unknownRecondition.checked) {
          postData["transport_recondition_elec"] = null;
        } else {
          if (!inputRecondition.value) {
            flag_stop = true;
          }
          postData["transport_recondition_elect"] = parseFloat(
            inputRecondition.value
          );
        }

        if (flag_stop) {
          alert("입력되지 않은 값이 존재합니다. 값을 모를 경우 체크해주세요.");
          break;
        }

        let responseData = null;
        const API_URL = "https://api.careid.xyz/calculator/calc";
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => {
            if (!response.ok) {
              alert("API 서버로부터 응답이 옳지 않습니다.");
            }
            return response.json();
          })
          .then((data) => {
            responseData = data.result.data;
            globalResponseData = data.result.data;
          })
          .catch((error) => {
            alert("API 서버로부터 응답이 옳지 않습니다.");
            return;
          });
        // ---------- 여기서 부터 result 값 입력 시작
        // 1번 라인 변경
        document.getElementById("total-carbon").innerText = responseData.total;
        document.getElementById("bar-value-manufacturing").style.width =
          responseData.manufacturing_ratio;
        document.getElementById("bar-value-transport").style.width =
          responseData.transport_ratio;
        document.getElementById("bar-value-maintaince").style.width =
          responseData.maintaince_ratio;
        document.getElementById("bar-value-retire").style.width =
          responseData.retire_ratio;
        document.getElementById("manufacturing-amount-kg").innerText =
          responseData.manufacturing.toFixed(2);
        document.getElementById("transport-amount-kg").innerText =
          responseData.transport.toFixed(2);
        document.getElementById("maintaince-amount-kg").innerText =
          responseData.maintaince.toFixed(2);
        document.getElementById("retire-amount-kg").innerText =
          responseData.retire.toFixed(2);
        // 2번 라인 변경
        document.getElementById("vg-manufacturing").style.height =
          responseData.manufacturing_ratio;
        document.getElementById("vg-manufacturing-percent").innerText =
          responseData.manufacturing_ratio;
        document.getElementById("vg-manufacturing-kg").innerHTML =
          responseData.manufacturing.toFixed(3) + " KgCo<sub>2</sub>e";
        document.getElementById("vg-transport").style.height =
          responseData.transport_ratio;
        document.getElementById("vg-transport-percent").innerText =
          responseData.transport_ratio;
        document.getElementById("vg-transport-kg").innerHTML =
          responseData.transport.toFixed(3) + " KgCo<sub>2</sub>e";
        document.getElementById("vg-maintaince").style.height =
          responseData.maintaince_ratio;
        document.getElementById("vg-maintaince-percent").innerText =
          responseData.maintaince_ratio;
        document.getElementById("vg-maintaince-kg").innerHTML =
          responseData.maintaince.toFixed(3) + " KgCo<sub>2</sub>e";
        document.getElementById("vg-retire").style.height =
          responseData.retire_ratio;
        document.getElementById("vg-retire-percent").innerText =
          responseData.retire_ratio;
        document.getElementById("vg-retire-kg").innerHTML =
          responseData.retire.toFixed(3) + " KgCo<sub>2</sub>e";
        // 3번 라인 변경
        document.getElementById("manufacturing-big-value").innerHTML =
          responseData.manufacturing.toFixed(3) + " kgCo<sub>2</sub>e";
        document.getElementById("manufacturing-big-percent").innerText =
          responseData.manufacturing_ratio;
        document.querySelector(".manufacturing-items").innerHTML = "";
        for (let i = 0; i < responseData.materials.length; i++) {
          let targetContainer = document.querySelector(".manufacturing-items");
          targetContainer.innerHTML += `
            <div class="manufacturing-item">
              <div>${responseData.materials[i].name_kr}</div>
              <div>${responseData.materials[i].name_en}</div>
              <div class="material-detail">
                <div>소재 비율<br />Material Ratio</div>
                <div class="material-detail-percent">${
                  responseData.materials[i].ratio + "%"
                }</div>
              </div>
              <div class="material-detail">
                <div>소재 탄소량<br />Material Carbon</div>
                <div class="material-detail-kg">${responseData.materials[
                  i
                ].carbon_amount.toFixed(3)} KgCo<sub>2</sub>e</div>
              </div>
           </div>`;
        }
        let targetContainer = document.querySelector(".manufacturing-items");
        targetContainer.innerHTML += `
            <div class="manufacturing-item">
              <div>의류 제작 공정</div>
              <div>Manufacturing-process</div>
              <div class="material-detail">
                <div>의류를 제작하는데<br>발생하는 탄소량입니다.</div>
                <div class="material-detail-percent">
                </div>
              </div>
              <div class="material-detail">
                <div>탄소 발생량<br />Carbon Amount</div>
                <div class="material-detail-kg">${responseData.manufacturing_amount_category.toFixed(
                  3
                )} KgCo<sub>2</sub>e</div>
              </div>
           </div>`;
        // 4번 라인 변경
        document.getElementById("transport-big-value").innerHTML =
          responseData.transport.toFixed(3) + " kgCo<sub>2</sub>e";
        document.getElementById("transport-big-percent").innerText =
          responseData.transport_ratio;
        document.getElementById("departure-text").innerText =
          responseData.departure ? responseData.departure : "unknown";
        document.getElementById("stopover-text").innerText =
          responseData.stopover ? responseData.stopover : "unknown";
        document.getElementById("destination-text").innerText =
          responseData.destination ? responseData.destination : "unknown";
        document.getElementById("departure2-text").innerText =
          responseData.departure ? responseData.departure : "unknown";
        document.getElementById("stopover2-text").innerText =
          responseData.stopover ? responseData.stopover : "unknown";
        document.getElementById("destination2-text").innerText =
          responseData.destination ? responseData.destination : "unknown";
        document.getElementById("sailing-distance").innerText =
          responseData.distance_sea
            ? responseData.distance_sea + " Km"
            : "unknown";
        document.getElementById("distance-car").innerText =
          responseData.distance_car
            ? responseData.distance_car + " Km"
            : "unknown";
        document.getElementById("amount-car").innerText =
          responseData.amount_car
            ? responseData.amount_car + " ton"
            : "unknown";
        document.getElementById("efficiency-car").innerText =
          responseData.efficiency_car
            ? responseData.efficiency_car + " Km/L"
            : "unknown";
        document.getElementById("wtt").innerText = responseData.wwt
          ? responseData.wwt + " kgDiesel"
          : "unknown";
        document.getElementById("ttw").innerText = responseData.ttw
          ? responseData.ttw + " literDiesel"
          : "unknown";
        document.getElementById("diesel-density").innerText =
          responseData.density
            ? responseData.density + " Kg/Liters"
            : "unknwon";
        document.getElementById("electricity-car").innerHTML =
          responseData.electricity_car
            ? responseData.electricity_car + " KgCo<sub>2</sub>e/kwh"
            : "unknown";

        // 5번 라인 변경
        document.getElementById("maintaince-big-value").innerHTML =
          responseData.maintaince.toFixed(3) + " kgCo<sub>2</sub>e";
        document.getElementById("maintaince-big-percent").innerText =
          responseData.maintaince_ratio;
        document.getElementById("washing-month").innerText =
          responseData.washing_month;
        document.getElementById("washing-year").innerText =
          responseData.washing_year;
        document.getElementById("season").innerText = responseData.season;
        document.getElementById("lifespan").innerText = responseData.lifespan;
        document.getElementById("washing-carbon").innerHTML =
          responseData.washing_carbon + " kgCo<sub>2</sub>e";

        // 6번 라인 변경
        document.getElementById("retire-big-value").innerHTML =
          responseData.retire.toFixed(3) + " kgCo<sub>2</sub>e";
        document.getElementById("retire-big-percent").innerText =
          responseData.retire_ratio;
        document.getElementById("carbon-retire-recycle").innerHTML =
          responseData.carbon_retire_recycle + " kgCo<sub>2</sub>e";
        document.getElementById("carbon-retire").innerHTML =
          responseData.carbon_retire + " kgCo<sub>2</sub>e";
        document.getElementById("carbon-recycle").innerHTML =
          responseData.carbon_recycle + " kgCo<sub>2</sub>e";
        document.getElementById("carbon-recycle-benefit").innerHTML =
          responseData.carbon_recycle_benefit + " kgCo<sub>2</sub>e";
        document.getElementById("ratio-recycle-benefit").innerText =
          responseData.ratio_recycle_benefit.toFixed(0) + "%";

        // 7번 라인 변경
        document.getElementById("to-phone").innerText = responseData.to_phone;
        document.getElementById("to-distance").innerText =
          responseData.to_distance;
        document.getElementById("to-tree").innerText = responseData.to_tree;
        document.getElementById("to-water").innerText = responseData.to_water;

        inputTransport.style.display = "none";
        loadingPage.style.display = "flex";
        currentPage += 2;
        document.getElementById("calc-loading").style.display = "flex";
        btnNext.style.display = "none";
        btnPrev.style.display = "none";
        setTimeout(function () {
          document.getElementById("calc-loading").style.display = "none";
          document.getElementById("calc-result").style.display = "flex";
          btnPrev.style.display = "flex";
          btnSave.style.display = "flex";
        }, 3200);
        break;
      case 6:
        loadingPage.style.display = "none";
        resultPage.style.display = "flex";
        btnNext.style.display = "none";

        currentPage += 1;
        break;
    }
  });
  //* ------------------------------- 이전 버튼 클릭
  btnPrev.addEventListener("click", async () => {
    switch (currentPage) {
      // 카테고리 페이지 일때
      case 2:
        document.getElementById("slash-1").style.display = "none";
        document.getElementById("prd-name").style.display = "none";
        btnPrev.style.display = "none";
        inputName.style.display = "flex";
        inputCategory.style.display = "none";
        currentPage -= 1;
        break;
      // 에미션 페이지 일때
      case 3:
        document.getElementById("slash-2").style.display = "none";
        document.getElementById("prd-category").style.display = "none";
        inputCategory.style.display = "flex";
        inputEmission.style.display = "none";
        document.getElementById("percent-bar").style.display = "none";
        document.getElementById("percent-text").style.display = "none";
        document.getElementById("percent-warn").style.display = "none";
        currentPage -= 1;
        break;
      // 운송 페이지 일때
      case 4:
        inputEmission.style.display = "flex";
        inputTransport.style.display = "none";
        document.getElementById("percent-bar").style.display = "flex";
        document.getElementById("percent-text").style.display = "flex";
        currentPage -= 1;
        break;
      // 결과 페이지 일때
      case 6:
        inputTransport.style.display = "flex";
        resultPage.style.display = "none";
        btnNext.style.display = "flex";
        btnPrev.style.display = "flex";
        btnSave.style.display = "none";
        currentPage -= 2;
        break;
    }
  });
  //* ----------------------------------------------------------------------------- 운송정보 know/unknow 이벤트 추가
  document
    .getElementById("transport-known-btn")
    .addEventListener("click", function () {
      document.getElementById("toggle-transport").style.display = "flex";
      document.getElementById("transport-known-btn").style.backgroundColor =
        "#141414";
      document.getElementById("know-text-kr").style.color = "white";
      document.getElementById("know-text-en").style.color = "white";

      document.getElementById("transport-unknown-btn").style.backgroundColor =
        "white";
      document.getElementById("unknow-text-kr").style.color = "black";
      document.getElementById("unknow-text-en").style.color = "black";

      document.getElementById("check-dont-know").checked = false;
      document.getElementById("select-departure").disabled = false;
      document.getElementById("select-destination").disabled = false;

      document.getElementById("unknown-distance").checked = false;
      document.getElementById("unknown-amount").checked = false;
      document.getElementById("unknown-efficiency").checked = false;
      document.getElementById("unknown-electricity").checked = false;
      document.getElementById("unknown-diesel-wtt").checked = false;
      document.getElementById("unknown-diesel-ttw").checked = false;
      document.getElementById("unknown-diesel-density").checked = false;
      document.getElementById("unknown-recondition-elec").checked = false;

      document.getElementById("input-distance").disabled = false;
      document.getElementById("input-amount").disabled = false;
      document.getElementById("input-efficiency").disabled = false;
      document.getElementById("input-electricity").disabled = false;
      document.getElementById("input-diesel-wtt").disabled = false;
      document.getElementById("input-diesel-ttw").disabled = false;
      document.getElementById("input-diesel-density").disabled = false;
      document.getElementById("input-recondition-elec").disabled = false;

      document.getElementById("check-not-filled").checked = false;
    });
  document
    .getElementById("transport-unknown-btn")
    .addEventListener("click", function () {
      document.getElementById("toggle-transport").style.display = "none";
      document.getElementById("transport-unknown-btn").style.backgroundColor =
        "#141414";
      document.getElementById("unknow-text-kr").style.color = "white";
      document.getElementById("unknow-text-en").style.color = "white";
      document.getElementById("transport-known-btn").style.backgroundColor =
        "white";
      document.getElementById("know-text-kr").style.color = "black";
      document.getElementById("know-text-en").style.color = "black";

      document.getElementById("check-dont-know").checked = true;
      document.getElementById("unknown-distance").checked = true;
      document.getElementById("unknown-amount").checked = true;
      document.getElementById("unknown-efficiency").checked = true;
      document.getElementById("unknown-electricity").checked = true;
      document.getElementById("unknown-diesel-wtt").checked = true;
      document.getElementById("unknown-diesel-ttw").checked = true;
      document.getElementById("unknown-diesel-density").checked = true;
      document.getElementById("unknown-recondition-elec").checked = true;
    });
  // 전체 체크
  document
    .getElementById("check-not-filled")
    .addEventListener("change", (event) => {
      if (event.target.checked) {
        const inputArr = [
          "input-distance",
          "input-amount",
          "input-efficiency",
          "input-electricity",
          "input-diesel-wtt",
          "input-diesel-ttw",
          "input-diesel-density",
          "input-recondition-elec",
        ];
        const checkArr = [
          "unknown-distance",
          "unknown-amount",
          "unknown-efficiency",
          "unknown-electricity",
          "unknown-diesel-wtt",
          "unknown-diesel-ttw",
          "unknown-diesel-density",
          "unknown-recondition-elec",
        ];
        for (let i = 0; i < inputArr.length; i++) {
          const inputItem = document.getElementById(inputArr[i]);
          const value = inputItem.value.trim();
          if (value === "") {
            const checkItem = document.getElementById(checkArr[i]);
            checkItem.checked = true;
            inputItem.disabled = true;
          }
        }
      } else {
        const inputArr = [
          "input-distance",
          "input-amount",
          "input-efficiency",
          "input-electricity",
          "input-diesel-wtt",
          "input-diesel-ttw",
          "input-diesel-density",
          "input-recondition-elec",
        ];
        const checkArr = [
          "unknown-distance",
          "unknown-amount",
          "unknown-efficiency",
          "unknown-electricity",
          "unknown-diesel-wtt",
          "unknown-diesel-ttw",
          "unknown-diesel-density",
          "unknown-recondition-elec",
        ];
        for (let i = 0; i < inputArr.length; i++) {
          document.getElementById(inputArr[i]).disabled = false;
          document.getElementById(checkArr[i]).checked = false;
        }
      }
    });

  //* ----------------------------------------------------------------------------- check dont know 이벤트 추가
  document.querySelectorAll(".check-dont-know").forEach(function (element) {
    element.addEventListener("click", function () {
      const checkbox = element.querySelector('input[type="checkbox"]');
      if (!checkbox.checked) {
        document.getElementById("check-not-filled").checked = false;
      }
    });
  });

  //* ----------------------------------------------------------------------------- 카테고리 클릭시 스크롤
  // 색상 초기화
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
  document.getElementsByClassName("class-item-name-kr")[0].style.color =
    "#000000";
  document.getElementsByClassName("class-item-name-en")[0].style.color =
    "#000000";

  // 클릭 이벤트
  let scrollContainer = document.querySelector(".class-small");
  Array.prototype.forEach.call(categoryItems, function (item) {
    item.addEventListener("click", function () {
      Array.prototype.forEach.call(categoryItems, function (innerItem) {
        let krNameElement =
          innerItem.getElementsByClassName("class-item-name-kr")[0];
        let enNameElement =
          innerItem.getElementsByClassName("class-item-name-en")[0];
        if (krNameElement) krNameElement.style.color = "#999999";
        if (enNameElement) enNameElement.style.color = "#999999";
      });

      let krNameElement = item.getElementsByClassName("class-item-name-kr")[0];
      let enNameElement = item.getElementsByClassName("class-item-name-en")[0];
      if (krNameElement) krNameElement.style.color = "#000000";
      if (enNameElement) enNameElement.style.color = "#000000";

      let classNameElements = document.getElementsByClassName("class-name");
      for (let i = 0; i < classNameElements.length; i++) {
        let classNameElement = classNameElements[i];

        if (
          classNameElement.textContent.trim() ===
          (krNameElement.textContent + " " + enNameElement.textContent)
            .replace("(", "")
            .replace(")", "")
            .trim()
        ) {
          classNameElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          setTimeout(function () {
            scrollContainer.scrollTop -= 25;
          }, 500);
          break;
        }
      }
    });
  });

  //* ----------------------------------------------------------------------------- 드롭다운 메뉴 관련
  const calcInputEmission = document.getElementById("calc-input-emission");
  const addEmissionBtn = calcInputEmission.querySelector(".add-emission-btn");

  const updatePercentValue = () => {
    let total = 0;
    calcInputEmission
      .querySelectorAll(".emission-item .input-percentage")
      .forEach((input) => {
        total += parseInt(input.value) || 0;
      });
    percentBar.style.width = Math.min(total, 100) + "%";
    percentText.innerText = String(total) + "%";
    if (total > 100) {
      percentText.style.color = "red";
      percentBar.style.backgroundColor = "red";
      percentWarn.style.display = "block";
    } else {
      percentText.style.color = "black";
      percentBar.style.backgroundColor = "black";
      percentWarn.style.display = "none";
    }
  };

  const closeAllDropdownsExcept = (currentItem) => {
    calcInputEmission
      .querySelectorAll(".emission-item .dropdown-menu")
      .forEach((menu) => {
        if (menu !== currentItem) {
          menu.style.display = "none";
        }
      });
  };

  const createEmissionItem = () => {
    const emissionItem = document.createElement("div");
    emissionItem.classList.add("emission-item");
    emissionItem.innerHTML = `
          <div class="dropdown-wrapper">
              <div class="dropdown-btn">
                  <span id="selected-item" class="selected-item">소재 선택 ( Select Material )</span>
              </div>
              <div class="dropdown-menu">
                  <div class="item active"></div>
                  <div class="item">면 / Cotton</div>
                  <div class="item">나일론 / Nylon</div>
                  <div class="item">폴리에스터 / Polyester</div>
                  <div class="item">가죽 / Leather</div>
                  <div class="item">울 / Wool</div>
                  <div class="item">캐시미어 / Cashmere</div>
                  <div class="item">플리스 / Fleece</div>
                  <div class="item">퍼 / Fur</div>
                  <div class="item">모헤어 / Mohair</div>
                  <div class="item">아크릴 / Acrylic</div>
                  <div class="item">포플린 / Poplin</div>
                  <div class="item">린넨 / Flax</div>
                  <div class="item">플란넬 / Flannel</div>
                  <div class="item">저지 / Jerset</div>
                  <div class="item">데님 / Denim</div>
                  <div class="item">마 / Jute</div>
                  <div class="item">네이온 / Rayon</div>
                  <div class="item">실크 / Silk</div>
                  <div class="item">스판덱스 / Spandex</div>
                  <div class="item">모달 / Modal</div>
                  <div class="item">비스코스 / Viscose</div>
                  <div class="item">폴리우레탄 / Polyurethane</div>
                  <div class="item">고무 / Rubber</div>
                  <div class="item">나무 / Wood</div>
                  <div class="item">플라스틱 / Plastic</div>
                  <div class="item">폴리비닐 / PVC</div>
                  <div class="item">스웨이드 / Suede</div>
              </div>
          </div>
          <input type="number" placeholder="00%" class="input-percentage" />
          <img class="cancel-btn" src="https://careid.s3.ap-northeast-2.amazonaws.com/icons/cancel.svg" />
      `;

    emissionItem
      .querySelector(".dropdown-btn")
      .addEventListener("click", () => {
        const dropdownMenu = emissionItem.querySelector(".dropdown-menu");
        closeAllDropdownsExcept(dropdownMenu);
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });

    emissionItem.querySelectorAll(".dropdown-menu .item").forEach((item) => {
      item.addEventListener("click", () => {
        const selectedItem = emissionItem.querySelector("#selected-item");
        selectedItem.textContent = item.textContent;
        emissionItem.querySelector(".dropdown-menu").style.display = "none";
      });
    });

    emissionItem.querySelector(".cancel-btn").addEventListener("click", () => {
      emissionItem.remove();
      updatePercentValue();
    });

    emissionItem
      .querySelector(".input-percentage")
      .addEventListener("input", (event) => {
        const value = event.target.value;
        if (value < 0) {
          event.target.value = 0;
        } else if (value > 100) {
          event.target.value = 100;
        }
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
        updatePercentValue();
      });

    return emissionItem;
  };

  addEmissionBtn.addEventListener("click", () => {
    const newItem = createEmissionItem();
    calcInputEmission.insertBefore(newItem, addEmissionBtn);
    updatePercentValue();
  });

  document.querySelectorAll(".emission-item").forEach((emissionItem) => {
    emissionItem
      .querySelector(".dropdown-btn")
      .addEventListener("click", () => {
        const dropdownMenu = emissionItem.querySelector(".dropdown-menu");
        closeAllDropdownsExcept(dropdownMenu);
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });

    emissionItem.querySelectorAll(".dropdown-menu .item").forEach((item) => {
      item.addEventListener("click", () => {
        const selectedItem = emissionItem.querySelector("#selected-item");
        selectedItem.textContent = item.textContent;
        emissionItem.querySelector(".dropdown-menu").style.display = "none";
      });
    });

    emissionItem.querySelector(".cancel-btn").addEventListener("click", () => {
      emissionItem.remove();
      updatePercentValue();
    });

    emissionItem
      .querySelector(".input-percentage")
      .addEventListener("input", (event) => {
        const value = event.target.value;
        if (value < 0) {
          event.target.value = 0;
        } else if (value > 100) {
          event.target.value = 100;
        }
        updatePercentValue();
      });
  });
  //* ----------------------------------------------------------------------------- 드롭다운 메뉴 관련 끝
  //* ----------------------------------------------------------------------------- transport 정보 가져오기
  // 도착항 정보 가져오기
  document
    .getElementById("select-departure")
    .addEventListener("change", async function () {
      let selectedValue = this.value;
      const url = "https://api.careid.xyz/proxy/kcom/cnt/getAjaxEndHbrList.do";

      const params = {
        hbrseq: selectedValue,
        domst: "N",
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params).toString(), // 파라미터를 URL 인코딩된 문자열로 변환
      };

      let desinationArr = null;

      await fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          desinationArr = data;
        })
        .catch((error) => {
          console.log(
            "There has been a problem with your fetch operation" + error
          );
        });

      let selectDesitnation = document.getElementById("select-destination");
      selectDesitnation.innerHTML = "";
      const option = document.createElement("option");
      option.text = "도착항 선택 (Destination)";
      option.value = 0;
      option.disabled = true;
      option.selected = true;
      selectDesitnation.add(option);

      for (let i = 0; i < desinationArr.length; i++) {
        const option = document.createElement("option");
        option.text = desinationArr[i].hbr_nm;
        option.value = desinationArr[i].hbr_seq;
        selectDesitnation.add(option);
      }
    });
  document
    .getElementById("check-dont-know")
    .addEventListener("change", function () {
      const selectDeparture = document.getElementById("select-departure");
      const selectDestination = document.getElementById("select-destination");

      if (this.checked) {
        selectDeparture.disabled = true;
        selectDestination.disabled = true;
      } else {
        selectDeparture.disabled = false;
        selectDestination.disabled = false;
      }
    });

  //* ------------------------------------------------------------------------------ transport check 기능
  unknownDistance.addEventListener("change", function () {
    if (unknownDistance.checked) {
      inputDistance.disabled = true;
    } else {
      inputDistance.disabled = false;
    }
  });
  unknownAmount.addEventListener("change", function () {
    if (unknownAmount.checked) {
      inputAmount.disabled = true;
    } else {
      inputAmount.disabled = false;
    }
  });
  unknownEfficiency.addEventListener("change", function () {
    if (unknownEfficiency.checked) {
      inputEfficiency.disabled = true;
    } else {
      inputEfficiency.disabled = false;
    }
  });
  unknownElectricity.addEventListener("change", function () {
    if (unknownElectricity.checked) {
      inputElectricity.disabled = true;
    } else {
      inputElectricity.disabled = false;
    }
  });
  unknownWTT.addEventListener("change", function () {
    if (unknownWTT.checked) {
      inputWTT.disabled = true;
    } else {
      inputWTT.disabled = false;
    }
  });
  unknownTTW.addEventListener("change", function () {
    if (unknownTTW.checked) {
      inputTTW.disabled = true;
    } else {
      inputTTW.disabled = false;
    }
  });
  unknownDensity.addEventListener("change", function () {
    if (unknownDensity.checked) {
      inputDensity.disabled = true;
    } else {
      inputDensity.disabled = false;
    }
  });
  unknownRecondition.addEventListener("change", function () {
    if (unknownRecondition.checked) {
      inputRecondition.disabled = true;
    } else {
      inputRecondition.disabled = false;
    }
  });
  document
    .getElementById("hover-info")
    .addEventListener("mouseover", function () {
      document.getElementById("info-text").style.display = "block";
    });

  document
    .getElementById("hover-info")
    .addEventListener("mouseout", function () {
      document.getElementById("info-text").style.display = "none";
    });

  //* ---------------------------------------------------------------------------------- 결과 저장 버튼

  const modal = document.getElementById("modal");
  const cancelBtn = document.getElementById("cancel-btn");

  const modalAuth = document.getElementById("modal-authorization");
  const cancelAuthBtn = document.getElementById("auth-cancel-btn");

  btnSave.onclick = function () {
    modal.style.display = "block";
  };

  cancelBtn.onclick = function () {
    modal.style.display = "none";
  };
  cancelAuthBtn.onclick = function () {
    modalAuth.style.display = "none";
  };

  // 모달 바깥을 클릭하면 모달을 닫습니다.
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == modalAuth) {
      modalAuth.style.display = "none";
    }
  };

  // api 저장 요청
  document
    .getElementById("confirm-btn")
    .addEventListener("click", async function () {
      const password = document.getElementById("input-password");
      const passwordConfirm = document.getElementById("input-password-confirm");

      document.getElementById("btn-save").style.display = "none";

      globalResponseData["title"] =
        document.getElementById("prd-name").innerText;
      globalResponseData["category"] =
        document.getElementById("prd-category").innerText;
      globalResponseData["author"] =
        document.getElementById("calc-author").value;
      if (password.value !== passwordConfirm.value) {
        alert("비밀번호가 일치하지 않습니다. Password does not match.");
      } else if (password.value.trim() === "") {
        alert("올바른 비밀번호를 입력해주세요. Please enter valid password.");
      } else {
        globalResponseData["password"] =
          document.getElementById("input-password").value;
        const API_URL = "https://api.careid.xyz/calculator/calc-archive";
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(globalResponseData),
        })
          .then((response) => {
            if (!response.ok) {
              alert("API 서버로부터 응답이 옳지 않습니다.");
            }
            alert("저장되었습니다.");
            modal.style.display = "none";
            return response.json();
          })
          .then((data) => {
            responseData = data.result.data;
            globalResponseData = data.result.data;
          })
          .catch((error) => {
            alert("API 서버로부터 응답이 옳지 않습니다.");
            return;
          });
      }
    });
  //* ---------------------------------------------------------------------------------- 아카이빙 열기
  // 아카이브 보기 버튼 눌렀을 때
  document
    .getElementById("btn-archive")
    .addEventListener("click", async function () {
      document.getElementById("calc-archive").style.display = "flex";
      document.getElementById("calc-input-name").style.display = "none";
      document.getElementById("calc-input-category").style.display = "none";
      document.getElementById("calc-input-emission").style.display = "none";
      document.getElementById("calc-input-transport").style.display = "none";
      document.getElementById("calc-result").style.display = "none";
      document.getElementById("btn-goback").style.display = "flex";
      document.getElementById("btn-prev").style.display = "none";
      document.getElementById("btn-next").style.display = "none";
      document.getElementById("btn-save").style.display = "none";
      document.getElementById("percent-bar").style.display = "none";
      document.getElementById("percent-text").style.display = "none";
      document.getElementById("percent-warn").style.display = "none";
      document.getElementById("btn-gobacklist").style.display = "none";

      const url = new URL("https://api.careid.xyz/calculator/calc-archive");

      const params = {};

      const items = 8;
      const page = 1;

      params["items"] = items;
      params["page"] = page;

      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("서버로 부터 응답을 가져오지 못하였습니다.");
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;

        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";

        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
            <div class="archive-top">
              <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
              <div class="archive-name">${archiveItems[i].title}</div>
              <div class="archive-category">${archiveItems[i].category}</div>
              <div class="archive-carbon">
                <div>${archiveItems[i].total}</div>
                <div>KgCo<sub>2</sub>e</div>
              </div>
            </div>
            <div class="archive-bottom">
              <div class="archive-author">${archiveItems[i].author}</div>
            <div class="archive-date">${
              new Date(archiveItems[i].created_at).toISOString().split("T")[0]
            }</div>
          </div>
        `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";

        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );

        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === currentPage) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });

        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });
  // 아카이브 검색 버튼 눌렀을 때
  document
    .getElementById("archive-search-btn")
    .addEventListener("click", async function () {
      const url = new URL("https://api.careid.xyz/calculator/calc-archive");
      const params = {};

      const author = document
        .getElementById("archive-search-author")
        .value.trim();
      const name = document.getElementById("archive-search-name").value.trim();

      const items = 8;
      const page = 1;

      params["items"] = items;
      params["page"] = page;
      if (name !== "") {
        params["name"] = name;
        sk_name = name;
      } else {
        sk_name = null;
      }
      if (author !== "") {
        params["author"] = author;
        sk_author = author;
      } else {
        sk_author = null;
      }

      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        alert("서버로 부터 응답을 가져오지 못하였습니다.");
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;
        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";
        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
            <div class="archive-top">
              <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
              <div class="archive-name">${archiveItems[i].title}</div>
              <div class="archive-category">${archiveItems[i].category}</div>
              <div class="archive-carbon">
                <div>${archiveItems[i].total}</div>
                <div>KgCo<sub>2</sub>e</div>
              </div>
            </div>
            <div class="archive-bottom">
              <div class="archive-author">${archiveItems[i].author}</div>
            <div class="archive-date">${
              new Date(archiveItems[i].created_at).toISOString().split("T")[0]
            }</div>
          </div>
        `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";
        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );
        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === currentPage) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });
        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });

  // 아카이브 아이템 클릭 하였을 때
  const archiveContent = document.getElementById("archive-content");
  archiveContent.addEventListener("click", function (event) {
    const archiveItem = event.target.closest(".archive-item");

    if (archiveItem) {
      const archiveNo = archiveItem.querySelector(".archive-no");
      if (archiveNo) {
        modalAuth.style.display = "flex";
        const id = archiveNo.innerText.replace("DOC-", "");
        archiveID = id;
      }
    }
  });

  // 아카이브 페이지 네이션 버튼 클릭했을 때
  const pageNumContainer = document.getElementById("page-num");
  pageNumContainer.addEventListener("click", async function (event) {
    // 클릭된 요소가 <div>인지 확인합니다.
    if (event.target && event.target.tagName === "DIV") {
      // innerText가 숫자인지 확인합니다.
      const text = event.target.innerText;
      if (!isNaN(text)) {
        const url = new URL("https://api.careid.xyz/calculator/calc-archive");
        const params = {};
        params["items"] = 8;
        params["page"] = Number(text);
        if (sk_name) {
          params["name"] = sk_name;
        }
        if (sk_author) {
          params["author"] = sk_author;
        }
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          alert("서버로 부터 응답을 가져오지 못하였습니다.");
        } else {
          const data = await response.json();
          archiveItems = data.result.data.result;
          // 모든 archive-item 요소를 삭제
          const archiveContent = document.getElementById("archive-content");
          archiveContent.innerHTML = "";
          // 아카이브 다시 그리기
          for (let i = 0; i < archiveItems.length; i++) {
            const newItem = document.createElement("div");
            newItem.classList.add("archive-item");
            newItem.innerHTML = `
            <div class="archive-top">
              <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
              <div class="archive-name">${archiveItems[i].title}</div>
              <div class="archive-category">${archiveItems[i].category}</div>
              <div class="archive-carbon">
                <div>${archiveItems[i].total}</div>
                <div>KgCo<sub>2</sub>e</div>
              </div>
            </div>
            <div class="archive-bottom">
              <div class="archive-author">${archiveItems[i].author}</div>
            <div class="archive-date">${
              new Date(archiveItems[i].created_at).toISOString().split("T")[0]
            }</div>
          </div>
        `;
            archiveContent.appendChild(newItem);
          }
          // 페이지네이션 그리기
          const pagenation = document.getElementById("page-num");
          pagenation.innerHTML = "";
          const pageInfo = getPagination(
            data.result.data.currentPage,
            data.result.data.totalPages
          );
          for (let i = 0; i < pageInfo.length; i++) {
            const pageIndex = document.createElement("div");
            pageIndex.innerText = pageInfo[i];
            document.getElementById("page-num").appendChild(pageIndex);
          }
          const pageNumContainer = document.getElementById("page-num");
          const pageDivs = pageNumContainer.querySelectorAll("div");
          pageDivs.forEach((div) => {
            if (parseInt(div.textContent) === params["page"]) {
              // 일치하는 경우 font-weight: 600 설정
              div.style.fontWeight = "800";
            } else {
              // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
              div.style.fontWeight = "normal";
            }
          });
          sk_currentPage = data.result.data.currentPage;
          sk_maxPage = data.result.data.totalPages;
        }
      }
    }
  });

  // 아카이브 toFirstPage 버튼
  document
    .getElementById("page-first")
    .addEventListener("click", async function () {
      if (sk_currentPage === 1) {
        return;
      }
      const url = new URL("https://api.careid.xyz/calculator/calc-archive");
      const params = {};
      params["items"] = 8;
      params["page"] = 1;
      if (sk_name) {
        params["name"] = sk_name;
      }
      if (sk_author) {
        params["author"] = sk_author;
      }
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;
        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";
        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
          <div class="archive-top">
            <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
            <div class="archive-name">${archiveItems[i].title}</div>
            <div class="archive-category">${archiveItems[i].category}</div>
            <div class="archive-carbon">
              <div>${archiveItems[i].total}</div>
              <div>KgCo<sub>2</sub>e</div>
            </div>
          </div>
          <div class="archive-bottom">
            <div class="archive-author">${archiveItems[i].author}</div>
          <div class="archive-date">${
            new Date(archiveItems[i].created_at).toISOString().split("T")[0]
          }</div>
        </div>
      `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";
        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );
        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === params["page"]) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });
        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });

  // 아카이브 toPrevPage 버튼
  document
    .getElementById("page-prev")
    .addEventListener("click", async function () {
      if (sk_currentPage === 1) {
        return;
      }
      const url = new URL("https://api.careid.xyz/calculator/calc-archive");
      const params = {};
      params["items"] = 8;
      params["page"] = sk_currentPage - 1;
      if (sk_name) {
        params["name"] = sk_name;
      }
      if (sk_author) {
        params["author"] = sk_author;
      }
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;
        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";
        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
          <div class="archive-top">
            <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
            <div class="archive-name">${archiveItems[i].title}</div>
            <div class="archive-category">${archiveItems[i].category}</div>
            <div class="archive-carbon">
              <div>${archiveItems[i].total}</div>
              <div>KgCo<sub>2</sub>e</div>
            </div>
          </div>
          <div class="archive-bottom">
            <div class="archive-author">${archiveItems[i].author}</div>
          <div class="archive-date">${
            new Date(archiveItems[i].created_at).toISOString().split("T")[0]
          }</div>
        </div>
      `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";
        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );
        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === params["page"]) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });
        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });

  // 아카이브 toNextPage 버튼
  document
    .getElementById("page-next")
    .addEventListener("click", async function () {
      if (sk_currentPage === sk_maxPage) {
        return;
      }
      const url = new URL("https://api.careid.xyz/calculator/calc-archive");
      const params = {};
      params["items"] = 8;
      params["page"] = sk_currentPage + 1;
      if (sk_name) {
        params["name"] = sk_name;
      }
      if (sk_author) {
        params["author"] = sk_author;
      }
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;
        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";
        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
          <div class="archive-top">
            <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
            <div class="archive-name">${archiveItems[i].title}</div>
            <div class="archive-category">${archiveItems[i].category}</div>
            <div class="archive-carbon">
              <div>${archiveItems[i].total}</div>
              <div>KgCo<sub>2</sub>e</div>
            </div>
          </div>
          <div class="archive-bottom">
            <div class="archive-author">${archiveItems[i].author}</div>
          <div class="archive-date">${
            new Date(archiveItems[i].created_at).toISOString().split("T")[0]
          }</div>
        </div>
      `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";
        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );
        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === params["page"]) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });
        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });
  // 아카이브 toLastPage 버튼
  document
    .getElementById("page-last")
    .addEventListener("click", async function () {
      if (sk_currentPage === sk_maxPage) {
        return;
      }
      const url = new URL("https://api.careid.xyz/calculator/calc-archive");
      const params = {};
      params["items"] = 8;
      params["page"] = sk_maxPage;
      if (sk_name) {
        params["name"] = sk_name;
      }
      if (sk_author) {
        params["author"] = sk_author;
      }
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      } else {
        const data = await response.json();
        archiveItems = data.result.data.result;
        // 모든 archive-item 요소를 삭제
        const archiveContent = document.getElementById("archive-content");
        archiveContent.innerHTML = "";
        // 아카이브 다시 그리기
        for (let i = 0; i < archiveItems.length; i++) {
          const newItem = document.createElement("div");
          newItem.classList.add("archive-item");
          newItem.innerHTML = `
          <div class="archive-top">
            <div class="archive-no">DOC-${String(archiveItems[i].no)}</div>
            <div class="archive-name">${archiveItems[i].title}</div>
            <div class="archive-category">${archiveItems[i].category}</div>
            <div class="archive-carbon">
              <div>${archiveItems[i].total}</div>
              <div>KgCo<sub>2</sub>e</div>
            </div>
          </div>
          <div class="archive-bottom">
            <div class="archive-author">${archiveItems[i].author}</div>
          <div class="archive-date">${
            new Date(archiveItems[i].created_at).toISOString().split("T")[0]
          }</div>
        </div>
      `;
          archiveContent.appendChild(newItem);
        }
        // 페이지네이션 그리기
        const pagenation = document.getElementById("page-num");
        pagenation.innerHTML = "";
        const pageInfo = getPagination(
          data.result.data.currentPage,
          data.result.data.totalPages
        );
        for (let i = 0; i < pageInfo.length; i++) {
          const pageIndex = document.createElement("div");
          pageIndex.innerText = pageInfo[i];
          document.getElementById("page-num").appendChild(pageIndex);
        }
        const pageNumContainer = document.getElementById("page-num");
        const pageDivs = pageNumContainer.querySelectorAll("div");
        pageDivs.forEach((div) => {
          if (parseInt(div.textContent) === params["page"]) {
            // 일치하는 경우 font-weight: 600 설정
            div.style.fontWeight = "800";
          } else {
            // 일치하지 않는 경우 font-weight: normal 설정 (원래대로 돌려놓기 위해)
            div.style.fontWeight = "normal";
          }
        });
        sk_currentPage = data.result.data.currentPage;
        sk_maxPage = data.result.data.totalPages;
      }
    });

  // 돌아가기 버튼 다시 눌렀을 때
  document.getElementById("btn-goback").addEventListener("click", function () {
    if (currentPage === 1) {
      document.getElementById("calc-archive").style.display = "none";
      btnNext.style.display = "flex";
      btnPrev.style.display = "none";
      document.getElementById("btn-save").style.display = "none";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-input-name").style.display = "flex";
    } else if (currentPage === 2) {
      document.getElementById("calc-archive").style.display = "none";
      btnNext.style.display = "flex";
      btnPrev.style.display = "flex";
      document.getElementById("btn-save").style.display = "none";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-input-category").style.display = "flex";
    } else if (currentPage === 3) {
      document.getElementById("calc-archive").style.display = "none";
      btnNext.style.display = "flex";
      btnPrev.style.display = "flex";
      document.getElementById("btn-save").style.display = "none";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-input-emission").style.display = "flex";
      document.getElementById("percent-bar").style.display = "flex";
      document.getElementById("percent-text").style.display = "flex";
    } else if (currentPage === 4) {
      document.getElementById("calc-archive").style.display = "none";
      btnNext.style.display = "flex";
      btnPrev.style.display = "flex";
      document.getElementById("btn-save").style.display = "none";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-input-transport").style.display = "flex";
    } else if (currentPage === 6) {
      document.getElementById("calc-archive").style.display = "none";
      btnNext.style.display = "none";
      btnPrev.style.display = "flex";
      document.getElementById("btn-save").style.display = "flex";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-result").style.display = "flex";
    }
  });

  // 목록으로 돌아가기 버튼
  document
    .getElementById("btn-gobacklist")
    .addEventListener("click", function () {
      document.getElementById("calc-result").style.display = "none";
      document.getElementById("calc-archive").style.display = "flex";
      document.getElementById("btn-gobacklist").style.display = "none";
      document.getElementById("btn-goback").style.display = "flex";
      document.getElementById("slash-1").style.display = "none";
      document.getElementById("prd-name").style.display = "none";
      document.getElementById("slash-2").style.display = "none";
      document.getElementById("prd-category").style.display = "none";
    });

  // 아카이브 상세조회
  document
    .getElementById("auth-confirm-btn")
    .addEventListener("click", async function () {
      let stopflag = false;

      let responseData = null;
      const API_URL = "https://api.careid.xyz/calculator/calc-archive-detail";
      const sendData = {
        no: Number(archiveID.replace("DOC-", "")),
        password: document.getElementById("calc-auth-password").value.trim(),
      };
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(sendData),
      })
        .then((response) => {
          if (!response.ok) {
            alert("비밀번호가 일치하지 않습니다.");
            stopflag = true;
            return;
          }
          return response.json();
        })
        .then((data) => {
          responseData = data.result.data;
          globalResponseData = data.result.data;
        })
        .catch((error) => {
          return;
        });
      if (stopflag) {
        return;
      }
      modalAuth.style.display = "none";
      document.getElementById("btn-gobacklist").style.display = "flex";
      document.getElementById("btn-goback").style.display = "none";
      document.getElementById("calc-result").style.display = "flex";
      document.getElementById("calc-archive").style.display = "none";

      document.getElementById("prd-name").style.display = "flex";
      document.getElementById("prd-name").innerText = responseData.title;
      document.getElementById("prd-category").style.display = "flex";
      document.getElementById("prd-category").innerText = responseData.category;

      document.getElementById("slash-1").style.display = "block";
      document.getElementById("slash-2").style.display = "block";

      document.getElementById("total-carbon").innerText = responseData.total;
      document.getElementById("bar-value-manufacturing").style.width =
        responseData.manufacturing_ratio;
      document.getElementById("bar-value-transport").style.width =
        responseData.transport_ratio;
      document.getElementById("bar-value-maintaince").style.width =
        responseData.maintaince_ratio;
      document.getElementById("bar-value-retire").style.width =
        responseData.retire_ratio;
      document.getElementById("manufacturing-amount-kg").innerText =
        responseData.manufacturing.toFixed(2);
      document.getElementById("transport-amount-kg").innerText =
        responseData.transport.toFixed(2);
      document.getElementById("maintaince-amount-kg").innerText =
        responseData.maintaince.toFixed(2);
      document.getElementById("retire-amount-kg").innerText =
        responseData.retire.toFixed(2);
      // 2번 라인 변경
      document.getElementById("vg-manufacturing").style.height =
        responseData.manufacturing_ratio;
      document.getElementById("vg-manufacturing-percent").innerText =
        responseData.manufacturing_ratio;
      document.getElementById("vg-manufacturing-kg").innerHTML =
        responseData.manufacturing.toFixed(3) + " KgCo<sub>2</sub>e";
      document.getElementById("vg-transport").style.height =
        responseData.transport_ratio;
      document.getElementById("vg-transport-percent").innerText =
        responseData.transport_ratio;
      document.getElementById("vg-transport-kg").innerHTML =
        responseData.transport.toFixed(3) + " KgCo<sub>2</sub>e";
      document.getElementById("vg-maintaince").style.height =
        responseData.maintaince_ratio;
      document.getElementById("vg-maintaince-percent").innerText =
        responseData.maintaince_ratio;
      document.getElementById("vg-maintaince-kg").innerHTML =
        responseData.maintaince.toFixed(3) + " KgCo<sub>2</sub>e";
      document.getElementById("vg-retire").style.height =
        responseData.retire_ratio;
      document.getElementById("vg-retire-percent").innerText =
        responseData.retire_ratio;
      document.getElementById("vg-retire-kg").innerHTML =
        responseData.retire.toFixed(3) + " KgCo<sub>2</sub>e";
      // 3번 라인 변경
      document.getElementById("manufacturing-big-value").innerHTML =
        responseData.manufacturing.toFixed(3) + " kgCo<sub>2</sub>e";
      document.getElementById("manufacturing-big-percent").innerText =
        responseData.manufacturing_ratio;
      document.querySelector(".manufacturing-items").innerHTML = "";
      for (let i = 0; i < responseData.materials.length; i++) {
        let targetContainer = document.querySelector(".manufacturing-items");
        targetContainer.innerHTML += `
            <div class="manufacturing-item">
              <div>${responseData.materials[i].name_kr}</div>
              <div>${responseData.materials[i].name_en}</div>
              <div class="material-detail">
                <div>소재 비율<br />Material Ratio</div>
                <div class="material-detail-percent">${
                  responseData.materials[i].ratio + "%"
                }</div>
              </div>
              <div class="material-detail">
                <div>소재 탄소량<br />Material Carbon</div>
                <div class="material-detail-kg">${responseData.materials[
                  i
                ].carbon_amount.toFixed(3)} KgCo<sub>2</sub>e</div>
              </div>
           </div>`;
      }
      let targetContainer = document.querySelector(".manufacturing-items");
      targetContainer.innerHTML += `
            <div class="manufacturing-item">
              <div>의류 제작 공정</div>
              <div>Manufacturing-process</div>
              <div class="material-detail">
                <div>의류를 제작하는데<br>발생하는 탄소량입니다.</div>
                <div class="material-detail-percent">
                </div>
              </div>
              <div class="material-detail">
                <div>탄소 발생량<br />Carbon Amount</div>
                <div class="material-detail-kg">${responseData.manufacturing_amount_category.toFixed(
                  3
                )} KgCo<sub>2</sub>e</div>
              </div>
           </div>`;
      // 4번 라인 변경
      document.getElementById("transport-big-value").innerHTML =
        responseData.transport.toFixed(3) + " kgCo<sub>2</sub>e";
      document.getElementById("transport-big-percent").innerText =
        responseData.transport_ratio;
      document.getElementById("departure-text").innerText =
        responseData.departure ? responseData.departure : "unknown";
      document.getElementById("stopover-text").innerText = responseData.stopover
        ? responseData.stopover
        : "unknown";
      document.getElementById("destination-text").innerText =
        responseData.destination ? responseData.destination : "unknown";
      document.getElementById("departure2-text").innerText =
        responseData.departure ? responseData.departure : "unknown";
      document.getElementById("stopover2-text").innerText =
        responseData.stopover ? responseData.stopover : "unknown";
      document.getElementById("destination2-text").innerText =
        responseData.destination ? responseData.destination : "unknown";
      document.getElementById("sailing-distance").innerText =
        responseData.distance_sea
          ? responseData.distance_sea + " Km"
          : "unknown";
      document.getElementById("distance-car").innerText =
        responseData.distance_car
          ? responseData.distance_car + " Km"
          : "unknown";
      document.getElementById("amount-car").innerText = responseData.amount_car
        ? responseData.amount_car + " ton"
        : "unknown";
      document.getElementById("efficiency-car").innerText =
        responseData.efficiency_car
          ? responseData.efficiency_car + " Km/L"
          : "unknown";
      document.getElementById("wtt").innerText = responseData.wwt
        ? responseData.wwt + " kgDiesel"
        : "unknown";
      document.getElementById("ttw").innerText = responseData.ttw
        ? responseData.ttw + " literDiesel"
        : "unknown";
      document.getElementById("diesel-density").innerText = responseData.density
        ? responseData.density + " Kg/Liters"
        : "unknwon";
      document.getElementById("electricity-car").innerHTML =
        responseData.electricity_car
          ? responseData.electricity_car + " KgCo<sub>2</sub>e/kwh"
          : "unknown";

      // 5번 라인 변경
      document.getElementById("maintaince-big-value").innerHTML =
        responseData.maintaince.toFixed(3) + " kgCo<sub>2</sub>e";
      document.getElementById("maintaince-big-percent").innerText =
        responseData.maintaince_ratio;
      document.getElementById("washing-month").innerText =
        responseData.washing_month;
      document.getElementById("washing-year").innerText =
        responseData.washing_year;
      document.getElementById("season").innerText = responseData.season;
      document.getElementById("lifespan").innerText = responseData.lifespan;
      document.getElementById("washing-carbon").innerHTML =
        responseData.washing_carbon + " kgCo<sub>2</sub>e";

      // 6번 라인 변경
      document.getElementById("retire-big-value").innerHTML =
        responseData.retire.toFixed(3) + " kgCo<sub>2</sub>e";
      document.getElementById("retire-big-percent").innerText =
        responseData.retire_ratio;
      document.getElementById("carbon-retire-recycle").innerHTML =
        responseData.carbon_retire_recycle + " kgCo<sub>2</sub>e";
      document.getElementById("carbon-retire").innerHTML =
        responseData.carbon_retire + " kgCo<sub>2</sub>e";
      document.getElementById("carbon-recycle").innerHTML =
        responseData.carbon_recycle + " kgCo<sub>2</sub>e";
      document.getElementById("carbon-recycle-benefit").innerHTML =
        responseData.carbon_recycle_benefit + " kgCo<sub>2</sub>e";
      document.getElementById("ratio-recycle-benefit").innerText =
        responseData.ratio_recycle_benefit.toFixed(0) + "%";

      // 7번 라인 변경
      document.getElementById("to-phone").innerText = responseData.to_phone;
      document.getElementById("to-distance").innerText =
        responseData.to_distance;
      document.getElementById("to-tree").innerText = responseData.to_tree;
      document.getElementById("to-water").innerText = responseData.to_water;

      inputTransport.style.display = "none";
      btnNext.style.display = "none";
      btnPrev.style.display = "none";
      document.getElementById("calc-result").style.display = "flex";
    });
  // 아카이브 삭제
  document
    .getElementById("auth-delete-btn")
    .addEventListener("click", async function () {
      let flag = false;
      let responseData = null;
      const API_URL = "https://api.careid.xyz/calculator/calc-archive-delete";
      const sendData = {
        no: Number(archiveID.replace("DOC-", "")),
        password: document.getElementById("calc-auth-password").value.trim(),
      };
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(sendData),
      })
        .then((response) => {
          if (!response.ok) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
          } else {
            flag = true;
          }
        })
        .catch((error) => {
          return;
        });
      if (flag) {
        // .archive-content 요소를 선택합니다.
        const archiveContent = document.getElementById("archive-content");
        // 모든 .archive-item 요소들을 가져옵니다.
        const archiveItems = archiveContent.querySelectorAll(".archive-item");
        // 각 .archive-item 요소를 순회하며 확인합니다.
        archiveItems.forEach((item) => {
          const archiveNo = item.querySelector(".archive-no");

          // .archive-no의 innerText가 "DOC-12"인 요소를 찾습니다.
          if (archiveNo && archiveNo.innerText === "DOC-" + archiveID) {
            // 해당 .archive-item 요소를 부모 요소에서 제거합니다.
            archiveContent.removeChild(item);
          }
        });
        document.getElementById("modal-authorization").style.display = "none";
        alert("아카이빙 자료가 삭제되었습니다.");
      }
    });

  // 계산 함수
  function getPagination(currentPage, totalPages) {
    const paginationNumbers = [];
    const maxVisiblePages = 5;

    // 시작 페이지 계산
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));

    // 끝 페이지 계산
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 다시 시작 페이지 조정 (예: 끝 페이지가 총 페이지 수에 도달했을 때)
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i);
    }

    return paginationNumbers;
  }
});
