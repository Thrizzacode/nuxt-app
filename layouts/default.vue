<template>
  <div class="flex h-full w-full">
    <!-- left -->
    <div class="bg-#182c37 w-300px p-10px">
      <div class="flex">
        <Icon name="fluent-emoji:person-mage" size="48px" />
        <div>
          <div>{{ userName }}</div>
          <div class="text-#888 font-bold">$ {{ balance }}</div>
        </div>
      </div>
      <div class="flex flex-col text-20px">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/game">Crash Game</NuxtLink>
      </div>
    </div>

    <div class="w-[calc(100%-640px)]">
      <slot />
    </div>

    <!-- right -->
    <div class="bg-#182c37 w-340px">
      <!-- 聊天室 -->
      <div class="flex flex-col gap-20px p-20px h-full rounded-lg">
        <div class="flex justify-between items-end">
          <div class="text-18px font-bold">ChatRoom</div>
          <div class="text-14px leading-25px">
            <span>Online User : </span>
            <span>{{ users.length }}</span>
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
            class="bg-#22c55e w-50px rounded-lg center hover:bg-#1f9d4d transition-all"
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
  </div>
</template>

<script setup>
const message = ref("");
const reciveMessage = ref([]);
const messageList = ref(null);
const users = ref([]);
const userName = ref("");

// pinia
const userStore = useUserStore();
const { balance } = storeToRefs(userStore);

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
