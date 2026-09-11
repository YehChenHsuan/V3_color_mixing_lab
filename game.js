/**
 * Color Magic Lab 3D - Three.js ESL Game (Full Upgraded Edition)
 * Features:
 * - 3D Cauldron with double-sided complete interior (No hollow gap behind liquid)
 * - 100% Pre-synthesized Studio Quality Google Cloud Neural2 Audio Files
 * - Adjustable Speech Speed (0.75x, 1.0x, 1.25x)
 * - Live Subtitles (English, Bilingual with Traditional Chinese, or Hidden)
 * - Randomized Question Generator with Configurable Rounds (4, 6, 8 rounds)
 * - Solo Click Mode & 2-Player Split-Screen WebCam TPR Motion Control (Open Hand: Move, Fist: Lock)
 * - Auto-mixing upon 2-player selection (Auto-check & Reset on error / Advance on match)
 * - Real-time Timer & LocalStorage Hall of Fame (Leaderboard)
 */

// ==========================================
// 1. Subtitles & Bilingual Mapping
// ==========================================
const SUBTITLES_MAP = {
  'color_red': { en: 'Red', zh: '紅色' },
  'color_blue': { en: 'Blue', zh: '藍色' },
  'color_yellow': { en: 'Yellow', zh: '黃色' },
  'color_black': { en: 'Black', zh: '黑色' },
  'color_white': { en: 'White', zh: '白色' },
  'color_purple': { en: 'Purple', zh: '紫色' },
  'color_orange': { en: 'Orange', zh: '橘色' },
  'color_green': { en: 'Green', zh: '綠色' },
  'color_gray': { en: 'Gray', zh: '灰色' },

  'red': { en: 'Red', zh: '紅色' },
  'blue': { en: 'Blue', zh: '藍色' },
  'yellow': { en: 'Yellow', zh: '黃色' },
  'black': { en: 'Black', zh: '黑色' },
  'white': { en: 'White', zh: '白色' },
  'purple': { en: 'Purple', zh: '紫色' },
  'orange': { en: 'Orange', zh: '橘色' },
  'green': { en: 'Green', zh: '綠色' },
  'gray': { en: 'Gray', zh: '灰色' },

  'Red and blue make purple.': { en: 'Red and blue make purple.', zh: '紅色加上藍色變成紫色。' },
  'Red and yellow make orange.': { en: 'Red and yellow make orange.', zh: '紅色加上黃色變成橘色。' },
  'Blue and yellow make green.': { en: 'Blue and yellow make green.', zh: '藍色加上黃色變成綠色。' },
  'Black and white make gray.': { en: 'Black and white make gray.', zh: '黑色加上白色變成灰色。' },
  'Blue and red make purple.': { en: 'Blue and red make purple.', zh: '藍色加上紅色變成紫色。' },
  'Yellow and blue make green.': { en: 'Yellow and blue make green.', zh: '黃色加上藍色變成綠色。' },

  'prompt_1': { en: 'Can you make Purple? What colors do you need?', zh: '你能調出紫色嗎？你需要哪兩種顏色？' },
  'prompt_2': { en: 'Can you make Orange? What colors do you need?', zh: '你能調出橘色嗎？你需要哪兩種顏色？' },
  'prompt_3': { en: 'Can you make Green? What colors do you need?', zh: '你能調出綠色嗎？你需要哪兩種顏色？' },
  'prompt_4': { en: 'Can you make Gray? What colors do you need?', zh: '你能調出灰色嗎？你需要哪兩種顏色？' },
  'prompt_5': { en: 'Try again! Blue and what color make purple?', zh: '再試一次！藍色加上什麼顏色會變成紫色？' },
  'prompt_6': { en: 'Final Challenge! Yellow and what color make green?', zh: '終極挑戰！黃色加上什麼顏色會變成綠色？' },

  'welcome': { en: "Welcome to the Magic Laboratory! Let's mix colors!", zh: '歡迎來到魔法實驗室！我們一起來調配顏色吧！' },
  'full': { en: 'The cauldron is full! Press Stir or Clear.', zh: '坩堝已經滿了！請按攪拌或清除。' },
  'pick_two': { en: 'Please pick two colors first!', zh: '請先選擇兩種顏色放入坩堝！' },
  'cleared': { en: 'Cleared!', zh: '已清空坩堝！' },
  'retry_purple': { en: 'Oops! That does not make purple. Try again!', zh: '哎呀！這不會變成紫色，再試一次吧！' },
  'retry_orange': { en: 'Oops! That does not make orange. Try again!', zh: '哎呀！這不會變成橘色，再試一次吧！' },
  'retry_green': { en: 'Oops! That does not make green. Try again!', zh: '哎呀！這不會變成綠色，再試一次吧！' },
  'retry_gray': { en: 'Oops! That does not make gray. Try again!', zh: '哎呀！這不會變成灰色，再試一次吧！' },
  'complete': { en: 'Congratulations! You are a master color chemist!', zh: '恭喜你！你已經成為混色魔法大師！' }
};

// ==========================================
// 2. Audio Engine (Google Neural2 + Speed Control)
// ==========================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.currentAudio = null;
    this.playbackRate = 1.0;

    this.audioMap = {
      'red': 'audio/color_red.mp3',
      'blue': 'audio/color_blue.mp3',
      'yellow': 'audio/color_yellow.mp3',
      'black': 'audio/color_black.mp3',
      'white': 'audio/color_white.mp3',
      'purple': 'audio/color_purple.mp3',
      'orange': 'audio/color_orange.mp3',
      'green': 'audio/color_green.mp3',
      'gray': 'audio/color_gray.mp3',

      'color_red': 'audio/color_red.mp3',
      'color_blue': 'audio/color_blue.mp3',
      'color_yellow': 'audio/color_yellow.mp3',
      'color_black': 'audio/color_black.mp3',
      'color_white': 'audio/color_white.mp3',
      'color_purple': 'audio/color_purple.mp3',
      'color_orange': 'audio/color_orange.mp3',
      'color_green': 'audio/color_green.mp3',
      'color_gray': 'audio/color_gray.mp3',

      'Red and blue make purple.': 'audio/sent_red_blue.mp3',
      'Red and yellow make orange.': 'audio/sent_red_yellow.mp3',
      'Blue and yellow make green.': 'audio/sent_blue_yellow.mp3',
      'Black and white make gray.': 'audio/sent_black_white.mp3',
      'Blue and red make purple.': 'audio/sent_blue_red.mp3',
      'Yellow and blue make green.': 'audio/sent_yellow_blue.mp3',

      'prompt_1': 'audio/prompt_1.mp3',
      'prompt_2': 'audio/prompt_2.mp3',
      'prompt_3': 'audio/prompt_3.mp3',
      'prompt_4': 'audio/prompt_4.mp3',
      'prompt_5': 'audio/prompt_5.mp3',
      'prompt_6': 'audio/prompt_6.mp3',

      'welcome': 'audio/msg_welcome.mp3',
      'full': 'audio/msg_full.mp3',
      'pick_two': 'audio/msg_pick_two.mp3',
      'cleared': 'audio/msg_cleared.mp3',
      'retry_purple': 'audio/msg_retry_purple.mp3',
      'retry_orange': 'audio/msg_retry_orange.mp3',
      'retry_green': 'audio/msg_retry_green.mp3',
      'retry_gray': 'audio/msg_retry_gray.mp3',
      'complete': 'audio/msg_complete.mp3'
    };

    this.audioPool = {};
    for (const [key, path] of Object.entries(this.audioMap)) {
      const a = new Audio(path);
      a.preload = 'auto';
      this.audioPool[key] = a;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSpeed(rate) {
    this.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
  }

  playVoice(key, onEnd = null) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    const audio = this.audioPool[key] || new Audio(this.audioMap[key] || key);
    this.currentAudio = audio;
    audio.playbackRate = this.playbackRate;
    audio.currentTime = 0;

    if (onEnd) {
      audio.onended = () => {
        onEnd();
        audio.onended = null;
      };
    } else {
      audio.onended = null;
    }

    audio.play().catch(e => {
      console.warn("Audio play prevented:", e);
    });
  }

  playPlop() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playMagicBubbles() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const t = now + i * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450 + i * 120, t);
      osc.frequency.exponentialRampToValueAtTime(900 + i * 150, t + 0.08);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  playVictory() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const t = now + idx * 0.1;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  playErrorBuzz() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// ==========================================
// 3. 3D Laboratory Scene (Fixed Complete Solid Cauldron)
// ==========================================
class Lab3DScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    this.cauldron = null;
    this.liquid = null;
    this.bubbleParticles = [];
    this.wand = null;

    this.currentColor = new THREE.Color(0x3a1b5c);
    this.targetColor = new THREE.Color(0x3a1b5c);
    this.stirAngle = 0;
    this.isStirring = false;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 3.8, 7.5);
    this.camera.lookAt(0, 0.8, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff3d6, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    this.cauldronGlow = new THREE.PointLight(0xb388ff, 2.5, 5);
    this.cauldronGlow.position.set(0, 1.6, 0);
    this.scene.add(this.cauldronGlow);

    this.buildLabEnvironment();
    this.buildCauldron();
    this.buildBubbles();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  buildLabEnvironment() {
    const tableGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.4, 32);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x4a2a1a,
      roughness: 0.6,
      metalness: 0.1
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.2;
    table.receiveShadow = true;
    this.scene.add(table);
    this.tableMesh = table;

    const rimGeo = new THREE.TorusGeometry(3.7, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffd152,
      metalness: 0.7,
      roughness: 0.3
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);
    this.rimMesh = rim;

    // Magic Wand
    const wandHandle = new THREE.CylinderGeometry(0.04, 0.06, 1.6, 12);
    const wandMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
    const wandStar = new THREE.OctahedronGeometry(0.16, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffeb3b,
      emissive: 0xffc107,
      emissiveIntensity: 0.6
    });

    const wandGroup = new THREE.Group();
    const handleMesh = new THREE.Mesh(wandHandle, wandMat);
    const starMesh = new THREE.Mesh(wandStar, starMat);
    starMesh.position.y = 0.85;
    wandGroup.add(handleMesh);
    wandGroup.add(starMesh);

    wandGroup.position.set(1.6, 2.2, 0.5);
    wandGroup.rotation.z = -0.4;
    wandGroup.rotation.x = 0.3;
    this.scene.add(wandGroup);
    this.wand = wandGroup;
  }

  buildCauldron() {
    const cauldronGroup = new THREE.Group();

    // 關鍵修復：使用 DoubleSide 與完整內外壁幾何體，杜絕背面破洞！
    // Outer Cauldron Pot
    const bodyGeo = new THREE.SphereGeometry(1.2, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.78);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f28,
      metalness: 0.5,
      roughness: 0.45,
      side: THREE.DoubleSide // 確保由前看後時，後壁完整閉合！
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI;
    body.position.y = 1.0;
    body.castShadow = true;
    body.receiveShadow = true;
    cauldronGroup.add(body);

    // Inner Deep Basin (黑鐵內膽壁)
    const innerBasinGeo = new THREE.SphereGeometry(1.16, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.77);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x15151c,
      metalness: 0.3,
      roughness: 0.6,
      side: THREE.BackSide // 內襯表面朝內
    });
    const innerBasin = new THREE.Mesh(innerBasinGeo, innerMat);
    innerBasin.rotation.x = Math.PI;
    innerBasin.position.y = 1.0;
    cauldronGroup.add(innerBasin);

    // Thick Golden Rim (加厚金屬外唇，完全密封邊緣)
    const lipGeo = new THREE.TorusGeometry(0.96, 0.12, 16, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd152,
      metalness: 0.85,
      roughness: 0.25
    });
    const lip = new THREE.Mesh(lipGeo, goldMat);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 1.34;
    cauldronGroup.add(lip);

    // 3 Golden Standing Legs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const legGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.8, 12);
      const leg = new THREE.Mesh(legGeo, goldMat);
      leg.position.set(Math.cos(angle) * 0.8, 0.3, Math.sin(angle) * 0.8);
      leg.rotation.z = Math.cos(angle) * -0.25;
      leg.rotation.x = Math.sin(angle) * 0.25;
      leg.castShadow = true;
      cauldronGroup.add(leg);
    }

    // Liquid Surface (位於鍋唇下方適中深度，完美被金屬鍋壁包覆)
    const liquidGeo = new THREE.CircleGeometry(0.88, 36);
    this.liquidMat = new THREE.MeshStandardMaterial({
      color: this.currentColor,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.94,
      emissive: this.currentColor,
      emissiveIntensity: 0.35,
      side: THREE.FrontSide
    });
    this.liquid = new THREE.Mesh(liquidGeo, this.liquidMat);
    this.liquid.rotation.x = -Math.PI / 2;
    this.liquid.position.y = 1.22; // 稍微沉入鍋內，自然呈現液體在鍋中
    cauldronGroup.add(this.liquid);

    this.scene.add(cauldronGroup);
    this.cauldron = cauldronGroup;
  }

  buildBubbles() {
    const bubbleGeo = new THREE.SphereGeometry(0.08, 12, 12);
    for (let i = 0; i < 16; i++) {
      const bubbleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1
      });
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      this.resetBubble(bubble);
      bubble.position.y = 1.22 + Math.random() * 0.6;
      this.scene.add(bubble);
      this.bubbleParticles.push(bubble);
    }
  }

  resetBubble(bubble) {
    const r = Math.random() * 0.65;
    const theta = Math.random() * Math.PI * 2;
    bubble.position.set(Math.cos(theta) * r, 1.22, Math.sin(theta) * r);
    const scale = 0.5 + Math.random() * 0.8;
    bubble.scale.set(scale, scale, scale);
    bubble.userData.speed = 0.008 + Math.random() * 0.015;
    bubble.userData.wiggle = Math.random() * 10;
  }

  setLiquidColor(hexColor) {
    this.targetColor = new THREE.Color(hexColor);
    this.cauldronGlow.color = this.targetColor;
  }

  setTableVisible(visible) {
    if (this.tableMesh) this.tableMesh.visible = visible;
    if (this.rimMesh) this.rimMesh.visible = visible;
  }

  triggerStirAnimation(callback) {
    this.isStirring = true;
    let elapsed = 0;
    const duration = 1.2;

    const stirInterval = () => {
      elapsed += 0.02;
      this.stirAngle += 0.25;
      
      if (this.wand) {
        this.wand.position.x = Math.cos(this.stirAngle) * 0.6;
        this.wand.position.z = Math.sin(this.stirAngle) * 0.6;
        this.wand.position.y = 1.8 + Math.sin(elapsed * 10) * 0.1;
      }

      if (this.cauldron) {
        this.cauldron.rotation.y = Math.sin(this.stirAngle * 2) * 0.08;
      }

      if (elapsed < duration) {
        requestAnimationFrame(stirInterval);
      } else {
        this.isStirring = false;
        if (this.wand) {
          this.wand.position.set(1.6, 2.2, 0.5);
          this.wand.rotation.set(0.3, 0, -0.4);
        }
        if (this.cauldron) {
          this.cauldron.rotation.set(0, 0, 0);
        }
        if (callback) callback();
      }
    };
    stirInterval();
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.currentColor.lerp(this.targetColor, 0.06);
    if (this.liquidMat) {
      this.liquidMat.color = this.currentColor;
      this.liquidMat.emissive = this.currentColor;
    }

    if (this.wand && !this.isStirring) {
      this.wand.position.y = 2.2 + Math.sin(Date.now() * 0.003) * 0.08;
      this.wand.rotation.y += 0.01;
    }

    if (this.cauldron && !this.isStirring) {
      this.cauldron.position.y = Math.sin(Date.now() * 0.002) * 0.03;
    }

    this.bubbleParticles.forEach(b => {
      b.position.y += b.userData.speed;
      b.position.x += Math.sin(Date.now() * 0.005 + b.userData.wiggle) * 0.002;
      b.position.z += Math.cos(Date.now() * 0.005 + b.userData.wiggle) * 0.002;

      if (b.position.y > 2.1) {
        this.resetBubble(b);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// ==========================================
// 4. Color Palette & Questions Pool (Randomized)
// ==========================================
const COLOR_PALETTE = {
  red: { name: 'Red', hex: '#ff3344', threeHex: 0xff3344, voiceKey: 'color_red' },
  blue: { name: 'Blue', hex: '#2979ff', threeHex: 0x2979ff, voiceKey: 'color_blue' },
  yellow: { name: 'Yellow', hex: '#ffd600', threeHex: 0xffd600, voiceKey: 'color_yellow' },
  purple: { name: 'Purple', hex: '#9c27b0', threeHex: 0x9c27b0, voiceKey: 'color_purple' },
  orange: { name: 'Orange', hex: '#ff6d00', threeHex: 0xff6d00, voiceKey: 'color_orange' },
  green: { name: 'Green', hex: '#00e676', threeHex: 0x00e676, voiceKey: 'color_green' },
  black: { name: 'Black', hex: '#212121', threeHex: 0x212121, voiceKey: 'color_black' },
  white: { name: 'White', hex: '#ffffff', threeHex: 0xffffff, voiceKey: 'color_white' },
  gray: { name: 'Gray', hex: '#9e9e9e', threeHex: 0x9e9e9e, voiceKey: 'color_gray' }
};

// 完整混色題庫池（支援多輪隨機抽取）
const ALL_FORMULA_POOL = [
  {
    colorA: 'red',
    colorB: 'blue',
    target: 'purple',
    sentence: 'Red and blue make purple.',
    promptKey: 'prompt_1',
    retryKey: 'retry_purple'
  },
  {
    colorA: 'red',
    colorB: 'yellow',
    target: 'orange',
    sentence: 'Red and yellow make orange.',
    promptKey: 'prompt_2',
    retryKey: 'retry_orange'
  },
  {
    colorA: 'blue',
    colorB: 'yellow',
    target: 'green',
    sentence: 'Blue and yellow make green.',
    promptKey: 'prompt_3',
    retryKey: 'retry_green'
  },
  {
    colorA: 'black',
    colorB: 'white',
    target: 'gray',
    sentence: 'Black and white make gray.',
    promptKey: 'prompt_4',
    retryKey: 'retry_gray'
  },
  {
    colorA: 'blue',
    colorB: 'red',
    target: 'purple',
    sentence: 'Blue and red make purple.',
    promptKey: 'prompt_5',
    retryKey: 'retry_purple'
  },
  {
    colorA: 'yellow',
    colorB: 'blue',
    target: 'green',
    sentence: 'Yellow and blue make green.',
    promptKey: 'prompt_6',
    retryKey: 'retry_green'
  },
  {
    colorA: 'yellow',
    colorB: 'red',
    target: 'orange',
    sentence: 'Red and yellow make orange.',
    promptKey: 'prompt_2',
    retryKey: 'retry_orange'
  },
  {
    colorA: 'white',
    colorB: 'black',
    target: 'gray',
    sentence: 'Black and white make gray.',
    promptKey: 'prompt_4',
    retryKey: 'retry_gray'
  }
];

// ==========================================
// 5. Game Controller & TPR Webcam Hand Tracking
// ==========================================
class ColorMagicGame {
  constructor() {
    this.audio = new AudioEngine();
    this.lab3d = new Lab3DScene(document.getElementById('canvas-container'));

    // Game Config
    this.mode = 'solo'; // 'solo' or 'coop'
    this.totalRounds = 4; // 4, 6, or 8
    this.activeMissions = [];
    this.currentLevelIdx = 0;
    this.score = 0;

    // Timer state
    this.timerInterval = null;
    this.startTime = null;
    this.elapsedSeconds = 0;

    // Selections
    this.selectedColors = []; // Solo: holds up to 2 colors
    this.p1Choice = null;     // Coop Left
    this.p2Choice = null;     // Coop Right
    this.isEvaluating = false;

    // Speech & Subtitle settings
    this.speedLevels = [0.75, 1.0, 1.25];
    this.currentSpeedIdx = 1; // 1.0x
    this.subModes = ['bilingual', 'english', 'off'];
    this.currentSubModeIdx = 0; // bilingual

    // WebCam & MediaPipe Hands
    this.webcamRunning = false;
    this.camera = null;
    this.handsTracker = null;
    this.handsCanvas = document.getElementById('hands-canvas');
    this.handsCtx = this.handsCanvas.getContext('2d');
    this.p1State = { x: 0, y: 0, gesture: 'point', grabbedColor: null, active: false };
    this.p2State = { x: 0, y: 0, gesture: 'point', grabbedColor: null, active: false };

    // DOM References
    this.slot1 = document.getElementById('slot-1');
    this.slot2 = document.getElementById('slot-2');
    this.slotTarget = document.getElementById('slot-target');
    this.missionSubtitle = document.getElementById('mission-subtitle');
    this.levelIndicator = document.getElementById('level-indicator');
    this.progressBarFill = document.getElementById('progress-bar-fill');
    this.scoreText = document.getElementById('score-text');
    this.timerDisplay = document.getElementById('timer-display');

    this.subtitleBox = document.getElementById('subtitle-box');
    this.subEn = document.getElementById('sub-en');
    this.subZh = document.getElementById('sub-zh');

    this.speedLabel = document.getElementById('speed-label');
    this.subModeLabel = document.getElementById('sub-mode-label');
    this.modeBadge = document.getElementById('mode-badge');
    this.modeLabel = document.getElementById('mode-label');

    this.paletteDock = document.getElementById('palette-dock');
    this.coopDock = document.getElementById('coop-dock');
    this.bottomControls = document.getElementById('bottom-controls');

    this.startOverlay = document.getElementById('start-overlay');
    this.victoryOverlay = document.getElementById('victory-overlay');
    this.completeOverlay = document.getElementById('complete-overlay');
    this.rankOverlay = document.getElementById('rank-overlay');

    this.initPalette();
    this.bindEvents();
    this.updateSubtitleModeUI();
    this.onResizeWindow();
  }

  // Shuffle and pick N random questions
  generateRandomMissions(count) {
    const shuffled = [...ALL_FORMULA_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  initPalette() {
    // Solo palette
    const dock = document.getElementById('color-buttons');
    dock.innerHTML = '';
    const availableColors = ['red', 'blue', 'yellow', 'black', 'white'];

    availableColors.forEach(key => {
      const col = COLOR_PALETTE[key];
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.dataset.color = key;

      btn.innerHTML = `
        <div class="btn-swatch" style="background: ${col.hex};"></div>
        <span class="btn-name">${col.name}</span>
      `;

      btn.addEventListener('click', () => this.onPickSoloColor(key));
      dock.appendChild(btn);
    });

    // 2-Player Co-op Docks (P1 Left & P2 Right)
    const p1Container = document.getElementById('p1-buttons');
    const p2Container = document.getElementById('p2-buttons');
    p1Container.innerHTML = '';
    p2Container.innerHTML = '';

    availableColors.forEach(key => {
      const col = COLOR_PALETTE[key];

      // P1 Button
      const b1 = document.createElement('button');
      b1.className = 'coop-btn p1-btn';
      b1.dataset.color = key;
      b1.dataset.player = '1';
      b1.innerHTML = `<div class="btn-swatch" style="background: ${col.hex};"></div><span class="btn-text">${col.name}</span>`;
      b1.addEventListener('click', () => this.lockCoopChoice(1, key));
      p1Container.appendChild(b1);

      // P2 Button
      const b2 = document.createElement('button');
      b2.className = 'coop-btn p2-btn';
      b2.dataset.color = key;
      b2.dataset.player = '2';
      b2.innerHTML = `<div class="btn-swatch" style="background: ${col.hex};"></div><span class="btn-text">${col.name}</span>`;
      b2.addEventListener('click', () => this.lockCoopChoice(2, key));
      p2Container.appendChild(b2);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResizeWindow());

    // Mode Selector in Start Modal
    document.getElementById('tab-solo').addEventListener('click', () => {
      this.mode = 'solo';
      document.getElementById('tab-solo').classList.add('active');
      document.getElementById('tab-coop').classList.remove('active');
      document.getElementById('coop-camera-note').classList.add('hidden');
    });

    document.getElementById('tab-coop').addEventListener('click', () => {
      this.mode = 'coop';
      document.getElementById('tab-coop').classList.add('active');
      document.getElementById('tab-solo').classList.remove('active');
      document.getElementById('coop-camera-note').classList.remove('hidden');
    });

    // Rounds Pills
    document.querySelectorAll('.round-pills .pill-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.round-pills .pill-option').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        this.totalRounds = parseInt(btn.dataset.rounds, 10);
      });
    });

    // Speed Toggle
    document.getElementById('btn-speed-toggle').addEventListener('click', () => {
      this.currentSpeedIdx = (this.currentSpeedIdx + 1) % this.speedLevels.length;
      const newSpeed = this.speedLevels[this.currentSpeedIdx];
      this.audio.setSpeed(newSpeed);
      this.speedLabel.innerText = `${newSpeed}x`;
      this.audio.playPlop();
    });

    // Subtitle Toggle
    document.getElementById('btn-sub-toggle').addEventListener('click', () => {
      this.currentSubModeIdx = (this.currentSubModeIdx + 1) % this.subModes.length;
      this.updateSubtitleModeUI();
      this.audio.playPlop();
    });

    // Start Game
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.audio.ensureContext();
      this.startOverlay.classList.remove('active');
      this.setupGameMode();
    });

    // Next Level
    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.victoryOverlay.classList.remove('active');
      if (this.currentLevelIdx + 1 < this.activeMissions.length) {
        this.loadMission(this.currentLevelIdx + 1);
      } else {
        this.showGameComplete();
      }
    });

    // Play Again
    document.getElementById('btn-restart-game').addEventListener('click', () => {
      this.completeOverlay.classList.remove('active');
      this.startOverlay.classList.add('active');
    });

    // Back to Main Menu (右上角回到主選單按鈕)
    const btnBackMenu = document.getElementById('btn-back-menu');
    if (btnBackMenu) {
      btnBackMenu.addEventListener('click', () => {
        this.stopTimer();
        this.stopWebcam();
        this.clearSelected();
        if (this.audio && this.audio.currentAudio) {
          this.audio.currentAudio.pause();
        }
        document.getElementById('webcam-video').classList.remove('active');
        this.coopDock.classList.add('hidden');
        this.paletteDock.classList.add('hidden');
        this.bottomControls.classList.add('hidden');
        this.victoryOverlay.classList.remove('active');
        this.completeOverlay.classList.remove('active');
        this.rankOverlay.classList.remove('active');
        this.lab3d.setTableVisible(true);
        this.startOverlay.classList.add('active');
        this.audio.playPlop();
      });
    }

    // Clear (Solo)
    document.getElementById('btn-clear').addEventListener('click', () => {
      this.clearSelected();
      this.audio.playPlop();
      this.speakWithSubtitles('cleared');
    });

    // Stir & Mix (Solo)
    document.getElementById('btn-stir').addEventListener('click', () => {
      this.checkSoloFormula();
    });

    // Replay Prompt Audio
    document.getElementById('btn-replay-audio').addEventListener('click', () => {
      const mission = this.activeMissions[this.currentLevelIdx];
      if (mission) this.speakWithSubtitles(mission.promptKey);
    });

    // Speak Full Sentence
    document.getElementById('btn-speak-sentence').addEventListener('click', () => {
      const mission = this.activeMissions[this.currentLevelIdx];
      if (mission) this.speakWithSubtitles(mission.sentence);
    });

    // Leaderboard trigger
    document.getElementById('btn-show-ranks').addEventListener('click', () => {
      this.showLeaderboard('solo');
    });

    document.getElementById('btn-view-ranks-complete').addEventListener('click', () => {
      this.showLeaderboard(this.mode);
    });

    document.getElementById('btn-close-ranks').addEventListener('click', () => {
      this.rankOverlay.classList.remove('active');
    });

    document.getElementById('tab-rank-solo').addEventListener('click', () => {
      this.renderRankTable('solo');
      document.getElementById('tab-rank-solo').classList.add('active');
      document.getElementById('tab-rank-coop').classList.remove('active');
    });

    document.getElementById('tab-rank-coop').addEventListener('click', () => {
      this.renderRankTable('coop');
      document.getElementById('tab-rank-coop').classList.add('active');
      document.getElementById('tab-rank-solo').classList.remove('active');
    });

    // Save Rank score
    document.getElementById('btn-save-score').addEventListener('click', () => {
      this.saveLeaderboardScore();
    });
  }

  onResizeWindow() {
    this.handsCanvas.width = window.innerWidth;
    this.handsCanvas.height = window.innerHeight;
  }

  updateSubtitleModeUI() {
    const mode = this.subModes[this.currentSubModeIdx];
    if (mode === 'bilingual') {
      this.subModeLabel.innerText = 'EN + 中文';
      this.subtitleBox.classList.remove('sub-hidden');
      this.subZh.classList.remove('zh-hidden');
    } else if (mode === 'english') {
      this.subModeLabel.innerText = 'EN Only';
      this.subtitleBox.classList.remove('sub-hidden');
      this.subZh.classList.add('zh-hidden');
    } else if (mode === 'off') {
      this.subModeLabel.innerText = 'Subs Off';
      this.subtitleBox.classList.add('sub-hidden');
    }
  }

  speakWithSubtitles(key, onEnd = null) {
    const subData = SUBTITLES_MAP[key];
    if (subData) {
      this.subEn.innerText = subData.en;
      this.subZh.innerText = subData.zh;
    }
    this.audio.playVoice(key, onEnd);
  }

  // Setup game mode (Solo vs 2-Player Co-op)
  setupGameMode() {
    this.score = 0;
    this.updateScoreUI();
    this.activeMissions = this.generateRandomMissions(this.totalRounds);

    if (this.mode === 'solo') {
      this.modeLabel.innerText = 'Solo Mode';
      this.modeBadge.style.borderColor = 'rgba(186, 104, 200, 0.5)';
      this.paletteDock.classList.remove('hidden');
      this.bottomControls.classList.remove('hidden');
      this.coopDock.classList.add('hidden');
      document.getElementById('webcam-video').classList.remove('active');
      this.lab3d.setTableVisible(true);
      this.stopWebcam();
    } else {
      this.modeLabel.innerText = '👥 2-Player Co-op (TPR)';
      this.modeBadge.style.borderColor = '#00e5ff';
      this.paletteDock.classList.add('hidden');
      this.bottomControls.classList.add('hidden');
      this.coopDock.classList.remove('hidden');
      document.getElementById('webcam-video').classList.add('active');
      this.lab3d.setTableVisible(false); // 隱藏咖啡色大圓盤，純淨透出視訊畫面
      this.startWebcamMotion();
    }

    this.startTimer();

    this.speakWithSubtitles('welcome', () => {
      this.loadMission(0);
    });
  }

  // Timer functions
  startTimer() {
    this.stopTimer();
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
      const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
      this.timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  loadMission(idx) {
    this.currentLevelIdx = idx;
    const mission = this.activeMissions[idx];

    this.clearSelected();
    this.p1Choice = null;
    this.p2Choice = null;
    this.isEvaluating = false;

    // Reset Coop Buttons UI
    document.querySelectorAll('.coop-btn').forEach(b => b.classList.remove('locked'));

    this.levelIndicator.innerText = `Level ${idx + 1} / ${this.activeMissions.length}`;
    this.progressBarFill.style.width = `${((idx + 1) / this.activeMissions.length) * 100}%`;

    const targetInfo = COLOR_PALETTE[mission.target];
    this.slotTarget.innerText = targetInfo.name.toUpperCase();
    this.slotTarget.style.background = targetInfo.hex;
    this.slotTarget.style.color = (mission.target === 'yellow' || mission.target === 'white') ? '#000' : '#fff';

    this.missionSubtitle.innerText = `Make ${targetInfo.name}!`;
    this.lab3d.setLiquidColor(0x3a1b5c);

    setTimeout(() => {
      this.speakWithSubtitles(mission.promptKey);
    }, 300);
  }

  // Solo picking logic
  onPickSoloColor(colorKey) {
    if (this.selectedColors.length >= 2) {
      this.audio.playErrorBuzz();
      this.speakWithSubtitles('full');
      return;
    }

    this.selectedColors.push(colorKey);
    this.audio.playPlop();
    const colInfo = COLOR_PALETTE[colorKey];
    this.speakWithSubtitles(colInfo.voiceKey);

    this.updateSlotUI();

    if (this.selectedColors.length === 1) {
      this.lab3d.setLiquidColor(COLOR_PALETTE[this.selectedColors[0]].threeHex);
    } else if (this.selectedColors.length === 2) {
      this.lab3d.setLiquidColor(0x9575cd);
    }
  }

  updateSlotUI() {
    const c1Name = this.mode === 'solo' ? this.selectedColors[0] : this.p1Choice;
    const c2Name = this.mode === 'solo' ? this.selectedColors[1] : this.p2Choice;

    if (c1Name) {
      const c1 = COLOR_PALETTE[c1Name];
      this.slot1.innerText = c1.name;
      this.slot1.className = 'slot slot-1 filled';
      this.slot1.style.background = c1.hex;
      this.slot1.style.color = (c1.name === 'Yellow' || c1.name === 'White') ? '#000' : '#fff';
    } else {
      this.slot1.innerText = this.mode === 'solo' ? '?' : 'P1 ?';
      this.slot1.className = 'slot slot-1';
      this.slot1.style.background = 'rgba(255,255,255,0.1)';
      this.slot1.style.color = '#fff';
    }

    if (c2Name) {
      const c2 = COLOR_PALETTE[c2Name];
      this.slot2.innerText = c2.name;
      this.slot2.className = 'slot slot-2 filled';
      this.slot2.style.background = c2.hex;
      this.slot2.style.color = (c2.name === 'Yellow' || c2.name === 'White') ? '#000' : '#fff';
    } else {
      this.slot2.innerText = this.mode === 'solo' ? '?' : 'P2 ?';
      this.slot2.className = 'slot slot-2';
      this.slot2.style.background = 'rgba(255,255,255,0.1)';
      this.slot2.style.color = '#fff';
    }
  }

  clearSelected() {
    this.selectedColors = [];
    this.p1Choice = null;
    this.p2Choice = null;
    if (this.p1State) this.p1State.grabbedColor = null;
    if (this.p2State) this.p2State.grabbedColor = null;
    document.querySelectorAll('.coop-btn').forEach(b => {
      b.classList.remove('locked', 'grabbing', 'hovered');
    });
    this.updateSlotUI();
    this.lab3d.setLiquidColor(0x3a1b5c);
  }

  // Check formula in solo mode
  checkSoloFormula() {
    if (this.selectedColors.length < 2) {
      this.audio.playErrorBuzz();
      this.speakWithSubtitles('pick_two');
      return;
    }
    this.executeMixing(this.selectedColors[0], this.selectedColors[1], () => {
      this.clearSelected();
    });
  }

  // 取消單一玩家已鎖定的選擇
  clearCoopPlayerChoice(playerNum) {
    if (this.isEvaluating) return;
    if (playerNum === 1) {
      this.p1Choice = null;
      if (this.p1State) this.p1State.grabbedColor = null;
      document.querySelectorAll('.p1-btn').forEach(b => b.classList.remove('locked', 'grabbing'));
    } else if (playerNum === 2) {
      this.p2Choice = null;
      if (this.p2State) this.p2State.grabbedColor = null;
      document.querySelectorAll('.p2-btn').forEach(b => b.classList.remove('locked', 'grabbing'));
    }
    this.updateSlotUI();
    this.audio.playPlop();
  }

  // 2-Player Co-op Selection & Auto-mix trigger
  lockCoopChoice(playerNum, colorKey) {
    if (this.isEvaluating) return;

    if (playerNum === 1) {
      // 若點選已鎖定的相同顏色，則取消選擇
      if (this.p1Choice === colorKey) {
        this.clearCoopPlayerChoice(1);
        return;
      }
      this.p1Choice = colorKey;
      document.querySelectorAll('.p1-btn').forEach(b => {
        b.classList.toggle('locked', b.dataset.color === colorKey);
      });
      this.audio.playPlop();
      this.speakWithSubtitles(COLOR_PALETTE[colorKey].voiceKey);
    } else if (playerNum === 2) {
      // 若點選已鎖定的相同顏色，則取消選擇
      if (this.p2Choice === colorKey) {
        this.clearCoopPlayerChoice(2);
        return;
      }
      this.p2Choice = colorKey;
      document.querySelectorAll('.p2-btn').forEach(b => {
        b.classList.toggle('locked', b.dataset.color === colorKey);
      });
      this.audio.playPlop();
      this.speakWithSubtitles(COLOR_PALETTE[colorKey].voiceKey);
    }

    this.updateSlotUI();

    // 只要雙方都完成選擇，自動混和比對！
    if (this.p1Choice && this.p2Choice) {
      this.isEvaluating = true;
      setTimeout(() => {
        this.executeMixing(this.p1Choice, this.p2Choice, () => {
          // 不正確重來，清空選擇
          this.p1Choice = null;
          this.p2Choice = null;
          if (this.p1State) this.p1State.grabbedColor = null;
          if (this.p2State) this.p2State.grabbedColor = null;
          this.isEvaluating = false;
          document.querySelectorAll('.coop-btn').forEach(b => b.classList.remove('locked', 'grabbing'));
          this.updateSlotUI();
          this.lab3d.setLiquidColor(0x3a1b5c);
        });
      }, 500);
    }
  }

  // Unified Mixing Execution & Animation
  executeMixing(colorA, colorB, onFailReset) {
    const mission = this.activeMissions[this.currentLevelIdx];
    const picked = [colorA, colorB].sort();
    const correct = [mission.colorA, mission.colorB].sort();

    const isMatch = (picked[0] === correct[0] && picked[1] === correct[1]);

    this.audio.playMagicBubbles();

    this.lab3d.triggerStirAnimation(() => {
      if (isMatch) {
        const targetColor = COLOR_PALETTE[mission.target];
        this.lab3d.setLiquidColor(targetColor.threeHex);
        this.score += 100;
        this.updateScoreUI();

        if (window.confetti) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        this.audio.playVictory();
        this.speakWithSubtitles(mission.sentence, () => {
          // 雙人模式或單人模式自動跳轉/出勝利窗
          if (this.mode === 'coop') {
            // 雙人模式自動跳到下一關！
            setTimeout(() => {
              if (this.currentLevelIdx + 1 < this.activeMissions.length) {
                this.loadMission(this.currentLevelIdx + 1);
              } else {
                this.showGameComplete();
              }
            }, 1200);
          } else {
            this.showVictoryModal(mission);
          }
        });
      } else {
        this.audio.playErrorBuzz();
        this.lab3d.setLiquidColor(0x546e7a);
        this.speakWithSubtitles(mission.retryKey, () => {
          if (onFailReset) onFailReset();
        });
      }
    });
  }

  updateScoreUI() {
    this.scoreText.innerText = this.score;
  }

  showVictoryModal(mission) {
    document.getElementById('victory-sentence').innerText = `"${mission.sentence}"`;
    this.victoryOverlay.classList.add('active');
  }

  showGameComplete() {
    this.stopTimer();
    const finalMins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
    const finalSecs = String(this.elapsedSeconds % 60).padStart(2, '0');
    const timeStr = `${finalMins}:${finalSecs}`;

    document.getElementById('final-time-text').innerText = timeStr;
    document.getElementById('final-score-text').innerText = `${this.score} pts! ⭐`;

    this.completeOverlay.classList.add('active');
    this.audio.playVictory();
    this.speakWithSubtitles('complete');

    if (window.confetti) {
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.5 }
      });
    }
  }

  // ==========================================
  // 6. WebCam TPR Hand Motion Engine (MediaPipe)
  // ==========================================
  async startWebcamMotion() {
    if (this.webcamRunning) return;

    const video = document.getElementById('webcam-video');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      video.srcObject = stream;
      video.play();
      this.webcamRunning = true;
    } catch (err) {
      console.warn("Webcam not available, falling back to mouse interaction:", err);
      return;
    }

    if (window.Hands) {
      this.handsTracker = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.handsTracker.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.handsTracker.onResults((results) => this.onHandResults(results));

      this.camera = new Camera(video, {
        onFrame: async () => {
          if (this.webcamRunning) {
            await this.handsTracker.send({ image: video });
          }
        },
        width: 1280,
        height: 720
      });
      this.camera.start();
    }
  }

  stopWebcam() {
    this.webcamRunning = false;
    const video = document.getElementById('webcam-video');
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    this.handsCtx.clearRect(0, 0, this.handsCanvas.width, this.handsCanvas.height);
  }

  onHandResults(results) {
    this.handsCtx.clearRect(0, 0, this.handsCanvas.width, this.handsCanvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }

    // Process each detected hand
    for (const landmarks of results.multiHandLandmarks) {
      // 0: Wrist, 5: Index MCP, 9: Middle MCP, 13: Ring MCP, 17: Pinky MCP
      // 掌心中心點 (Palm Center)：手腕與指根掌骨 MCP 的加權幾何中心
      // 即使握拳或張手，掌心位置都極為穩固，完全不會跳動！
      const palmRawX = (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[13].x + landmarks[17].x) / 5.0;
      const palmRawY = (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5.0;

      // 鏡像翻轉 X（讓孩子就像照鏡子一樣直覺）
      const rawScreenX = (1.0 - palmRawX) * this.handsCanvas.width;
      const rawScreenY = palmRawY * this.handsCanvas.height;

      // 判斷左側 (Player 1) 還是右側 (Player 2)
      const isLeft = rawScreenX < this.handsCanvas.width * 0.5;
      const playerNum = isLeft ? 1 : 2;
      const state = playerNum === 1 ? this.p1State : this.p2State;

      // 低通平滑濾波（去除微小抖動，讓指針如絲般順滑）
      if (!state.active) {
        state.x = rawScreenX;
        state.y = rawScreenY;
        state.active = true;
      } else {
        state.x += (rawScreenX - state.x) * 0.5;
        state.y += (rawScreenY - state.y) * 0.5;
      }

      const screenX = state.x;
      const screenY = state.y;

      // 手勢判定（張開手掌 Open Hand vs 握拳 Fist）
      // 測量四指指尖 (8:食指, 12:中指, 16:無名指, 20:小指) 到掌心/手腕的距離
      const wrist = landmarks[0];
      const distIndex = Math.hypot(landmarks[8].x - wrist.x, landmarks[8].y - wrist.y);
      const distMiddle = Math.hypot(landmarks[12].x - wrist.x, landmarks[12].y - wrist.y);
      const distRing = Math.hypot(landmarks[16].x - wrist.x, landmarks[16].y - wrist.y);
      const distPinky = Math.hypot(landmarks[20].x - wrist.x, landmarks[20].y - wrist.y);

      // 手指關節屈伸比：比對指尖(TIP)與近端關節(PIP: 6, 10, 14, 18)相對於手腕的距離
      const curlIndex = Math.hypot(landmarks[8].x - wrist.x, landmarks[8].y - wrist.y) < Math.hypot(landmarks[6].x - wrist.x, landmarks[6].y - wrist.y);
      const curlMiddle = Math.hypot(landmarks[12].x - wrist.x, landmarks[12].y - wrist.y) < Math.hypot(landmarks[10].x - wrist.x, landmarks[10].y - wrist.y);
      const curlRing = Math.hypot(landmarks[16].x - wrist.x, landmarks[16].y - wrist.y) < Math.hypot(landmarks[14].x - wrist.x, landmarks[14].y - wrist.y);
      const curlPinky = Math.hypot(landmarks[20].x - wrist.x, landmarks[20].y - wrist.y) < Math.hypot(landmarks[18].x - wrist.x, landmarks[18].y - wrist.y);

      // 握拳：多數手指彎曲進入掌心；張手：手指完全展開
      const isFist = (curlIndex && curlMiddle && curlRing) || (distIndex < 0.28 && distMiddle < 0.28 && distRing < 0.28);
      const isOpenHand = (distIndex > 0.30 && distMiddle > 0.30 && !curlMiddle && !curlRing);

      let currentGesture = 'open'; // 預設張開手移動
      if (isFist) {
        currentGesture = 'fist';   // 握拳抓取
      }
      state.gesture = currentGesture;

      const glowColor = isLeft ? '#00e5ff' : '#ff4081';

      // 繪製手勢光標與特效
      this.handsCtx.save();

      // 若目前手上正握著吸附的色球，在掌心游標處繪製發光的魔法大色球！
      if (state.grabbedColor) {
        const col = COLOR_PALETTE[state.grabbedColor];
        this.handsCtx.beginPath();
        this.handsCtx.arc(screenX, screenY, 44, 0, Math.PI * 2);
        this.handsCtx.fillStyle = col.hex;
        this.handsCtx.shadowColor = col.hex;
        this.handsCtx.shadowBlur = 35;
        this.handsCtx.fill();
        this.handsCtx.lineWidth = 4;
        this.handsCtx.strokeStyle = '#ffffff';
        this.handsCtx.stroke();

        // 拖曳顏色名稱
        this.handsCtx.fillStyle = (col.name === 'Yellow' || col.name === 'White') ? '#000' : '#fff';
        this.handsCtx.font = 'bold 18px Fredoka';
        this.handsCtx.textAlign = 'center';
        this.handsCtx.textBaseline = 'middle';
        this.handsCtx.fillText(col.name, screenX, screenY);
      } else {
        // 未抓取時：繪製掌心十字準星光環
        this.handsCtx.beginPath();
        const pointerRadius = (currentGesture === 'fist') ? 22 : 28;
        this.handsCtx.arc(screenX, screenY, pointerRadius, 0, Math.PI * 2);
        this.handsCtx.fillStyle = (currentGesture === 'fist') ? '#00e676' : glowColor;
        this.handsCtx.shadowColor = glowColor;
        this.handsCtx.shadowBlur = 25;
        this.handsCtx.fill();
        this.handsCtx.lineWidth = 3.5;
        this.handsCtx.strokeStyle = '#ffffff';
        this.handsCtx.stroke();

        // 掌心十字微標
        this.handsCtx.beginPath();
        this.handsCtx.arc(screenX, screenY, 4, 0, Math.PI * 2);
        this.handsCtx.fillStyle = '#ffffff';
        this.handsCtx.fill();
      }

      // 指針提示文字標籤
      this.handsCtx.fillStyle = '#ffffff';
      this.handsCtx.textAlign = 'center';
      this.handsCtx.font = 'bold 15px Fredoka';
      let tagText = `✋ P${playerNum} Aiming`;
      if (state.grabbedColor) {
        tagText = `✊ P${playerNum} Drag to Pot!`;
      } else if (currentGesture === 'fist') {
        tagText = `✊ P${playerNum} Grab!`;
      }
      this.handsCtx.fillText(tagText, screenX, screenY + 52);

      this.handsCtx.restore();

      // 處理碰撞與拖曳交互
      this.handleGestureInteraction(playerNum, screenX, screenY, currentGesture, state);
    }
  }

  handleGestureInteraction(playerNum, x, y, gesture, state) {
    const buttons = document.querySelectorAll(playerNum === 1 ? '.p1-btn' : '.p2-btn');
    let hoveredBtn = null;

    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      // 圓形中心距離判定（按鈕為 105px 圓形，中心半徑距離約 65px 以內算命中）
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - btnCenterX, y - btnCenterY);

      if (dist < 65) {
        btn.classList.add('hovered');
        hoveredBtn = btn;
      } else {
        btn.classList.remove('hovered');
      }
    });

    // 1. 如果手上還沒抓顏色：張開手瞄準移到色球上方
    if (!state.grabbedColor) {
      if (hoveredBtn) {
        // 當孩子手勢「握拳 (fist)」時，即刻 100% 靈敏吸附抓取色球！
        if (gesture === 'fist') {
          const colorKey = hoveredBtn.dataset.color;
          state.grabbedColor = colorKey;
          hoveredBtn.classList.add('grabbing');
          this.audio.playPlop();
          this.speakWithSubtitles(COLOR_PALETTE[colorKey].voiceKey);
        }
      }
    } else {
      // 2. 如果手上已經握拳抓取了色球：
      // 檢查是否拖曳到了中央目標放置區（中間大坩堝區域、或上方的題目公式欄位、或中央 35% ~ 65% 螢幕寬度）
      const missionCard = document.getElementById('mission-card');
      const missionRect = missionCard ? missionCard.getBoundingClientRect() : null;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // 目標放置區：中間坩堝區域 (螢幕寬度 30% ~ 70%) 或上方題目欄
      const isOverCenterPot = (x > screenW * 0.30 && x < screenW * 0.70 && y > screenH * 0.25 && y < screenH * 0.90);
      const isOverFormula = missionRect && (x >= missionRect.left - 30 && x <= missionRect.right + 30 && y >= missionRect.top - 30 && y <= missionRect.bottom + 50);

      // 當拖曳移到中央坩堝或題目欄位時，成功將顏色投入坩堝！
      if (isOverCenterPot || isOverFormula) {
        const colorKey = state.grabbedColor;
        state.grabbedColor = null;
        document.querySelectorAll('.coop-btn').forEach(b => b.classList.remove('grabbing'));
        this.lockCoopChoice(playerNum, colorKey);
      } else if (gesture === 'open') {
        // 關鍵取消機制：若在尚未移到中央坩堝前「張開手掌放開」，代表選錯取消！
        state.grabbedColor = null;
        document.querySelectorAll('.coop-btn').forEach(b => b.classList.remove('grabbing'));
        this.audio.playPlop();
      }
    }
  }

  // ==========================================
  // 7. Leaderboard & Hall of Fame (LocalStorage)
  // ==========================================
  getLeaderboardData(mode) {
    const key = `color_magic_ranks_${mode}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [
      { name: mode === 'solo' ? 'Super Alex' : 'Team Dragon', score: 600, time: '01:15', date: '2026-09-11' },
      { name: mode === 'solo' ? 'Magic Emma' : 'Star Pals', score: 500, time: '01:32', date: '2026-09-11' },
      { name: mode === 'solo' ? 'Leo Star' : 'Twin Wizards', score: 400, time: '01:50', date: '2026-09-11' }
    ];
  }

  saveLeaderboardScore() {
    const nameInput = document.getElementById('player-name-input');
    const name = nameInput.value.trim() || (this.mode === 'solo' ? 'Player 1' : 'Magic Duo');

    const finalMins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
    const finalSecs = String(this.elapsedSeconds % 60).padStart(2, '0');
    const timeStr = `${finalMins}:${finalSecs}`;

    const data = this.getLeaderboardData(this.mode);
    data.push({
      name: name,
      score: this.score,
      time: timeStr,
      seconds: this.elapsedSeconds,
      date: new Date().toISOString().split('T')[0]
    });

    // Sort by highest score, then fastest time
    data.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.seconds || 999) - (b.seconds || 999);
    });

    localStorage.setItem(`color_magic_ranks_${this.mode}`, JSON.stringify(data.slice(0, 10)));

    nameInput.disabled = true;
    document.getElementById('btn-save-score').innerText = '✓ Saved!';
    this.audio.playVictory();
  }

  showLeaderboard(defaultMode = 'solo') {
    this.rankOverlay.classList.add('active');
    if (defaultMode === 'coop') {
      document.getElementById('tab-rank-coop').classList.add('active');
      document.getElementById('tab-rank-solo').classList.remove('active');
      this.renderRankTable('coop');
    } else {
      document.getElementById('tab-rank-solo').classList.add('active');
      document.getElementById('tab-rank-coop').classList.remove('active');
      this.renderRankTable('solo');
    }
  }

  renderRankTable(mode) {
    const tbody = document.getElementById('rank-table-body');
    tbody.innerHTML = '';
    const ranks = this.getLeaderboardData(mode);

    ranks.forEach((entry, idx) => {
      const tr = document.createElement('tr');
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
      tr.innerHTML = `
        <td>${medal}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${entry.time}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new ColorMagicGame();
});
