<template>
  <div class="main flex h-screen justify-center items-center">
    <div class="flex flex-col gap-40px">
      <!-- 投注區 -->
      <div
        class="relative flex flex-col gap-20px text-#5f6892 bg-#200731 p-20px w-400px rounded-lg mr-20px text-18px"
      >
        <div class="flex justify-between">
          Balance:
          <div class="flex text-white h-20px items-center">
            <div>AUTO</div>
            <!-- toggle -->
            <AutoToggle v-model="isAuto" />
          </div>
        </div>
        <div class="text-white">{{ balance.toFixed(2) }}</div>
        <label for="betAmout">BetAmout:</label>
        <div class="relative">
          <input
            v-model="betAmount"
            type="number"
            name="betAmount"
            id="betAmout"
            :disabled="isBet || isGameStarted"
            class="bg-#200790/50 text-white h-40px w-full rounded-lg border-0 p-10px text-18px"
          />
          <div
            class="absolute top-1/2 right-10px -translate-y-1/2 flex gap-5px h-30px"
          >
            <button
              class="bg-#200745 px-10px rounded-md text-#5f6892 border-0 cursor-pointer hover:text-white center"
              @click="half"
            >
              1/2
            </button>
            <button
              class="bg-#200745 py-8px px-10px rounded-md text-#5f6892 border-0 cursor-pointer hover:text-white center"
              @click="double"
            >
              x2
            </button>
            <button
              class="bg-#200745 py-8px px-10px rounded-md text-#5f6892 border-0 cursor-pointer hover:text-white center"
              @click="max"
            >
              Max
            </button>
          </div>
        </div>

        <label for="autoCrashout">Collect:</label>
        <div class="flex gap-10px">
          <button
            class="bg-#200745 px-10px rounded-md text-#5f6892 border-0 cursor-pointer hover:text-white center"
            @click="minus"
          >
            -
          </button>
          <div div class="relative flex text-white">
            <input
              v-model.number="collect"
              type="text"
              name="collect"
              id="collect"
              :disabled="isBet || isGameStarted"
              class="bg-#200790/50 pl-18px h-40px w-100px rounded-lg border-0 p-10px text-18px"
            />
            <p class="absolute right-10px top-1/2 -translate-y-1/2">x</p>
          </div>
          <button
            class="bg-#200745 px-10px rounded-md text-#5f6892 border-0 cursor-pointer hover:text-white center"
            @click="plus"
          >
            +
          </button>
        </div>

        <div class="flex items-center justify-around">
          <div class="center">
            <div class="rounded-full size-120px bg-#7E7E7E"></div>
            <button
              class="absolute btn rounded-full border-0 py-10px size-100px cursor-pointer text-black"
              :class="btnStatus"
              :disabled="
                (!isBet && isGameStarted) ||
                (isBet && !isGameStarted) ||
                isCrashed ||
                cashouted
              "
              @click="doBet"
            >
              {{ isBet ? "Cashout" : "Bet" }}
            </button>
          </div>

          <div class="text-green font-bold">
            <p>Collect:</p>
            {{ isBet ? (betAmount * multipleNum).toFixed(2) : 0 }}
          </div>
        </div>
        <!-- <button
          class="btn rounded-lg border-0 py-10px w-full cursor-pointer text-black"
          :class="{
            '!bg-#b29c1e cursor-not-allowed':
              !isBet || cashouted || !isGameStarted,
          }"
          :disabled="!isBet || cashouted || !isGameStarted"
          @click="cashout"
        >
          CashOut
        </button> -->
        <!-- <button class="btn rounded-lg border-0 py-10px w-full cursor-pointer" @click="reset">
      Reset
    </button> -->
        <div class="flex items-center justify-between">
          <span>{{ result }}</span>
          <div class="flex items-center gap-10px">
            <span>Network Status:</span>
            <div
              class="size-10px rounded-full"
              :class="isConnected ? 'bg-green' : 'bg-red'"
            ></div>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div
        class="flex flex-col gap-20px text-#5f6892 bg-#200731 p-20px w-400px h-300px rounded-lg mr-20px text-18px font-bold"
      >
        <div class="text-white">Rank</div>
        <table>
          <thead>
            <tr>
              <td>Rank</td>
              <td>Name</td>
              <td>Cachout</td>
            </tr>
          </thead>
          <tbody>
            <tr class="text-white" v-for="(item, index) in rank" :key="index">
              <td># {{ index + 1 }}</td>
              <td>{{ item.user }}</td>
              <td>{{ item.multipler }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 遊戲區 -->
    <div>
      <div class="flex gap-10px h-46px w-800px overflow-auto">
        <template v-for="(item, index) in betResult.slice(-13)" :key="index">
          <div
            class="border-1 border-solid p-5px rounded-md my-5px text-white hover:bg-amber hover:cursor-pointer"
            @click="openResultDetail(item)"
          >
            {{ item }}
          </div>
        </template>
      </div>
      <div class="container flex justify-center">
        <svg
          id="curve"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-0 bottom-0 w-600px h-600px"
          viewBox="0 0 400 400"
        >
          <path
            d="M 0 400 Q 400 400 400 0"
            stroke="#fdaa10"
            stroke-width="4"
            fill="none"
            class="glow"
          />
        </svg>
        <svg
          id="rocketPath"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-0 bottom-0 w-600px h-600px"
          viewBox="0 0 400 400"
        >
          <path
            d="M 0 0 Q 400 0 400 -400"
            stroke="#000"
            stroke-width="0"
            fill="none"
          />
        </svg>

        <div ref="animatedBox" class="absolute -left-75px -bottom-75px">
          <img
            v-if="isCrashed"
            class="w-200px"
            src="@/assets/images/bomb.png"
          />
          <img v-else class="w-150px" src="@/assets/images/rocket.png" />
        </div>
        <div class="flex flex-col items-center z-10 mt-15%">
          <div class="text-80px text-red font-bold">{{ multipleNum }}X</div>
          <div>
            <div v-if="countDown > 0" class="text-40px text-white font-bold">
              Start in {{ countDown }}
            </div>
          </div>
          <div v-if="isCrashed" class="text-100px text-red font-bold">
            Crash!!!
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- dialog -->
  <dialog
    class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-0 border-0 rounded-lg bg-transparent"
  >
    <div class="flex flex-col p-40px gap-10px bg-#200745">
      <div class="text-24px text-white">Result Detail</div>
      <div class="text-24px text-white">{{ currentResult }}X</div>
      <div class="flex flex-col gap-10px">
        jfjfkdkkkkdivclass+
        <div class="text-18px text-white">Hash</div>
        <input
          readonly
          type="text"
          class="w-400px"
          value="4f2cf68084f9d85b9ac495aee6197d34a1bacd1414bd28b1215d9d112f8566d2"
        />
      </div>
      <div class="flex flex-col gap-10px">
        <div class="text-18px text-white">Seed</div>
        <input
          readonly
          type="text"
          class="w-400px"
          value="0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4"
        />
      </div>
      <button
        class="btn rounded-lg border-0 py-10px w-full cursor-pointer"
        @click="closeResultDetail"
      >
        Close
      </button>
    </div>
  </dialog>

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
import anime from "animejs";
import Swal from "sweetalert2";

// pinia
const userStore = useUserStore();
const { balance } = storeToRefs(userStore);

const animatedBox = ref(null);
const animation = ref(null);
const curveAnimation = ref(null);
const multipleNum = ref(0.0);
const betAmount = ref(10);
const collect = ref("2.00");
const currentResult = ref(0);

const isGameStarted = ref(false);
const isBet = ref(false);
const cashouted = ref(false);
const isCrashed = ref(false);
const isAuto = ref(false);

watch(isAuto, (newValue) => {
  console.log(newValue);
});

const rank = ref([]);

const betResult = ref([]);

const btnStatus = computed(() => ({
  "bg-#C00000": !isBet.value && !isGameStarted.value,
  "bg-#6F0000 cursor-not-allowed":
    (!isBet.value && isGameStarted.value) ||
    (isBet.value && !isGameStarted.value),
  "bg-#06F100": isBet.value && isGameStarted.value && !cashouted.value,
  "bg-#03AD00 cursor-not-allowed": cashouted.value,
}));

// loading
const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});

watch(btnStatus, (value) => {
  console.log(value);
});

// WebSocket
const isConnected = ref(false);
const transport = ref("N/A");

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });

  // 請求當前的已連線使用者列表
  socket.emit("requestConnectedUsers");
}

const inputValue = ref("");
onMounted(() => {
  if (socket.connected) {
    onConnect();
  }
});
onMounted(async () => {});
socket.on("connect", onConnect);
socket.on("disconnect", (reason) => {
  console.log("disconnect", reason);
  isConnected.value = false;
});

socket.on("countdownStart", () => {
  startCountdown();
});

socket.on("countdown", (data) => {
  console.log("Countdown", data.countdown);
  countDown.value = data.countdown;
});

socket.on("multiplier", (data) => {
  // console.log("multiplier", data);
  multipleNum.value = data;
});

socket.on("start", (data) => {
  console.log("game srart");
  result.value = data;
  startGame();
});

socket.on("crash", () => {
  crashGame();
});

socket.on("rank", (data) => {
  console.log("rank", data);
  rank.value = data;
});

const openResultDetail = (value) => {
  document.querySelector("dialog").showModal();
  currentResult.value = value;
};

const closeResultDetail = () => {
  document.querySelector("dialog").close();
};

// 开始倒计时
const isCountingDown = ref(false);
const countDown = ref(0);

const startCountdown = () => {
  isCountingDown.value = true;
  animation.value.restart();
  animation.value.pause();
  curveAnimation.value.restart();
  curveAnimation.value.pause();
  cashouted.value = false;
  isCrashed.value = false;
  isGameStarted.value = false;
  isBet.value = false;
  multipleNum.value = 0.0;
};

// 开始游戏
const result = ref(0);

const startGame = () => {
  isGameStarted.value = true;
  animation.value.play();
  curveAnimation.value.play();
  if (isAuto.value) {
    doBet();
  }
};

const crashGame = () => {
  console.log("Crash!");
  animation.value.pause();
  curveAnimation.value.pause();
  betResult.value.push(result.value);
  isCrashed.value = true;
};

const doBet = () => {
  console.log(isBet.value, isGameStarted.value);
  if (isBet.value && isGameStarted.value) {
    cashout();
    return;
  }
  balance.value -= betAmount.value;
  isBet.value = true;
};

const cashout = () => {
  if (cashouted.value) return;
  cashouted.value = true;
  balance.value += betAmount.value * multipleNum.value;
  socket.emit("cashout", multipleNum.value);
  Swal.fire({
    title: "You Won!!!",
    text: (betAmount.value * multipleNum.value).toFixed(2),
    icon: "success",
    timer: 2000,
  });
};

watch(multipleNum, (value) => {
  if (value >= collect.value && isAuto.value && isBet.value) {
    cashout();
  }
});

/**
 * 將投注金額減半
 * 會先檢查餘額，並確保不低於最小投注限制
 */
const half = () => {
  // 檢查餘額是否足夠
  if (isGameStarted.value) return;

  // 計算新的投注金額
  const minBet = 1; // 最小投注金額
  const newAmount = Math.floor(betAmount.value / 2);

  // 確保不低於最小投注金額
  betAmount.value = Math.max(newAmount, minBet);
};

/**
 * 將投注金額倍增
 * 會先檢查餘額，並確保不超過餘額和最大投注限制
 */
const double = () => {
  if (isGameStarted.value) return;

  const maxBet = balance.value; // 最大投注金額為當前餘額
  const doubledAmount = Math.floor(betAmount.value * 2);

  betAmount.value = Math.min(doubledAmount, maxBet);
};

/**
 * 將投注金額設為最大可投注金額
 */
const max = () => {
  if (isGameStarted.value) return;
  betAmount.value = Math.floor(balance.value);
};

const minus = () => {
  // 將字串轉為浮點數
  const currentValue = parseFloat(collect.value);
  // 減 1 並確保不小於 2
  collect.value = Math.max(currentValue - 0.01, 2).toFixed(2);
};

const plus = () => {
  // 將字串轉為浮點數
  const currentValue = parseFloat(collect.value);
  // 加 0.01 並保留兩位小數
  collect.value = (currentValue + 0.01).toFixed(2);
};

// 新增一個變數追蹤輸入字串
const inputBuffer = ref("");

// 監聽鍵盤輸入
const handleKeyPress = (e) => {
  // 將新字元加到 buffer
  inputBuffer.value += e.key;

  // 只保留最後 5 個字元
  if (inputBuffer.value.length > 5) {
    inputBuffer.value = inputBuffer.value.slice(-5);
  }

  // 檢查是否輸入 "reset"
  if (inputBuffer.value.toLowerCase() === "reset") {
    // 發送清除訊號到 server
    socket.emit("reset");
    // 重置 buffer
    inputBuffer.value = "";
  }
};

onMounted(() => {
  const path = anime.path(".container #rocketPath path");
  animation.value = anime({
    targets: animatedBox.value,
    translateX: path("x"),
    translateY: path("y"),
    rotate: { value: [0, -20] },
    duration: 5000,
    easing: "linear",
    autoplay: false,
  });

  curveAnimation.value = anime({
    targets: ".container #curve path",
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 5000,
    easing: "linear",
    autoplay: false,
  });

  window.addEventListener("keypress", handleKeyPress);
});
</script>

<style scoped>
.container {
  position: relative;
  width: 800px;
  height: 800px;
  position: relative;
  background: rgb(64, 17, 75);
  background: linear-gradient(
    174deg,
    rgba(64, 17, 75, 1) 0%,
    rgba(121, 9, 34, 1) 65%,
    rgba(122, 19, 138, 1) 100%
  );
  border-radius: 10px;
  overflow: hidden;
}

.animated-box {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #3498db;
}

.btn {
  font-size: 18px;
  transition: all 0.18s ease-in-out;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.btn:hover {
  text-shadow: 0 0 30px rgba(255, 255, 255, 1),
    0 0 60px rgba(255, 255, 255, 0.8), 0 0 75px rgba(255, 255, 255, 0.6),
    0 0 80px rgba(255, 255, 255, 0.4), 0 0 77px rgba(255, 255, 255, 0.5),
    0 0 78px rgba(255, 255, 255, 0.4), 0 0 79px rgba(255, 255, 255, 0.3),
    0 0 80px rgba(255, 255, 255, 0.2), 0 0 120px rgba(255, 255, 255, 0.1);
}

.glow {
  filter: drop-shadow(0 0 5px blue) drop-shadow(0 0 10px blue);
}

.main {
  background: linear-gradient(
    174deg,
    rgba(0, 212, 255, 1) 0%,
    rgba(6, 6, 88, 1) 23%,
    rgba(9, 9, 121, 1) 65%,
    rgba(2, 0, 36, 1) 100%
  );
}

.message {
  padding: 10px;
  background-color: #200760;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
