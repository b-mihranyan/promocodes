<template>
  <div
    class="main"
    @mouseup="stopDrag()"
    @mouseleave="stopDrag()"
    @touchend="stopDrag()"
  >
    <audio
      id="rustling-audio"
      src="./src/assets/audio/leaves.mp3"
      class="audio"
      ref="audio"
    ></audio>
    <div class="main__header">
      <img
        src="./assets/img/header-logo.svg"
        alt="header"
        class="main__header--logo"
      />
      <div class="main__header--title">
        <img
          src="./assets/img/percent.svg"
          alt="-25%"
          class="main__header--title__percent"
        />
        <span class="main__header--title__text">
          На первый заказ от 1 000 рублей <br />в приложении «Пятёрочка
          Доставка»
        </span>
      </div>
    </div>

    <div class="main__body">
      <img
        v-for="(leaf, i) in leafs"
        :src="leaf.src"
        :style="leaf.position"
        :key="'leaf_' + i"
        class="main__body--leafs"
        @mousedown="startDrag(i, $event)"
        @mousemove="drag(i, $event)"
        @touchstart="startDrag(i, $event)"
        @touchmove="drag(i, $event)"
      />
      <div
        class="main__body--promo"
        :style="{ 'z-index': isOpenPromo ? 1 : 100 }"
        ref="promoBox"
      >
        <span class="main__body--promo__title">Ваш промокод</span>
        <span v-if="isOpenPromo" class="main__body--promo__text">
          {{ currentPromo }}
          <img
            src="./assets/img/copy.svg"
            alt="copy"
            @click="copyPromo"
            class="main__body--promo__text--copy"
          />
        </span>
      </div>
      <div class="main__body--qr" :style="{ 'z-index': isOpenPromo ? 1 : 100 }">
        <div class="main__body--qr__logobox">
          <img
            src="./assets/img/qr-logo.svg"
            alt="qr-logo"
            class="main__body--qr__logo"
          />
          <img src="./assets/img/qr.svg" alt="qr" class="main__body--qr__img" />
        </div>
        <span class="main__body--qr__text">
          Скачать<br />
          приложение
        </span>
      </div>
      <div v-if="!isOpenPromo" class="main__body--title">
        <img
          src="./assets/img/finger.svg"
          alt="finger"
          class="main__body--title__img"
        />
        <span class="main__body--title__text">
          Пошуршите листьями,<br />
          заберите промокод
        </span>
      </div>
    </div>

    <div class="main__footer">
      <span>
        Продавец ООО «Агроторг», ОГРН 1027809237796, г. Санкт-Петербург, Невский
        проспект, д. 90/92. Указанное время доставки не включает в себя время на
        приём, обработку и сбор заказа. Зона и время доставки ограничены.
        Подробные условия в мобильном приложении «Пятёрочка Доставка» или
        «Пятёрочка». Реклама.
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import $cookies from "js-cookie";
import leafList from "./assets/js/leafs";
import promos from "./assets/js/promos"; // We will get promocodes from backend

const isOpenPromo = ref(false);
const audio = ref(null);
const currentUser = ref(`osen_banner1`); // We will get utm-s from route params
const currentPromo = ref(null);
const promoBox = ref(null);
const leafs = ref([]);

const openLeafs = () => {
  leafs.value.forEach((elem, index) => {
    setInterval(() => {
      if (index === 0 || index === 1) return;
      const left = parseFloat(elem.position.left);
      if (left > -10 && left < 80) {
        const newLeft = left + (index > 20 ? 1 : -1);
        elem.position.left = `${newLeft}%`;
      }
      let count = index % 2 ? index : -index;
      let max = index % 2 ? 40 : 80;
      elem.position.top = `${max + count}%`;
    }, 0);
  });
};

onBeforeMount(() => {
  randomizeLeafs();
});

onMounted(() => {
  console.log(leafList.length);
  const userData = currentUser.value;
  if ($cookies.get(userData)) {
    isOpenPromo.value = true;
    currentPromo.value = $cookies.get(userData);
    openLeafs();
  } else {
    const promoIndex = Math.floor(Math.random() * promos.length);
    currentPromo.value = promos.splice(promoIndex, 1).join("");
    $cookies.set(userData, currentPromo.value); // We will send backend userData and promocode for mark this promo
  }
});

const copyPromo = () => {
  navigator.clipboard.writeText(currentPromo.value);
};

const randomizeLeafs = () => {
  const leafsCount = 40;
  for (let i = 0; i < leafsCount; i++) {
    randomLeaf(i);
  }
};

const randomLeaf = (i) => {
  if (i === 0) {
    leafs.value.push({
      src: leafList[14],
      position: {
        top: "10%",
        left: "80%",
        width: "10%",
        height: "10%",
        transform: `rotate(-160deg)`,
        zIndex: 999,
      },
    });
    return;
  } else if (i === 1) {
    leafs.value.push({
      src: leafList[8],
      position: {
        top: "30%",
        left: "15%",
        width: "10%",
        height: "10%",
        transform: `rotate(125deg)`,
        zIndex: 999,
      },
    });
    return;
  }
  const leafNumber = i < leafList.length ? i : i % leafList.length;
  const maxWidth = 30 + (i % 2);
  const maxHeight = 30 + (i % 2);
  const maxTop = window.innerWidth < 500 ? 50 : 40;
  const topRange = window.innerWidth < 500 ? 5 : 10;
  const minLeft = 5;
  const randomWidth = maxWidth;
  const randomHeight = maxHeight;
  const randomTop =
    i % 4 === 1
      ? maxTop
      : i % 4 === 2
      ? maxTop + topRange
      : i % 4 === 3
      ? maxTop + topRange * 2
      : maxTop + topRange * 3.5;
  const randomLeft = i > 10 && i < 30 ? minLeft + i * 1.5 : minLeft + i * 1.5;

  leafs.value.push({
    src: leafList[leafNumber === 8 ? 4 : leafNumber],
    position: {
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
      width: `${randomWidth}%`,
      height: `${randomHeight}%`,
      zIndex: 999,
    },
  });
};

const dragData = ref({
  isDragging: false,
  elementIndex: null,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
});

function startDrag(index, event) {
  audio.value.play();
  isOpenPromo.value = true;
  event.preventDefault();
  if (event.type === "touchstart") {
    event = event.touches[0];
  }
  console.log(event.clientX);
  dragData.value.isDragging = true;
  dragData.value.elementIndex = index;
  dragData.value.startX = event.clientX;
  dragData.value.startY = event.clientY;
  leafs.value[index].position.zIndex = 9999;
}

function drag(index, event) {
  event.preventDefault();
  if (event.type === "touchmove") {
    event = event.touches[0];
  }
  if (!dragData.value.isDragging) return;
  const deltaX = event.clientX - dragData.value.startX;
  const deltaY = event.clientY - dragData.value.startY;
  const newTop = dragData.value.startY + deltaY - event.target.height / 2;
  const newLeft = dragData.value.startX + deltaX - event.target.width / 2;
  leafs.value[dragData.value.elementIndex].position.top = `${
    (newTop / window.innerHeight) * 100
  }%`;
  leafs.value[dragData.value.elementIndex].position.left = `${
    (newLeft / window.innerWidth) * 100
  }%`;
}

function stopDrag() {
  audio.value.pause();
  if (dragData.value.elementIndex) {
    leafs.value[dragData.value.elementIndex].position.zIndex = 2;
  }
  dragData.value.isDragging = false;
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: calc(100vh - 40px);
  .audio {
    display: none;
  }
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9990;
    &--logo {
      margin: 60px auto;
      width: 350px;
      height: 90px;
    }
    &--title {
      display: flex;
      align-items: center;
      justify-content: left;
      gap: 30px;
      &__percent {
        width: 365px;
        height: 125px;
      }
      &__text {
        display: inline-block;
        font-weight: 900;
        font-size: 32px;
        line-height: 38px;
        letter-spacing: -4%;
        background: -webkit-linear-gradient(#eb4023, #ff8807);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &__body {
    color: white;
    font-weight: 900;
    font-size: 32px;
    line-height: 38px;
    width: 100%;
    overflow: hidden;
    &--promo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      background-color: #00923a;
      width: 300px;
      height: 115px;
      border-radius: 20px;
      padding: 16px 64px;
      margin: 0 auto;
      margin-top: 90px;
      &__text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 40px;
        line-height: 48px;
        &--copy {
          cursor: pointer;
          width: 19px;
          height: 27px;
        }
      }
    }
    &--title {
      display: flex;
      flex-direction: column;
      position: absolute;
      gap: 80px;
      margin-top: 280px;
      z-index: 9990;
      bottom: 120px;
      left: 50%;
      transform: translate(-50%);
      &__text {
        text-align: center;
      }
      &__img {
        position: relative;
        width: 245px;
        height: 100px;
        animation: slide 3s infinite;
      }
    }
    &--qr {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 60px;
      margin-bottom: 25px;
      &__logobox {
        position: relative;
        animation: logo 3s infinite;
      }
      &__img {
        width: 200px;
        height: 200px;
      }
      &__text {
        text-align: center;
        color: #582d2b;
        line-height: 28px;
      }
      &__logo {
        position: absolute;
        width: 60px;
        height: 60px;
        top: -15px;
        left: 50%;
        transform: translate(-50%);
      }
    }
    &--leafs {
      position: absolute;
      transition: transform 1s;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    background-color: white;
    height: 40px;
    width: 100%;
    z-index: 9990;
    span {
      display: inline-block;
      max-width: 770px;
      text-align: left;
      color: black;
      font-weight: 400;
      font-size: 9px;
      line-height: 10px;
    }
  }
}

@keyframes slide {
  from {
    transform: rotate(-10deg);
    left: 0%;
  }
  to {
    transform: rotate(10deg);
    left: 80%;
  }
}

@keyframes logo {
  0%,
  40% {
    transform: rotate(0);
  }
  40% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  60%,
  100% {
    transform: rotate(0);
  }
}

@media (max-width: 960px) {
  .main {
    &__header {
      &--logo {
        margin: 40px auto;
        width: 300px;
        height: 75px;
      }
      &--title {
        flex-direction: column;
        gap: 25px;
        &__percent {
          width: 440px;
          height: 150px;
        }
        &__text {
          text-align: center;
        }
      }
    }

    &__body {
      &--promo {
        margin-top: 70px;
        &__text {
          font-size: 40px;
          line-height: 48px;
          &--copy {
            width: 19px;
            height: 27px;
          }
        }
      }
      &--title {
        gap: 160px;
        margin-top: 200px;
        &__img {
          width: 200px;
          height: 80px;
        }
      }
      &--qr {
        gap: 0;
        margin-top: 35px;
        &__img {
          display: none;
        }
        &__text {
          text-align: center;
          color: #582d2b;
          line-height: 28px;
        }
        &__logo {
          position: relative;
          width: 180px;
          height: 180px;
          top: 0;
        }
      }
    }

    &__footer {
      width: 100%;
      span {
        font-size: 8px;
        padding: 5px 40px;
      }
    }
  }
}

@media (max-width: 570px) {
  .main {
    &__header {
      &--logo {
        margin: 16px auto 35px;
        width: 160px;
        height: 40px;
      }
      &--title {
        gap: 8px;
        &__percent {
          width: 190px;
          height: 65px;
        }
        &__text {
          font-size: 14px;
          line-height: 16px;
        }
      }
    }

    &__body {
      &--promo {
        margin-top: 115px;
        width: 168px;
        height: 45px;
        gap: 16px;
        padding: 16px 24px;
        font-size: 14px;
        line-height: 16px;
        &__text {
          font-size: 24px;
          line-height: 28px;
          &--copy {
            width: 19px;
            height: 27px;
          }
        }
      }
      &--title {
        gap: 45px;
        margin-top: 200px;
        bottom: 200px;
        font-size: 14px;
        line-height: 16px;
        &__img {
          width: 100px;
          height: 40px;
        }
      }
      &--qr {
        gap: 0;
        margin-top: 35px;
        &__img {
          display: none;
        }
        &__text {
          font-size: 14px;
          line-height: 12px;
        }
        &__logo {
          width: 100px;
          height: 100px;
        }
      }
    }

    &__footer {
      span {
        font-size: 6px;
        line-height: 7px;
        padding: 5px 16px;
      }
    }
  }
}

@media (max-height: 568px) {
  .main {
    &__header {
      &--logo {
        margin: 16px auto 30px;
      }
    }
    &__body {
      &--promo {
        margin-top: 100px;
      }
      &--title {
        gap: 45px;
        margin-top: 200px;
        font-size: 14px;
        line-height: 16px;
        &__img {
          width: 100px;
          height: 40px;
        }
      }
      &--qr {
        margin-top: 0px;
      }
    }
  }
}
</style>
