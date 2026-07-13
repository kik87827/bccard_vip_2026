window.addEventListener("DOMContentLoaded", () => {
  uiBase.init();
});

const uiBase = {
  init() {
    // 현재 객체 내의 모든 메서드 순회
    for (const key in this) {
      if (typeof this[key] === "function" && key !== "init") {
        this[key]();
      }
    }
  },
  commonInit() {
    let touchstart = "ontouchstart" in window;
    let userAgent = navigator.userAgent.toLowerCase();
    if (touchstart) {
      browserAdd("touchmode");
    }
    if (userAgent.indexOf("samsung") > -1) {
      browserAdd("samsung");
    }

    if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("win") > -1) {
      browserAdd("window");
    }

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
      // iPad or iPhone
      browserAdd("ios");
    }

    function browserAdd(opt) {
      document.querySelector("html").classList.add(opt);
    }
  },
  layoutEvent() {
    footerEvent();
    mbTotal();
    function footerEvent() {
      $(".btn_topgo").on("click", function (e) {
        e.preventDefault();
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 20);
      });

      $(".footer_article_target").on("click", function (e) {
        $(this).toggleClass("active");
        $(".footer_article_content").toggleClass("mb_active");
      });

      $(".drop_event_target").on("click", function (e) {
        e.preventDefault();
        const $item = $(this).closest(".drop_box_item");
        $(".drop_box_item").not($item).removeClass("active");
        $item.toggleClass("active");
      });

      $(window).on("resize", function () {
        pcAction();
      });

      $(document).on("click", function (e) {
        if (!$(e.target).closest(".drop_box_item").length) {
          $(".drop_box_item").removeClass("active");
        }
      });
      pcAction();
      footerBreak();
      function pcAction() {
        if ($(window).width() >= 768) {
          $(".footer_article_content, .footer_article_target").removeClass("mb_active active");
        }
      }

      function footerBreak() {
        const list = document.querySelector(".footer_link_list");

        if (!list) return;

        const CLASS_NAME = "break";

        const update = () => {
          const items = [...list.children];

          if (!items.length) return;

          // 초기화
          items.forEach((item) => item.classList.remove(CLASS_NAME));

          // 줄 마지막 li에 break 추가
          for (let i = 1; i < items.length; i++) {
            if (items[i].offsetTop !== items[i - 1].offsetTop) {
              items[i - 1].classList.add(CLASS_NAME);
            }
          }

          // 마지막 줄 마지막 li
          items[items.length - 1].classList.add(CLASS_NAME);
        };

        // debounce
        let timer;
        const debounceUpdate = () => {
          clearTimeout(timer);
          timer = setTimeout(update, 50);
        };

        // 최초 실행
        requestAnimationFrame(update);

        // ResizeObserver 지원
        if ("ResizeObserver" in window) {
          const observer = new ResizeObserver(debounceUpdate);
          observer.observe(list);
        }

        // fallback
        window.addEventListener("resize", debounceUpdate);

        // DOM 변경 대응(li 추가/삭제)
        if ("MutationObserver" in window) {
          const mutation = new MutationObserver(debounceUpdate);
          mutation.observe(list, {
            childList: true,
            subtree: false,
          });
        }
      }
    }
    function mbTotal() {
      var touchstart = "ontouchstart" in window;
      var btn_panel_menu = document.querySelector(".btn_head_link.shape_menu"),
        mobile_panel_zone = document.querySelector(".mobile_panel_zone"),
        mobile_panel_dim = document.querySelector(".mobile_panel_dim"),
        btn_mbmenuclose = document.querySelector(".btn_mbmenuclose"),
        mobile_mainmenu_wrap = document.querySelector(".mobile_mainmenu_wrap") /* 260615 수정 */,
        domHtml = document.querySelector("html") /* 260615 수정 */,
        domBody = document.querySelector("body"); /* 260615 수정 */

      // init
      if (mobile_panel_zone === null) {
        return;
      }
      btn_panel_menu?.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          totalOpen();
        },
        false /* 260615 수정 */
      );
      btn_mbmenuclose?.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          totalClose();
        },
        false /* 260615 수정 */
      );
      mobile_panel_dim?.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          totalClose();
        },
        false /* 260615 수정 */
      );
      resizeAction(() => {
        if (window.innerWidth > 1440) {
          totalClose();
        }
      });

      function totalOpen() {
        mobile_panel_zone.classList.add("active");
        setTimeout(function () {
          mobile_panel_zone.classList.add("motion");
          if (touchstart) {
            domHtml.classList.add("touchDis");
          }
        }, 30);
      }

      function totalClose() {
        mobile_panel_zone.classList.remove("motion");
        setTimeout(function () {
          mobile_panel_zone.classList.remove("active");
          domHtml.classList.remove("touchDis");
        }, 500);
      }
    }
  },
  setVhProperty() {
    setProperty();
    window.addEventListener("resize", () => {
      setProperty();
    });

    function setProperty() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  },
};

class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false /* 260615 수정 */
        );
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow() {
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    /* if (!!this.design_popup_wrap_active) {
      this.design_popup_wrap_active.forEach((element, index) => {
          if (this.design_popup_wrap_active !== this.selector) {
              element.classList.remove("active");
          }
      });
    } */
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option;
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();

      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}

function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? "확인";
  let cancelTextNode = option.cancelText ?? "취소";
  let closeBtnDisplay = option.closeDisplay ?? true;
  let submitBtnDisplay = option.submitDisplay ?? true;
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="javascript:;" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
      <a href="javascript:;" class="btn_modal_submit cancelcall"><span class="btn_modal_submit_text">${cancelTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="javascript:;" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
    `;
  }

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_modal_submit_wrap">
                        ${btnHTML}
                    </div>
                    <a href="javascript:;" class="btn_modal_close"><span class="hdtext">모달 닫기</span></a>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) {
    clearTimeout(showNum);
  }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit_wrap = modal_item.querySelector(".btn_modal_submit_wrap");
  let btn_modal_submit = modal_item.querySelectorAll(".btn_modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if (!submitBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if (!submitBtnDisplay) {
        item.remove();
        btn_modal_submit_wrap.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          let thisTarget = e.currentTarget;
          closeAction();
          if (thisTarget.classList.contains("okcall")) {
            if (option.okcallback) {
              option.okcallback();
            }
          } else if (thisTarget.classList.contains("cancelcall")) {
            if (option.cancelcallback) {
              option.cancelcallback();
            }
          }
          eventIs = true;
        });
      }
    });
  }
  if (!closeBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if (!!btn_modal_close) {
    btn_modal_close.forEach((item) => {
      let eventIs = false;
      if (!closeBtnDisplay) {
        item.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    });
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) {
      clearTimeout(actionNum);
    }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}

/*
  resize
*/
function resizeAction(callback) {
  let windowWid = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWid) {
      if (callback) {
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

function comboBox(options) {
  options = options || {};

  var comboIdx = 0;
  var $pageWrap = $(".page_wrap");
  var changeCallbacks = options.change || {};

  function syncComboWidth($combo) {
    var $button = $combo.find(".combo_select_current");
    var $layer = $combo.find(".combo_option_wrap");
    var $list = $combo.find(".combo_option_list");
    var buttonWidth;
    var optionMaxWidth = 0;
    var currentSavedWidth = $combo.data("combo-width") || 0;
    var comboWidth;

    // 측정할 때만 기존 width 해제
    $combo.css("width", "");
    $button.css("width", "");
    $layer.css("width", "");
    $list.css("width", "");

    buttonWidth = $button.outerWidth();

    $combo.find(".combo_option").each(function () {
      var optionWidth = $(this).outerWidth();

      if (optionWidth > optionMaxWidth) {
        optionMaxWidth = optionWidth;
      }
    });

    // 핵심: 기존 최대값 / 버튼값 / 옵션최대값 중 가장 큰 값 사용
    comboWidth = Math.max(currentSavedWidth, buttonWidth, optionMaxWidth);

    $combo.css("width", comboWidth);
    $button.css("width", comboWidth);
    $layer.css("width", comboWidth);
    $list.css("width", comboWidth);

    $combo.data("combo-width", comboWidth);
  }

  $(".combo_select_item").each(function () {
    var $combo = $(this);
    var $activeOption = $combo.find(".combo_option.active");

    if ($activeOption.length) {
      $combo.find(".text_node").text($activeOption.text());
    }

    if (!this.id) {
      this.id = "combo_" + ++comboIdx;
    }

    if (!$combo.attr("data-optionLength")) {
      $combo.attr("data-optionLength", "5");
    }

    syncComboWidth($combo);
  });

  function setComboLayerPosition() {
    var $layer = $(".combo_option_wrap.open");

    if (!$layer.length) return;

    var comboId = $layer.data("combo-id");
    var $combo = $("#" + comboId);
    var $button = $combo.find(".combo_select_current");

    if (!$button.length) return;

    var buttonOffset = $button.offset();
    var pageOffset = $pageWrap.offset();

    $layer.css({
      left: buttonOffset.left - pageOffset.left + $pageWrap.scrollLeft(),
      top: buttonOffset.top - pageOffset.top + $pageWrap.scrollTop() + $button.outerHeight(),
      width: $combo.data("combo-width"),
    });
  }

  function setOptionScroll($combo, $layer) {
    var maxOptionLength = parseInt($combo.attr("data-optionLength"), 10) || 5;
    var $list = $layer.find(".combo_option_list");
    var $options = $list.find(".combo_option");
    var optionCount = $options.length;

    $list.css({
      maxHeight: "",
      overflowY: "",
      width: $combo.data("combo-width"),
    });

    if (optionCount > maxOptionLength) {
      var optionHeight = $options.first().outerHeight();

      $list.css({
        maxHeight: optionHeight * maxOptionLength + 10,
        overflowY: "auto",
      });
    }
  }

  function closeComboLayer() {
    $(".combo_option_wrap.open").each(function () {
      var $layer = $(this);
      var comboId = $layer.data("combo-id");
      var $combo = $("#" + comboId);

      $combo.removeClass("active").append($layer.removeClass("open"));
    });
    $("html,body").removeClass("touchDis");
  }

  $(document).on("click", ".combo_select_current", function (e) {
    e.preventDefault();

    var $combo = $(this).closest(".combo_select_item");
    var $layer = $combo.find(".combo_option_wrap");
    var isOpened = $combo.hasClass("active");

    closeComboLayer();

    if (isOpened) return;

    syncComboWidth($combo);

    $combo.addClass("active");

    $layer
      .data("combo-id", $combo.attr("id"))
      .appendTo($pageWrap)
      .css({
        position: "absolute",
        width: $combo.data("combo-width"),
        zIndex: 1000,
      })
      .addClass("open");

    setOptionScroll($combo, $layer);
    setComboLayerPosition();
    /* 260615 수정 */
    if ($("html").hasClass("touchmode")) {
      $("html,body").addClass("touchDis");
    }
    /* // 260615 수정 */
  });

  $(document).on("click", ".combo_option", function (e) {
    e.preventDefault();

    var $option = $(this);
    var $layer = $option.closest(".combo_option_wrap");
    var comboId = $layer.data("combo-id");
    var $combo = $("#" + comboId);

    $layer.find(".combo_option.active").removeClass("active");
    $option.addClass("active");

    $combo.find(".text_node").text($option.text());

    // 핵심: change 후 current 텍스트 기준으로 width 재동기화
    syncComboWidth($combo);

    var data = {
      comboId: comboId,
      value: $option.data("value"),
      text: $option.text(),
      option: $option,
      combo: $combo,
    };

    if (typeof changeCallbacks[comboId] === "function") {
      changeCallbacks[comboId](data);
    }

    if (typeof changeCallbacks.all === "function") {
      changeCallbacks.all(data);
    }

    $combo.trigger("combo:change", data);

    $combo.removeClass("active").append($layer.removeClass("open"));
    $("html,body").removeClass("touchDis");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".combo_select_item").length && !$(e.target).closest(".combo_option_wrap").length) {
      closeComboLayer();
    }
  });

  $(".combo_option_wrap .dim").on("click", function (e) {
    closeComboLayer();
  });

  $(window).on("resize scroll", function () {
    setComboLayerPosition();
  });

  $pageWrap.on("scroll", function () {
    setComboLayerPosition();
  });
}

function detailSwiper() {
  let swiper = null;
  let resizeTimer = null;

  function mobileSwiper() {
    const mobile = window.innerWidth <= 767;

    if (mobile && !swiper) {
      swiper = new Swiper(".detail_dp_swiper", {
        slidesPerView: 1,
        loop: true,

        navigation: {
          nextEl: ".detail_dp_swiper .swiper-button-next",
          prevEl: ".detail_dp_swiper .swiper-button-prev",
        },

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    }

    if (!mobile && swiper) {
      swiper.destroy(true, true);
      swiper = null;

      $(".detail_dp_swiper").removeClass("swiper-initialized swiper-horizontal swiper-backface-hidden").removeAttr("style");

      $(".detail_dp_swiper .swiper-wrapper, .detail_dp_swiper .swiper-slide").removeAttr("style");

      $(".detail_dp_swiper .swiper-button-next,.detail_dp_swiper .swiper-button-prev").removeClass("swiper-button-disabled swiper-button-lock").removeAttr("style");

      $(".detail_dp_swiper .swiper-pagination").removeClass("swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock").empty().removeAttr("style");
    }
  }

  $(window).on("load", function () {
    mobileSwiper();
  });

  $(window).on("resize", function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      mobileSwiper();
    }, 150);
  });
}

function detailGallerySwiper() {
  let swiper = null;
  let currentMode = null;

  function initSwiper() {
    const isMobile = window.innerWidth <= 767;
    const mode = isMobile ? "mobile" : "pc";

    if (currentMode === mode) return;

    if (swiper) {
      swiper.destroy(true, true);
    }

    currentMode = mode;

    swiper = new Swiper(".gallery-swiper", {
      speed: 800,
      loop: isMobile,

      navigation: {
        nextEl: ".gallery_swiper_container .swiper-button-next",
        prevEl: ".gallery_swiper_container .swiper-button-prev",
      },

      pagination: {
        el: ".gallery_swiper_container .swiper-pagination",
        clickable: true,
        enabled: isMobile,
      },

      scrollbar: {
        el: ".gallery_swiper_container .swiper-scrollbar",
        draggable: true,
        enabled: !isMobile,
      },

      mousewheel: {
        enabled: !isMobile,
        forceToAxis: true,
        releaseOnEdges: true,
      },

      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  }

  initSwiper();

  window.addEventListener("resize", initSwiper);
}
