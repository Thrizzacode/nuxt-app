import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
// @ts-expect-error private method and property
import CryptoJS from "crypto-js";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();
  io.bind(engine);
  const connectedUsers = new Set<string>();
  const userMap = new Map<string, string>();
  const messageQueue: string[] = [];
  const rankQueue: any[] = [];

  const kamenRiders = new Set<string>([
    "Kamen Rider Ichigo",
    "Kamen Rider Nigo",
    "Kamen Rider V3",
    "Kamen Rider X",
    "Kamen Rider Amazon",
    "Kamen Rider Stronger",
    "Kamen Rider Sky Rider",
    "Kamen Rider Super-1",
    "Kamen Rider ZX",
    "Kamen Rider BLACK",
    "Kamen Rider BLACK RX",
    "Kamen Rider Shin",
    "Kamen Rider ZO",
    "Kamen Rider J",
    "Kamen Rider Kuuga",
    "Kamen Rider Agito",
    "Kamen Rider Ryuki",
    "Kamen Rider 555 (Faiz)",
    "Kamen Rider Blade",
    "Kamen Rider Hibiki",
    "Kamen Rider Kabuto",
    "Kamen Rider Den-O",
    "Kamen Rider Kiva",
    "Kamen Rider Decade",
    "Kamen Rider W (Double)",
    "Kamen Rider OOO",
    "Kamen Rider Fourze",
    "Kamen Rider Wizard",
    "Kamen Rider Gaim",
    "Kamen Rider Drive",
    "Kamen Rider Ghost",
    "Kamen Rider Ex-Aid",
    "Kamen Rider Build",
    "Kamen Rider Zi-O",
    "Kamen Rider Zero-One",
    "Kamen Rider Saber",
    "Kamen Rider Revice",
    "Kamen Rider Geats",
    "Kamen Rider Gotchard",
  ]);

  let isCountingDown = false;
  let countdown = 5;
  let currentMultiplier = 1.0;
  let crashPoint = 0;
  let isGameStarted = false;
  let countdownInterval: NodeJS.Timeout | null = null;
  let gameInterval: NodeJS.Timeout | null = null;

  const truncateTo2 = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };

  // 开始倒计时
  const startCountdown = () => {
    console.log("Starting countdown");
    isCountingDown = true;
    countdown = 5;
    rankQueue.length = 0;

    // 清除可能存在的舊計時器
    if (countdownInterval) clearInterval(countdownInterval);
    if (gameInterval) clearInterval(gameInterval);

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

  // GUID
  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  let hashChain: string[] = [];

  const generateHashChain = (previousHash: string, count: number) => {
    // 開始計時
    console.time("generateHashChain");

    const generate = (hash: string, currentCount: number) => {
      if (currentCount >= 1000) {
        // 結束計時並顯示執行時間
        console.log(hashChain);
        console.timeEnd("generateHashChain");
        return;
      }

      const newHash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Hex);
      hashChain.push(newHash);
      generate(newHash, currentCount + 1);
    };

    // 開始生成
    generate(previousHash, count);
  };

  // 初始呼叫
  const startHash = CryptoJS.SHA256(_uuid()).toString(CryptoJS.enc.Hex);
  hashChain.push(startHash);
  generateHashChain(startHash, 1);

  const hashToFloats = (hash: string) => {
    const floats: number[] = [];
    const chunkSize = 8;

    // 切分成8組
    for (let i = 0; i < hash.length; i += chunkSize) {
      const chunk = hash.slice(i, i + chunkSize);

      // 十六進制轉十進制後除以16^8
      const decimal = parseInt(chunk, 16);
      const float = decimal / Math.pow(16, 8);

      floats.push(float);
    }

    return floats;
  };

  let index = 1;
  // 开始游戏
  const startGame = () => {
    isCountingDown = false;
    let step = 0.01;
    let result = hashToFloats(hashChain[hashChain.length - index] || "");
    index++;
    console.log(hashChain[hashChain.length - index]);
    crashPoint = (0.99 * 1) / (1 - result[0]);
    console.log(crashPoint);
    console.log("Game started, result is", crashPoint);
    currentMultiplier = 1.0;
    io.emit("start", truncateTo2(crashPoint));
    // 累加倍率
    gameInterval = setInterval(() => {
      // if (currentMultiplier >= 100) {
      //   step = 1 / 8;
      // } else if (currentMultiplier >= 20) {
      //   step = 1 / 10;
      // } else if (currentMultiplier >= 15) {
      //   step = 1 / 13.3;
      // } else if (currentMultiplier >= 9.1) {
      //   step = 1 / 15.2;
      // } else if (currentMultiplier >= 8.1) {
      //   step = 1 / 17;
      // } else if (currentMultiplier >= 7.1) {
      //   step = 1 / 19;
      // } else if (currentMultiplier >= 6.1) {
      //   step = 1 / 22;
      // } else if (currentMultiplier >= 5.1) {
      //   step = 1 / 26.7;
      // } else if (currentMultiplier >= 4.1) {
      //   step = 1 / 32.1;
      // } else if (currentMultiplier >= 3.1) {
      //   step = 1 / 41.7;
      // } else if (currentMultiplier >= 2.1) {
      //   step = 1 / 58.5;
      // }
      step += 0.001;
      // console.log(step);
      currentMultiplier += step;
      io.emit("multiplier", truncateTo2(currentMultiplier));
      // console.log("Current multiplier:", currentMultiplier.toFixed(2));
      if (currentMultiplier >= crashPoint) {
        // 触发崩溃
        console.log("Crash!");
        // @ts-expect-error private method and property
        clearInterval(gameInterval);
        io.emit("crash");
        io.emit("multiplier", truncateTo2(crashPoint));
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
    userMap.set(socket.id, user);
    connectedUsers.add(user);
    console.log("Client connected:", socket.id);

    // 廣播目前所有已連線的使用者
    io.emit("connectedUsers", Array.from(connectedUsers));

    socket.on("updateUser", (newUsername: string) => {
      const oldUsername = userMap.get(socket.id);
      if (oldUsername) {
        connectedUsers.delete(oldUsername);
        connectedUsers.add(newUsername);
        userMap.set(socket.id, newUsername);
      }
      socket.emit("userName", newUsername);
    });

    // 當使用者斷線時，從列表中移除
    socket.on("disconnect", () => {
      connectedUsers.delete(user);
      console.log("Client disconnected:", socket.id);

      // 廣播更新後的已連線使用者列表
      io.emit("connectedUsers", Array.from(connectedUsers));
    });

    // 處理客戶端請求已連線使用者列表的事件
    socket.on("requestConnectedUsers", () => {
      io.emit("userName", userMap.get(socket.id));
      io.emit("connectedUsers", Array.from(connectedUsers));
      io.emit("message", messageQueue);
      if (!isCountingDown) {
        io.emit("start", crashPoint);
      }
    });

    socket.on("message", (message: string) => {
      console.log("Client message:", message);
      const username = userMap.get(socket.id);
      const userMessage: any = { user: username, message: message };
      messageQueue.push(userMessage);
      io.emit("message", messageQueue);
    });

    socket.on("clean", () => {
      messageQueue.length = 0;
      io.emit("message", messageQueue);
    });

    socket.on("reset", () => {
      console.log("Client reset");
      if (gameInterval) {
        clearInterval(gameInterval);
      }
      startCountdown();
    });

    socket.on("cashout", (data: any) => {
      console.log("Client cashout:", data);
      const username = userMap.get(socket.id);
      const userCashout: any = { user: username, multipler: data };
      rankQueue.push(userCashout);
      io.emit(
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
