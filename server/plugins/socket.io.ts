import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();
  io.bind(engine);
  const connectedUsers = new Set<string>();
  const messageQueue: string[] = [];
  const rankQueue: any[] = [];

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

  let isCountingDown = false;
  let countdown = 5;
  let currentMultiplier = 1.0;
  let result = 0;
  let isGameStarted = false;
  let countdownInterval: NodeJS.Timeout | null = null;
  let gameInterval: NodeJS.Timeout | null = null;

  // 开始倒计时
  const startCountdown = () => {
    console.log("Starting countdown");
    isCountingDown = true;
    countdown = 5;
    rankQueue.length = 0;

    // 清除可能存在的舊計時器
    // if (countdownInterval) clearInterval(countdownInterval);
    // if (gameInterval) clearInterval(gameInterval);

    // 發送倒數開始事件
    io.emit("countdownStart");
    io.emit("rank", rankQueue);
    io.emit("countdown", { countdown });

    countdownInterval = setInterval(() => {
      console.log("Countdown:", countdown);
      countdown--;

      if (countdown >= 0) {
        io.emit("countdown", { countdown });
      } else {
        // @ts-expect-error private method and property
        clearInterval(countdownInterval);
        startGame(); // 倒數結束後開始遊戲
      }
    }, 1000);
  };

  // 开始游戏
  const startGame = () => {
    // 生成随机结果
    // result = 0.99 / (1 - Math.random());
    result = 1.2;
    console.log("Game started, result is", result);
    currentMultiplier = 1.0;
    io.emit("start", { type: "gameStart", result });
    // 累加倍率
    gameInterval = setInterval(() => {
      currentMultiplier += 0.01;
      io.emit("multiplier", currentMultiplier.toFixed(2));
      console.log("Current multiplier:", currentMultiplier.toFixed(2));
      if (currentMultiplier >= result) {
        // 触发崩溃
        console.log("Crash!");
        // @ts-expect-error private method and property
        clearInterval(gameInterval);
        io.emit("crash");
        // 五秒后重新开始倒计时
        setTimeout(() => {
          startCountdown();
        }, 5000);
      }
    }, 100); // 每100毫秒累加一次
  };

  startCountdown();

  io.on("connection", (socket: any) => {
    // 將新連線的使用者加入列表
    const user =
      Array.from(kamenRiders)[Math.floor(Math.random() * kamenRiders.size)];
    connectedUsers.add(user);
    console.log("Client connected:", socket.id);

    // 廣播目前所有已連線的使用者
    socket.emit("connectedUsers", Array.from(connectedUsers));

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
      // 初始时启动倒计时
    });

    socket.on("message", (message: string) => {
      console.log("Client message:", message);
      const userMessage: any = { user: user, message: message };
      messageQueue.push(userMessage);
      socket.emit("message", messageQueue);
    });

    socket.on("clean", () => {
      messageQueue.length = 0;
      socket.emit("message", messageQueue);
    });

    socket.on("cashout", (data: any) => {
      console.log("Client cashout:", data);
      const userCashout: any = { user: user, multipler: data };
      rankQueue.push(userCashout);
      socket.emit(
        "rank",
        rankQueue.sort((a, b) => b.multipler - a.multipler)
      );
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
