$(function () {
  $('a').click(function (e) {
    if ($(this).attr('href') === '#') {
      e.preventDefault();
    }
  })

  let reservationTop, headerHeight, roomTop, weddingTop, roomElTop;
  let scrollTop, scrollPlusHeader;


  // 날짜 형식 바꾸기 yyyy.mm.dd day
  function formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const day = "일월화수목금토"[date.getDay()];
    return `${y}.${m}.${d} ${day}`;
  }

  // 체크아웃날짜 구하기 (체크인 다음날)
  function getCheckoutDate(date) {
    const checkout = new Date(date);
    checkout.setDate(checkout.getDate() + 1);
    return checkout;
  }

  // input[type="date"] 숨기고 특정태그에 showPicker
  function openDatePicker(id) {
    document.getElementById(id).showPicker();
  }

  function handleGalleryClass() {
    if ($(window).outerWidth() <= 1024) {
      $(".gallery-swiper").addClass("off");
      $(".gallery-grid").removeClass("off");
    } else {
      $(".gallery-swiper").removeClass("off");
      $(".gallery-grid").addClass("off");
    }
  }

  function handleHeaderBackground(scrollPlusHeader) {
    // reservation 쯤에서 header 배경 바꾸기
    if (scrollPlusHeader >= reservationTop) {
      $("header").addClass("on");
    } else {
      $("header").removeClass("on");
    }

    // room section에서는 header 안 보이게
    if (scrollPlusHeader >= roomTop && scrollPlusHeader <= weddingTop) {
      $("header").addClass("hide");
    } else {
      $("header").removeClass("hide");
    }
  }

  function handleRoomImage(scrollTop, scrollPlusHeader, roomElTop) {
    const windowCenter = scrollTop + $(window).height() / 2;

    if (scrollPlusHeader >= roomTop && scrollPlusHeader <= weddingTop) {
      for (let i = 6; i >= 0; i--) {
        if (windowCenter >= roomElTop[i]) {
          $(`.room-image`).removeClass("on");
          $(`.room-image:nth-child(${i + 1})`).addClass("on");
          break;
        }
      }
    }
  }

  function getRoomElTop() {
    const roomElTop = [];
    for (let i = 1; i <= 7; i++) {
      roomElTop.push($(`.room-info-item:nth-child(${i})`).offset().top);
    }
    return roomElTop;
  }

  function updateScroll() {
    scrollTop = $(window).scrollTop();
    scrollPlusHeader = scrollTop + headerHeight;
  }

  function updateElTop() {
    reservationTop = $(".reservation").offset().top;
    headerHeight = $("header").outerHeight();
    roomTop = $("section.room").offset().top;
    weddingTop = $("section.wedding").offset().top;
    roomElTop = getRoomElTop();
  }

  // 페이지 load 때 실행
  $(window).on('load', function () {
    updateElTop();
    updateScroll();

    handleRoomImage(scrollTop, scrollPlusHeader, roomElTop);
    handleGalleryClass();
    handleHeaderBackground(scrollPlusHeader);
  })


  // 화면 사이즈 바뀔때마다 실행
  $(window).resize(function () {
    updateElTop();
    updateScroll();

    handleRoomImage(scrollTop, scrollPlusHeader, roomElTop);
    handleGalleryClass();
    handleHeaderBackground(scrollPlusHeader);
  });

  $(window).scroll(function () {
    updateScroll();

    handleHeaderBackground(scrollPlusHeader);
    handleRoomImage(scrollTop, scrollPlusHeader, roomElTop);
  });

  /* header */
  $("header .depth1 > li").mouseenter(function () {
    if ($(window).outerWidth() <= 1024) return;

    $("header").addClass("on");
  });

  $("header .depth1").mouseleave(function () {
    updateScroll();

    if ($(window).outerWidth() <= 1024) return;
    if (scrollPlusHeader >= reservationTop) return;

    $("header").removeClass("on");
  });

  $("header .depth1 > li:has(.depth2)").click(function () {
    $(this).find(".depth2").stop().slideToggle();
  });

  $("header .hamburger").click(function () {
    if ($(window).outerWidth() > 1024) return;
    $("html").addClass("hide");
    $("header nav").show().animate(
      {
        right: "0",
      },
      1000
    );
    $("header .close-btn").show().animate(
      {
        right: "245px",
      },
      900
    );
    $("header .nav-bg").css({
      display: "block",
    });
  });

  $("header .close-btn").click(function () {
    if ($(window).outerWidth() > 1024) return;
    $("html").removeClass("hide");
    $("header nav").animate(
      {
        right: "-230px",
      },
      1000,
      () => {
        $(this).hide();
      }
    );
    $("header nav .depth2").stop().slideUp();
    $("header .close-btn").animate(
      {
        right: "-30px",
      },
      1100,
      () => {
        $(this).hide();
      }
    );
    $("header .nav-bg").css({
      display: "none",
    });
  });

  /* hero */
  // 체크인(오늘) 초기값
  const today = new Date();
  const todayStr = today.toISOString().substring(0, 10);
  $(".checkin-date").text(formatDate(today));
  $("#checkin").val(todayStr);
  $("#checkin").attr("min", todayStr);
  // 체크아웃(내일) 초기값
  const tomorrow = getCheckoutDate(today);
  const tomorrowStr = tomorrow.toISOString().substring(0, 10);
  $(".checkout-date").text(formatDate(tomorrow));
  $("#checkout").val(tomorrowStr);
  $("#checkout").attr("min", tomorrowStr);

  // 날짜span 클릭시 showPicker 클릭 함수연결
  $(".checkin-date").click(function () {
    openDatePicker("checkin");
  });
  $(".checkout-date").click(function () {
    openDatePicker("checkout");
  });

  // 체크인 변경시 체크인 날짜span 변경, 체크아웃 변경
  $("#checkin").on("change", function () {
    const checkin = new Date($(this).val());
    $(".checkin-date").text(formatDate(checkin));
    const checkout = getCheckoutDate(checkin);
    const checkoutStr = checkout.toISOString().substring(0, 10);
    $(".checkout-date").text(formatDate(checkout));
    $("#checkout").val(checkoutStr);
    $("#checkout").attr("min", checkoutStr);
  });

  // 체크아웃 변경시 체크아웃 날짜span 변경
  $("#checkout").on("change", function () {
    const checkout = new Date($(this).val());
    $(".checkout-date").text(formatDate(checkout));
  });

  /* dining */
  $(".dining-card").mouseenter(function () {
    let w = $(window).outerWidth();
    if (w <= 768) return;

    let i = $(this).index();
    $("section.dining").addClass(`bg${++i}`);
  });
  $(".dining-card").mouseleave(function () {
    let i = $(this).index();
    $("section.dining").removeClass(`bg${++i}`);
  });

  /* gallery */
  $(".gallery-swiper").mouseenter(function () {
    gallerySwiper.autoplay.stop();
    gallerySwiper.setTranslate(gallerySwiper.getTranslate());
    gallerySwiper.params.speed = 0;
  });

  $(".gallery-swiper").mouseleave(function () {
    gallerySwiper.params.speed = 3000;
    gallerySwiper.autoplay.start();
  });

  /* facilities */
  $(".facilities ul li").mouseenter(function () {
    $(".facilities ul li").removeClass("on");
    if ($(window).outerWidth() > 1024) {
      $(this).addClass("on");
    }
  });
  $(".facilities ul li").mouseleave(function () {
    $(".facilities ul li").removeClass("on");
  });

  $(".go-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });
});
