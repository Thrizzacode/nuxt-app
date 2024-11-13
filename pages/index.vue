<template>
  <div class="flex justify-center h-full w-full">
    <div class="flex flex-col w-full px-40px">
      <!-- banner -->
      <div
        class="relative my-4 flex-col overflow-hidden rounded-xl bg-gradient-to-r from-[#001834] to-[#00479A] md:my-8 xl:flex xl:h-[270px] xl:flex-row"
      >
        <div class="hidden h-[270px] w-full md:flex">
          <div class="relative flex h-full w-full md:mx-4">
            <div
              class="absolute top-[50%] flex max-w-[575px] -translate-y-1/2 cursor-default flex-col gap-6 px-4 text-center max-md:left-1/2 max-md:w-full max-md:-translate-x-1/2 max-md:text-center md:left-[5%] md:px-0 xl:left-0 xl:top-1/2"
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
      <div class="text-20px">Games</div>
      <!-- <img src="../assets/images/games/coin-flip.webp" alt="" /> -->
      <div class="w-1199px">
        <!-- <div
          v-for="(img, index) in imgList"
          :key="index"
          class="relative bottom-0 h-full w-full transition-all duration-300 hover:bottom-2 cursor-pointer"
        >
          <img :src="img" />
        </div> -->
        <swiper :slides-per-view="7" :space-between="10">
          <swiper-slide
            v-for="(img, index) in imgList"
            :key="index"
            class="relative bottom-0 h-full w-full transition-all duration-300 cursor-pointer"
          >
            <img :src="img" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
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
</script>

<style></style>
