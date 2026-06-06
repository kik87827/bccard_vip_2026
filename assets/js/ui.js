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
      function pcAction() {
        if ($(window).width() >= 768) {
          $(".footer_article_content, .footer_article_target").removeClass("mb_active active");
        }
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
