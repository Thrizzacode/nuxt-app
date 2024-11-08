import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();
  const connectedUsers = new Set<string>();
  const messageQueue: string[] = [];
  const kamenRiders = new Set<string>([
    "假面騎士一號",
    "假面騎士二號",
    "假面騎士V3",
    "假面騎士X",
    "假面騎士亞馬遜",
    "假面騎士Stronger",
    "假面騎士Sky Rider",
    "假面騎士Super-1",
    "假面騎士ZX",
    "假面騎士BLACK",
    "假面騎士BLACK RX",
    "假面騎士Shin",
    "假面騎士ZO",
    "假面騎士J",
    "假面騎士空我",
    "假面騎士Agito",
    "假面騎士龍騎",
    "假面騎士555（Faiz）",
    "假面騎士劍（Blade）",
    "假面騎士響鬼",
    "假面騎士Kabuto",
    "假面騎士電王",
    "假面騎士Kiva",
    "假面騎士Decade",
    "假面騎士W（Double）",
    "假面騎士OOO",
    "假面騎士Fourze",
    "假面騎士Wizard",
    "假面騎士鎧武（Gaim）",
    "假面騎士Drive",
    "假面騎士Ghost",
    "假面騎士Ex-Aid",
    "假面騎士Build",
    "假面騎士ZI-O",
    "假面騎士Zero-One",
    "假面騎士聖刃（Saber）",
    "假面騎士Revice",
    "假面騎士GEATS",
    "假面騎士Gotchard",
  ]);

  io.bind(engine);

  io.on("connection", (socket: any) => {
    // 將新連線的使用者加入列表
    const user =
      Array.from(kamenRiders)[Math.floor(Math.random() * kamenRiders.size)];
    connectedUsers.add(user);
    console.log("Client connected:", socket.id);

    // 廣播目前所有已連線的使用者
    io.emit("connectedUsers", Array.from(connectedUsers));

    // 當使用者斷線時，從列表中移除
    socket.on("disconnect", () => {
      connectedUsers.delete(user);
      console.log("Client disconnected:", socket.id);

      // 廣播更新後的已連線使用者列表
      io.emit("connectedUsers", Array.from(connectedUsers));
    });

    // 處理客戶端請求已連線使用者列表的事件
    socket.on("requestConnectedUsers", () => {
      socket.emit("connectedUsers", Array.from(connectedUsers));
      socket.emit("message", messageQueue);
    });

    socket.on("message", (message: string) => {
      console.log("Client message:", message);
      const userMessage: any = { user: user, message: message };
      messageQueue.push(userMessage);
      io.emit("message", messageQueue);
    });

    socket.on("clean", () => {
      messageQueue.length = 0;
      io.emit("message", messageQueue);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event: any) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer: any) {
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
