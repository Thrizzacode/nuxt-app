<script setup>
import { socket } from "./socket";

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

const test = ref(0);
socket.on("connect", onConnect);
socket.on("message", (value) => {
  console.log("Received message:", value);
  test.value = value;
});
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});

const sendMessage = () => {
  socket.emit("message", "Hello, world!");
};
</script>

<template>
  <div>
    <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
    <p>Transport: {{ transport }}</p>
  </div>
  <button type="button" @click="sendMessage">send</button>
  {{ test }}
</template>
