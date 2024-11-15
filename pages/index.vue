<template>
  <div class="flex justify-center h-full w-full">
    <div class="flex flex-col w-full px-40px overflow-auto">
      <!-- banner -->
      <div
        class="relative my-4 flex-col h-270px rounded-xl bg-gradient-to-r from-[#001834] to-[#00479A]"
      >
        <div class="h-270px w-full overflow-hidden">
          <div class="relative flex h-full w-full md:mx-4">
            <div
              class="absolute top-50% flex max-w-575px -translate-y-1/2 cursor-default flex-col gap-6 px-4 text-center"
            >
              <div>
                <h2 class="text-xl font-bold md:text-3xl">
                  THE BEST ONCHAIN <br />
                  DECENTRALIZED CASINO
                </h2>
              </div>
              <div
                class="mb-3 flex items-center justify-center gap-3 text-lg font-bold uppercase"
              >
                <p>NO KYC</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 15"
                  fill="none"
                  class="h-2.5 w-2.5 text-white"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M5.147 13.15a23 23 0 0 0-4.42-4.99l-.613-.517.612-.517a23 23 0 0 0 4.42-4.99l.87-1.327.869 1.326a23 23 0 0 0 4.42 4.991l.612.517-.612.517a23 23 0 0 0-4.42 4.99l-.87 1.328z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p>INSTANT CASHBACK</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 15"
                  fill="none"
                  class="h-2.5 w-2.5 text-white"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M5.147 13.15a23 23 0 0 0-4.42-4.99l-.613-.517.612-.517a23 23 0 0 0 4.42-4.99l.87-1.327.869 1.326a23 23 0 0 0 4.42 4.991l.612.517-.612.517a23 23 0 0 0-4.42 4.99l-.87 1.328z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p>ONE-CLICK BETS</p>
              </div>
            </div>
            <img
              alt="JustBet Decentralized iGaming"
              loading="lazy"
              width="390"
              height="440"
              decoding="async"
              data-nimg="1"
              class="absolute -right-48 -top-1/2 -translate-y-1/2 max-xl:-right-[5%] max-xl:top-[52%] max-xl:scale-[60%] xl:-top-12 xl:translate-y-0"
              src="@/assets/images/banner-logo.png"
              style="color: transparent"
            />
          </div>
        </div>
      </div>

      <!-- Games -->
      <div class="mb-20px">
        <div class="text-20px flex justify-between mb-10px">
          <div class="flex items-center gap-10px">
            <Icon name="mdi:gamepad-variant" size="25" />
            <p>Games</p>
          </div>
          <div class="flex gap-10px">
            <button
              class="size-30px bg-#444 rounded-lg center"
              @click="slidePrev"
            >
              <Icon
                name="material-symbols:play-arrow-rounded"
                class="rotate-180"
              />
            </button>
            <button
              class="size-30px bg-#444 rounded-lg center"
              @click="slideNext"
            >
              <Icon name="material-symbols:play-arrow-rounded" />
            </button>
          </div>
        </div>

        <!-- swiper -->
        <div class="w-1230px">
          <swiper :slides-per-view="7" :space-between="20" @swiper="onSwiper">
            <swiper-slide
              v-for="(img, index) in imgList"
              :key="index"
              class="relative bottom-0 h-full cursor-pointer"
            >
              <img :src="img" />
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <!-- BETS -->
      <div>
        <div class="text-20px flex justify-between mb-10px">
          <div class="flex items-center gap-10px">
            <Icon name="material-symbols:poker-chip-rounded" size="25" />
            <p>Bets</p>
          </div>
        </div>

        <div class="relative max-h-500px overflow-hidden">
          <div
            class="absolute bottom-0 w-full h-30% bg-gradient-to-t from-#000/80 rounded-b-10px z-10"
          ></div>
          <table
            style="
              border-spacing: 0 5px;
              width: 100%;
              border-collapse: separate;
              overflow: hidden;
            "
          >
            <thead>
              <tr>
                <th>Game</th>
                <th>Player</th>
                <th>Amount</th>
                <th>Profit</th>
                <th>Time</th>
              </tr>
            </thead>
            <TransitionGroup name="row" tag="tbody">
              <tr v-for="(item, index) in bets" :key="item.id">
                <td>{{ item.game }}</td>
                <td>{{ item.player }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.profit }}</td>
                <td>{{ item.time.toLocaleString() }}</td>
              </tr>
            </TransitionGroup>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  </div>

  <!-- loading -->
  <div
    v-if="isLoading"
    class="absolute top-0 w-full h-full bg-#222 z-10 center"
  >
    <!-- <img src="@/assets/images/loading.gif" class="size-30px" /> -->
    <Loading />
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const imgList = ref([
  "/games/coin-flip.webp",
  "/games/dice.webp",
  "/games/keno.webp",
  "/games/limbo.webp",
  "/games/mines.webp",
  "/games/plinko.webp",
  "/games/roll.webp",
  "/games/rps.webp",
  "/games/wheel.webp",
]);

const bets = ref(
  Array.from({ length: 10 }, (_, i) => {
    // 建立基準時間
    const baseTime = new Date();
    // 根據索引往前推 i 分鐘
    baseTime.setMinutes(baseTime.getMinutes() - i);

    return {
      id: 10 - i,
      game: "Roll",
      player: `Player ${10 - i}`,
      amount: "0.0001",
      profit: "0.0001",
      time: baseTime, // 格式化時間
    };
  })
);

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});

// swiper
const swiperIns = ref(null);
const onSwiper = (swiper) => {
  swiperIns.value = swiper;
};

// 下一頁
const slideNext = () => {
  swiperIns.value.slideNext();
};

// 上一頁
const slidePrev = () => {
  swiperIns.value.slidePrev();
};

// bets record
const addRow = () => {
  const newId = bets.value[0].id + 1;

  // 取得第一筆時間並轉為 Date
  const lastTime = new Date(bets.value[0].time);
  console.log(bets.value[0].time);
  // 加一分鐘
  lastTime.setMinutes(lastTime.getMinutes() + 1);

  const newRow = {
    id: newId,
    game: "Roll",
    player: `Player ${newId}`,
    amount: `0.000${newId}`,
    profit: `0.000${newId}`,
    time: lastTime, // 格式化時間
  };

  bets.value = [newRow, ...bets.value].slice(0, 10);
};

onMounted(() => {
  setInterval(() => {
    addRow();
  }, 2000);
});
</script>

<style lang="scss" scoped>
table {
  th {
    padding: 10px;
    background-color: #333;
    color: #888;
    &:nth-child(1) {
      border-radius: 10px 0 0 10px;
    }
    &:last-child {
      border-radius: 0 10px 10px 0;
    }
  }

  tbody {
    td {
      padding: 10px;
      background-color: #2b2a2a;
      text-align: center;
      &:nth-child(1) {
        border-radius: 10px 0 0 10px;
      }
      &:last-child {
        border-radius: 0 10px 10px 0;
      }
    }
  }
}

/* 過渡動畫 */
.row-move,
.row-enter-active,
.row-leave-active {
  transition: all 0.3s ease;
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 確保將離開的元素從佈局流中刪除
  以便能夠正確地計算移動的動畫。 */
.row-leave-active {
  position: absolute;
}
</style>
