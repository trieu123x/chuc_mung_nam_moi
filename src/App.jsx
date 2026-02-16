import { useEffect, useRef, useState } from "react";
import moonImg from "./assets/moon.png";
import lixiImg from "./assets/lixi.png";
import { motion, AnimatePresence } from "framer-motion";
import nhac from "./assets/nhac.mp3";
export default function App() {
  const canvasRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [money, setMoney] = useState(null);
  const [hasRandomed, setHasRandomed] = useState(false);
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [error, setError] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const [displayMoney, setDisplayMoney] = useState(0);
  const [miniBoom, setMiniBoom] = useState(false);
  const [autoFire, setAutoFire] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [tb, setTb] = useState();
  const [hasReceivedMoney, setHasReceivedMoney] = useState(
  localStorage.getItem("hasReceivedMoney") === "true"
  );
  const [open, setOpen] = useState(false);
const lixiRef = useRef(null);
const banks = [
  "Vietcombank",
  "Techcombank",
  "BIDV",
  "VietinBank",
  "ACB",
  "MB Bank",
  "TPBank",
  "VPBank",
  "SHB",
  "SCB",
  "OCB",
  "VIB",
  "MSB",
  "Eximbank",
  "ABBank",
  "SeABank",
];

  const audioRef = useRef(null);
  useEffect(() => {
  const startMusic = async () => {
    try {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 1;
      await audio.play();

      window.removeEventListener("pointerdown", startMusic);
    } catch (err) {
      console.log("Play failed:", err);
    }
  };

  window.addEventListener("pointerdown", startMusic);

  return () => {
    window.removeEventListener("pointerdown", startMusic);
  };
}, []);

const showToast = (message) => {
  setTb(message);

  setTimeout(() => {
    setTb(null);
  }, 3000);
};
  const isInsideLixi = (x, y) => {
  if (!lixiRef.current) return false;

  const rect = lixiRef.current.getBoundingClientRect();

  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
};



  const randomMoney = () => {
    if (hasRandomed) return;

    setIsRolling(true);

    const raw = Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000;

    const finalAmount = Math.round(raw / 1000) * 1000;

    let interval = setInterval(() => {
      const fake = Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000;
      setDisplayMoney(fake);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      setHasRandomed(true);
      setMoney(finalAmount);
      setDisplayMoney(finalAmount);

      // bật hiệu ứng nổ mini
      setMiniBoom(true);
      setTimeout(() => setMiniBoom(false), 800);
    }, 5000);
  };

  const handleSubmit = () => {
    if (!account || !bank) {
      setError("Vui lòng nhập đủ thông tin!");
      return;
    }
    localStorage.setItem("hasReceivedMoney", "true");
  setHasReceivedMoney(true);
    setError("");
    alert(`Đã gửi ${money.toLocaleString()} VND đến ${bank} - ${account}`);
    setShowForm(false);
  };

  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let rockets = [];
    let explosions = [];
    let shockwaves = [];
    let shootingStars = [];
    let texts = [];
    let time = 0;

    const wishes = [
      "Mã đáo thành công",
      "Tấn tài tấn lộc",
      "Vạn sự như ý",
      "Phát tài phát lộc",
      "Dồi dào sức khỏe",
      "An khang thịnh vượng",
      "Bình an, hạnh phúc",
      "Mã phi nước đại",
      "Triều đẹp trai",
      "No.1 Billiard",
    ];

  

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    //  ===== SAO BANG =====
    const createShootingStars = () => {
      const count = Math.floor(Math.random() * 2) + 1; // 1–3 sao

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * (Math.PI / 6) + Math.PI / 4;
        // bay chéo xuống (45° đến ~75°)

        shootingStars.push({
          x: Math.random() * canvas.width,
          y: -20, // bắt đầu từ trên màn hình
          length: Math.random() * 200 + 250,
          speed: Math.random() * 3 + 5,
          opacity: 1,
          angle: angle,
        });
      }
    };

    // 3–6 giây xuất hiện 1 lần
    let shootingInterval = setInterval(() => {
  if (Math.random() > 0.4) {
    createShootingStars();
  }
}, 4000);


    // ===== SAO NỀN =====
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        a: Math.random(),
        d: Math.random() * 0.02,
      });
    }

    // ===== ÂM THANH =====
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playLaunchSound = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        40,
        audioCtx.currentTime + 0.3,
      );

      gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    };

    const playExplosionSound = () => {
      const duration = 1.2;

      // Bass boom
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        30,
        audioCtx.currentTime + duration,
      );

      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);

      // Noise burst
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      const noiseGain = audioCtx.createGain();

      noise.buffer = buffer;

      noiseGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration,
      );

      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      noise.start();
    };

    // ===== CLICK BẮN PHÁO =====

   


    const handleClick = (e) => {

      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;

      
      if (showHint) {
        setShowHint(false);
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      

      rockets.push({
        x: targetX,
        y: canvas.height,
        targetY,
        speed: 6,
        color: `hsl(${Math.random() * 360},100%,60%)`,
        trail: [],
      });

      playLaunchSound();
    };
    
    // ===== Li xi =====

  

    // ===== PHAO HOA =====
    function createFirework() {
      const particleCount = 120;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;

        // tốc độ khác nhau
        const speed = Math.random() * 6 + 2;

        // kích thước khác nhau (to nhỏ ngẫu nhiên)
        const size = Math.random() * 4 + 1;

        fireworks.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: size,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        });
      }
    }

    canvas.addEventListener("click", handleClick);

    // ===== ANIMATE =====
    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time++;
     

      // ===== SAO BAY =====
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const dx = Math.cos(star.angle);
        const dy = Math.sin(star.angle);

        const endX = star.x - dx * star.length;
        const endY = star.y - dy * star.length;

        // Gradient đuôi mờ
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);

        gradient.addColorStop(0, `rgba(255,255,255,${star.opacity})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow đầu sao
        const glow = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          10,
        );

        glow.addColorStop(0, `rgba(255,255,255,${star.opacity})`);
        glow.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.arc(star.x, star.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Di chuyển
        star.x += dx * star.speed;
        star.y += dy * star.speed;
        star.opacity -= 0.004;

        if (star.opacity <= 0 || star.y > canvas.height + 50) {
          shootingStars.splice(i, 1);
        }
      }

      // Sao nền
      stars.forEach((s) => {
        s.a += s.d;
        if (s.a <= 0 || s.a >= 1) s.d *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });

      // ===== ROCKET =====
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();

        // vệt lửa
        for (let t = 0; t < r.trail.length; t++) {
          const p = r.trail[t];
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,150,0,${t / r.trail.length})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        r.y -= r.speed;

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color, true);
          rockets.splice(i, 1);
        }
      }

      // ===== EXPLOSION =====
      for (let i = explosions.length - 1; i >= 0; i--) {
        const p = explosions[i];

        ctx.save();

        ctx.globalAlpha = p.alpha;

        // Hạt to sẽ có glow mạnh hơn
        ctx.shadowColor = `rgba(${p.rgb},1)`;
        ctx.shadowBlur = p.size * 3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb},1)`;
        ctx.fill();

        ctx.restore();

        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.03;
        p.alpha -= 0.01;

        if (p.alpha <= 0) explosions.splice(i, 1);
      }

      // ===== SHOCKWAVE =====
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const s = shockwaves[i];

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        s.radius += 3;
        s.alpha -= 0.02;

        if (s.alpha <= 0) shockwaves.splice(i, 1);
      }
      // ===== TEXT =====
      for (let i = texts.length - 1; i >= 0; i--) {
        const t = texts[i];

        t.life++;

        const progress = t.life / t.maxLife;
        const alpha = 1 - progress;
        const scale = 0.6 + progress * 0.6;

        const wave = Math.sin(t.life * 0.1) * 5; // uốn lượn nhẹ

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.translate(t.x, t.y + wave);
        ctx.scale(scale, scale);

        // Gradient màu
        const gradient = ctx.createLinearGradient(-100, 0, 100, 0);
        gradient.addColorStop(0, `hsl(${t.hue}, 100%, 60%)`);
        gradient.addColorStop(1, `hsl(${(t.hue + 60) % 360}, 100%, 70%)`);

        // Glow nhiều lớp
        ctx.shadowColor = `hsl(${t.hue}, 100%, 60%)`;
        ctx.shadowBlur = 25;

        ctx.fillStyle = gradient;

        ctx.font = "bold 32px 'Comic Sans MS', cursive";
        ctx.textAlign = "center";

        ctx.fillText(t.text, 0, 0);

        ctx.restore();

        if (t.life >= t.maxLife) {
          texts.splice(i, 1);
        }
      }

   

     
    };
const loop = () => {
    animate();
    animationId = requestAnimationFrame(loop);
  };

  animationId = requestAnimationFrame(loop);
    // ===== EXPLODE FUNCTION =====
    function explode(x, y, color, double) {
      const rgb = hslToRgb(color);

      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const speed = Math.random() * 4 + 2;
        const size = Math.random() * 3 + 1;
        explosions.push({
          x,
          y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          alpha: 1,
          rgb,
          size,
        });
      }
      texts.push({
        x,
        y,
        text: wishes[Math.floor(Math.random() * wishes.length)],
        alpha: 0,
        scale: 0.5,
        life: 0,
        maxLife: 180,
        hue: Math.random() * 360,
      });

      shockwaves.push({ x, y, radius: 0, alpha: 0.8 });

      playExplosionSound();

      // nổ tầng 2
    }

    function hslToRgb(hsl) {
      const dummy = document.createElement("div");
      dummy.style.color = hsl;
      document.body.appendChild(dummy);
      const rgb = getComputedStyle(dummy).color;
      document.body.removeChild(dummy);
      return rgb.match(/\d+/g).slice(0, 3).join(",");
    }
    let autoInterval = null;
    const handleVisibilityChange = () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
    clearInterval(shootingInterval);
  } else {
    animationId = requestAnimationFrame(loop);

    shootingInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        createShootingStars();
      }
    }, 4000);
  }
};

document.addEventListener("visibilitychange", handleVisibilityChange);

  

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      clearInterval(shootingInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (autoInterval) clearInterval(autoInterval);
    };
  }, []);

useEffect(() => {
  if (!autoFire) return;

  const canvas = canvasRef.current;

  const interval = setInterval(() => {
    let randomX, randomY;
    let element;

    do {
      randomX = Math.random() * window.innerWidth;
      randomY = Math.random() * (window.innerHeight / 2);

      element = document.elementFromPoint(randomX, randomY);

    } while (element === lixiRef.current);

    const event = new MouseEvent("click", {
      clientX: randomX,
      clientY: randomY,
      bubbles: true
    });

    canvas.dispatchEvent(event);
  }, 500);

  return () => clearInterval(interval);
}, [autoFire]);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setAutoFire(false); // tắt auto khi rời tab
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);

  useEffect(() => {
  const handleVisibility = () => {
    if (!document.hidden) {
      lastTime = performance.now();
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, []);

  return (
    <div className="relative h-screen">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-screen md:h-full" />
      <AnimatePresence>
  {tb && (
    <motion.div
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1.1 }}
      exit={{ y: -80, opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 
                 
                 text-white px-8 py-4 rounded-2xl 
                 shadow-2xl text-xl font-bold
                 z-[9999]"
    >
      {tb}
    </motion.div>
  )}
</AnimatePresence>


      <div className="fixed top-5 left-5 text-gray-300 text-sm font-medium select-none">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={autoFire}
      onChange={(e) => setAutoFire(e.target.checked)}
      className="w-4 h-4 accent-pink-500 cursor-pointer"
    />
    <span className="transition-colors text-xl duration-300">
      Auto pháo hoa
    </span>
  </label>
</div>


      {showForm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white/10 backdrop-blur-md border border-gray-400/40 rounded-2xl w-96 p-6 shadow-2xl">
            {/* Nút đóng */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
            {error && (
              <div className="text-red-400 font-bold text-lg mb-3 text-center">
                {error}
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-200 mb-6 text-center">
              Nhận lì xì 🧧
            </h2>

            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Nhập số tài khoản"
              className="w-full mb-4 px-4 py-2 rounded-xl bg-transparent border-2 border-gray-400/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition"
            />

            <div className="relative mb-6">

  <div className="relative w-full mb-6">
  {/* Button */}
  <div
    onClick={() => setOpen(!open)}
    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-gray-100 cursor-pointer"
  >
    {bank || "Chọn ngân hàng"}
  </div>

  {/* Dropdown */}
  {open && (
    <ul className="
      absolute
      w-full
      mt-2
      max-h-60
      overflow-y-auto
      rounded-2xl
      bg-gray-100
      border border-white/20
      shadow-xl
      z-50
    ">
      {banks.map((b, index) => (
        <li
          key={index}
          onClick={() => {
            setBank(b);
            setOpen(false);
          }}
          className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer transition"
        >
          {b}
        </li>
      ))}
    </ul>
  )}
</div>

  {/* Icon mũi tên custom */}
  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-300">
    ▼
  </div>
</div>

            <button
              onClick={randomMoney}
              disabled={hasRandomed}
              className={`w-full py-2 mb-4 rounded-xl transition ${
                hasRandomed
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              🎲 Random tiền lì xì
            </button>

            {displayMoney > 0 && (
              <div className="relative text-2xl font-bold text-green-400 mb-4 text-center">
                💰 {displayMoney.toLocaleString()} VND
                {miniBoom && (
                  <div className="fixed inset-0 pointer-events-none overflow-hidden z-999">
                    {[...Array(120)].map((_, i) => {
                      const angle = Math.random() * 2 * Math.PI;
                      const distance = Math.random() * 400 + 200;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;

                      return (
                        <span
                          key={i}
                          className="confetti-full"
                          style={{
                            "--x": `${x}px`,
                            "--y": `${y}px`,
                          }}
                        ></span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-2 rounded-xl bg-gray-200 text-black hover:bg-white transition"
            >
              Gửi 🎉
            </button>
          </div>
        </div>
      )}
      {showHint && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-xl text-xl animate-pulse">
          Click để bắn pháo hoa 
        </div>
      )}
      
      <div
  className={`absolute bottom-10 left-6 
              w-16 sm:w-24 md:w-32 
              transition-all duration-300`}
>
  {/* Glow layer khi chưa nhận tiền */}
  {!hasReceivedMoney && (
    <div className="absolute inset-0 
                    bg-red-400 
                    rounded-xl 
                    blur-2xl 
                    opacity-40 
                    animate-pulse 
                    scale-110">
    </div>
  )}

  <img
    onClick={() => {
      if (hasReceivedMoney) {
        setTb("Ăn lằm ăn lốn >:(");
        setTimeout(() => setTb(null), 3000);
        return;
      }
      setShowForm(true);
    }}
    src={lixiImg}
    ref={lixiRef}
    className={`relative w-full h-auto cursor-pointer
                ${!hasReceivedMoney ? "lixi-animate" : ""}`}
  />
</div>

      <div className="absolute top-6 right-6 z-10">
  
  {/* Glow layer */}
  <div className="absolute inset-0 
                  bg-yellow-200 
                  rounded-full 
                  blur-3xl 
                  opacity-40 
                  scale-110">
  </div>

  {/* Moon */}
  <img
    src={moonImg}
    className="relative w-24 sm:w-32 md:w-40"
  />
</div>


<audio ref={audioRef} src={nhac} autoPlay loop></audio>
    </div>
  );
}
