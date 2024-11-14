<template>
  <div class="flex h-full w-full">
    <!-- left -->
    <div class="relative w-280px bg-#182c37 p-10px">
      <div class="flex gap-5px mb-20px">
        <Icon name="fluent-emoji:person-mage" size="48px" />
        <div>
          <div>{{ userName }}</div>
          <div class="text-#888 font-bold">$ {{ balance.toFixed(2) }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-10px text-20px">
        <NuxtLink to="/" class="flex items-center gap-10px">
          <Icon name="material-symbols:house-rounded" />
          Home</NuxtLink
        >
        <NuxtLink to="/game" class="flex items-center gap-10px">
          <Icon name="material-symbols:rocket" />
          Crash Game</NuxtLink
        >

        <NuxtLink to="/" class="flex items-center gap-10px">
          <Icon name="mdi:dots-triangle" />
          Plinko</NuxtLink
        >
      </div>
      <div
        class="btnFn center gap-10px absolute bottom-10px right-10px rounded-lg p-8px text-center"
        @click="login"
      >
        <Icon name="material-symbols:account-balance-wallet" size="18px" />
        {{ loginText }}
      </div>
    </div>

    <div class="grow-1 relative">
      <slot />
    </div>

    <!-- right -->
    <!-- 聊天室 -->
    <div class="bg-#182c37 w-340px" :class="isChatOpen ? 'block' : 'hidden'">
      <div class="flex flex-col gap-10px p-20px h-full rounded-lg">
        <div class="flex justify-between">
          <div class="flex flex-col justify-between items-start">
            <div class="text-18px font-bold">ChatRoom</div>
            <div class="text-14px">
              <span>Online User : </span>
              <span>{{ users.length }}</span>
            </div>
          </div>
          <div class="text-20px cursor-pointer" @click="isChatOpen = false">
            X
          </div>
        </div>

        <div class="message" ref="messageList">
          <div
            v-for="msg in reciveMessage"
            :key="msg.user + msg.message"
            class="bg-#000/20 my-5px p-10px rounded-lg"
          >
            <div class="flex items-center">
              <Icon name="gg:ghost-character" />
              {{ msg.user }}:
            </div>
            <div class="text-#888">
              {{ msg.message }}
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <input
            v-model="message"
            type="text"
            class="bg-#000/20 h-30px w-80% rounded-lg border-0 p-10px text-14px"
            @keyup.enter="sendMessage"
          />
          <button
            type="button"
            class="btnFn w-50px rounded-lg center transition-all"
            @click="sendMessage"
          >
            <Icon name="iconamoon:send" />
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

    <!-- chatFloatBtn -->
    <div
      v-if="!isChatOpen"
      class="btnFn absolute right-5 top-5 size-40px center rounded-full"
      @click="isChatOpen = true"
    >
      <Icon name="material-symbols:android-chat-outline" size="24" />
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
const message = ref("");
const reciveMessage = ref([]);
const messageList = ref(null);
const users = ref([]);
const userName = ref("");
const isChatOpen = ref(true);

const loginText = computed(() => (isLogin.value ? "Logout" : "Login"));

// pinia
const userStore = useUserStore();
const { balance, isLogin } = storeToRefs(userStore);

// 請求當前的已連線使用者列表
socket.emit("requestConnectedUsers");

socket.on("userName", (value) => {
  console.log("Received userName:", value);
  userName.value = value;
});

socket.on("connectedUsers", (value) => {
  console.log("Received connectedUsers:", value);
  users.value = value;
});

socket.on("message", (value) => {
  console.log("Received message:", value);
  reciveMessage.value = value;
  nextTick(() => {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  });
});

// chat
const login = async () => {
  if (isLogin.value) {
    isLogin.value = false;
    return;
  }
  const { value: name } = await Swal.fire({
    title: "Login",
    background: "#182c37",
    input: "text",
    inputLabel: "Username",
    customClass: {
      title: "alertTitle",
      input: "alertTitle",
      inputLabel: "alertTitle",
      confirmButton: "confirmBtn",
    },
    inputValidator: (value) => {
      if (!value) {
        return "You need to enter username!";
      }
    },
  });
  if (name) {
    console.log(name);
    isLogin.value = true;
    socket.emit("updateUser", name);
  }
};

const sendMessage = () => {
  if (message.value === "") return;
  socket.emit("message", message.value);
  message.value = "";
};
</script>

<style scoped>
.message {
  border-radius: 10px;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
