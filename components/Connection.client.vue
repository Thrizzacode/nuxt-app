<template>
  <div class="main">
    <div>
      <div>
        <p>Online User: {{ users.length }}</p>
        <p>Current User:<br /></p>
        <ol>
          <li v-for="item in users">{{ item }}</li>
        </ol>
        <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
        <p>Transport: {{ transport }}</p>
      </div>
      <div>
        <input v-model="message" type="text" @keyup.enter="sendMessage" />
        <button type="button" @click="sendMessage">send</button>
        <button type="button" @click="cleanMessage">clean</button>
      </div>
    </div>
    <div class="message" ref="messageList">
      <p v-for="msg in reciveMessage" :key="msg.user + msg.message">
        <strong>{{ msg.user }}:</strong> {{ msg.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { socket } from "./socket";

const isConnected = ref(false);
const transport = ref("N/A");
const message = ref("");
const reciveMessage = ref("");
const messageList = ref(null);

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });

  // 請求當前的已連線使用者列表
  socket.emit("requestConnectedUsers");
}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

socket.on("connect", onConnect);

socket.on("message", (value) => {
  console.log("Received message:", value);
  reciveMessage.value = value;
  nextTick(() => {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  });
});

const users = ref("");
socket.on("connectedUsers", (value) => {
  console.log("Received connectedUsers:", value);
  users.value = value;
});

socket.on("disconnect", onDisconnect);

const sendMessage = () => {
  if (message.value === "") return;
  socket.emit("message", message.value);
  message.value = "";
};

const cleanMessage = () => {
  socket.emit("clean");
};

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});
</script>
<style scoped>
.main {
  display: flex;
  gap: 10px;
}
.message {
  border: 1px solid #000;
  height: 50vh;
  width: 100%;
  overflow: auto;
}
</style>
