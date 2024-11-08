<script setup>
import { socket } from "./socket";

const isConnected = ref(false);
const transport = ref("N/A");
const message = ref("");
const reciveMessage = ref("");

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

const test = ref(0);
socket.on("connect", onConnect);
socket.on("message", (value) => {
  console.log("Received message:", value);
  reciveMessage.value = value;
});
socket.on("connectedUsers", (value) => {
  console.log("Received connectedUsers:", value);
  test.value = value;
});
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});

const sendMessage = () => {
  socket.emit("message", message.value);
  message.value = "";
};

const cleanMessage = () => {
  socket.emit("clean");
};
</script>

<template>
  <div class="main">
    <div>
      <div>
        <p>Current User: {{ test }}</p>
        <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
        <p>Transport: {{ transport }}</p>
      </div>
      <div>
        <input v-model="message" type="text" @keyup.enter="sendMessage" />
        <button type="button" @click="sendMessage">send</button>
        <button type="button" @click="cleanMessage">clean</button>
      </div>
    </div>
    <div class="message">
      <p v-for="msg in reciveMessage" :key="msg.user + msg.message">
        <strong>{{ msg.user }}:</strong> {{ msg.message }}
      </p>
    </div>
  </div>
</template>
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
