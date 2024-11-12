<template>
  <div class="main flex h-screen justify-center items-center">
    <div class="flex flex-col gap-40px">
      <!-- 投注區 -->
      <div
        class="flex flex-col gap-20px text-#5f6892 bg-#200731 p-20px w-400px rounded-lg mr-20px text-18px font-bold"
      >
        <div>Balance:</div>
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

        <button
          class="btn rounded-lg border-0 py-10px w-full cursor-pointer text-black"
          :class="{ '!bg-#b29c1e cursor-not-allowed': isBet || isGameStarted }"
          :disabled="isBet || isGameStarted"
          @click="betAnimation"
        >
          Bet
        </button>
        <button
          class="btn rounded-lg border-0 py-10px w-full cursor-pointer text-black"
          :class="{
            '!bg-#b29c1e cursor-not-allowed':
              !isBet || cashouted || !isGameStarted,
          }"
          :disabled="!isBet || cashouted || !isGameStarted"
          @click="cashout"
        >
          CashOut
        </button>
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
        class="flex flex-col gap-20px text-#5f6892 bg-#200731 p-20px w-400px h-400px rounded-lg mr-20px text-18px font-bold"
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
      <div class="flex gap-10px h-46px">
        <template v-for="(item, index) in betResult.slice(-15)" :key="index">
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
          <div class="text-40px text-green font-bold">
            Current Cashout: {{ (betAmount * multipleNum).toFixed(2) }}
          </div>
          <div>
            <div v-if="countDown > 0" class="text-40px text-white font-bold">
              Countdown: {{ countDown }}
            </div>
          </div>
          <div v-if="isCrashed" class="text-100px text-red font-bold">
            Crash!!!
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天室 -->
    <div
      class="flex flex-col gap-20px text-white bg-#200731 p-20px w-400px h-90% rounded-lg ml-20px text-18px font-bold"
    >
      <div class="flex justify-between">
        <span>ChatRoom</span>
        <div>
          <span>Online User : </span>
          <span>{{ users.length }}</span>
        </div>
      </div>

      <div class="message" ref="messageList">
        <p v-for="msg in reciveMessage" :key="msg.user + msg.message">
          <strong>{{ msg.user }}:</strong> {{ msg.message }}
        </p>
      </div>

      <div class="flex justify-between">
        <input
          v-model="message"
          type="text"
          class="bg-#200790/50 text-white h-30px w-80% rounded-lg border-0 p-10px text-18px"
          @keyup.enter="sendMessage"
        />
        <button
          type="button"
          class="btn w-50px text-black rounded-lg"
          @click="sendMessage"
        >
          send
        </button>
        <!-- <button
          type="button"
          class="btn w-50px text-black rounded-lg"
          @click="cleanMessage"
        >
          clean
        </button> -->
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
</template>

<script setup>
definePageMeta({
  title: "Game",
  layout: false,
});
import anime from "animejs";
import Swal from "sweetalert2";

const animatedBox = ref(null);
const animation = ref(null);
const curveAnimation = ref(null);
const multipleNum = ref(0.0);
const betAmount = ref(10);
const balance = ref(10000);
const currentResult = ref(0);

const isGameStarted = ref(false);
const isBet = ref(false);
const cashouted = ref(false);
const isCrashed = ref(false);

const rank = ref([]);
const users = ref([]);
const onlineUser = ref(0);

const betResult = ref([]);

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

onMounted(() => {
  socket.on("connect", onConnect);
  if (socket.connected) {
    onConnect();
  }
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
    console.log("multiplier", data);
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

  socket.on("message", (value) => {
    console.log("Received message:", value);
    reciveMessage.value = value;
    nextTick(() => {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    });
  });

  socket.on("connectedUsers", (value) => {
    console.log("Received connectedUsers:", value);
    users.value = value;
  });
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
  isGameStarted.value = false;
  isCrashed.value = false;
  isBet.value = false;
  multipleNum.value = 0.0;
};

// 开始游戏
const result = ref(0);

const startGame = () => {
  isGameStarted.value = true;
  animation.value.play();
  curveAnimation.value.play();
};

const crashGame = () => {
  console.log("Crash!");
  animation.value.pause();
  curveAnimation.value.pause();
  betResult.value.push(multipleNum.value);
  isCrashed.value = true;
};

const betAnimation = () => {
  balance.value -= betAmount.value;
  isBet.value = true;
  cashouted.value = false;
};

const cashout = () => {
  cashouted.value = true;
  balance.value += betAmount.value * multipleNum.value;
  socket.emit("cashout", multipleNum.value);
  Swal.fire({
    title: "You Won!!!",
    text: (betAmount.value * multipleNum.value).toFixed(2),
    icon: "success",
  });
};

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

// chat
const message = ref("");
const reciveMessage = ref("");
const messageList = ref(null);
const sendMessage = () => {
  if (message.value === "") return;
  socket.emit("message", message.value);
  message.value = "";
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
  background-color: #fdaa10;
  transition: all 0.18s ease-in-out;
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
