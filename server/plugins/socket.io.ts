import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();
  const connectedUsers = new Set<string>();

  io.bind(engine);

  io.on("connection", (socket: any) => {
    // 將新連線的使用者加入列表
    connectedUsers.add(socket.id);
    console.log("Client connected:", socket.id);

    // 廣播目前所有已連線的使用者
    io.emit("connectedUsers", Array.from(connectedUsers));

    // 當使用者斷線時，從列表中移除
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);
      console.log("Client disconnected:", socket.id);

      // 廣播更新後的已連線使用者列表
      io.emit("connectedUsers", Array.from(connectedUsers));
    });

    // 處理客戶端請求已連線使用者列表的事件
    socket.on("requestConnectedUsers", () => {
      socket.emit("connectedUsers", Array.from(connectedUsers));
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error private method and property
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );
});
