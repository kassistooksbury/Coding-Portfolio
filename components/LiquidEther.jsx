'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
  // Optional: force a fixed renderer/container pixel size so layout changes won't affect it
  fixedWidthPx = null,
  fixedHeightPx = null,
  // If true, the canvas will accept pointer events during interaction; default false prevents canvas from intercepting scroll/pan
  allowPointerInteraction = false,
  // If provided, called when WebGL renderer/context cannot be created.
  onWebglError = null,
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const rafRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef(null);
  // debounce handle for pausing/resuming rendering during scroll
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops) {
      let arr;
      if (Array.isArray(stops) && stops.length > 0) {
        if (stops.length === 1) {
          arr = [stops[0], stops[0]];
        } else {
          arr = stops;
        }
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0); // always transparent

    class CommonClass {
      constructor() {
        this.width = 0;
        this.height = 0;
        this.aspect = 1;
        this.pixelRatio = 1;
        this.isMobile = false;
        this.breakpoint = 768;
        this.fboWidth = null;
        this.fboHeight = null;
        this.time = 0;
        this.delta = 0;
        this.container = null;
        this.renderer = null;
        this.clock = null;
        this._fixed = (typeof fixedWidthPx === 'number' && typeof fixedHeightPx === 'number');
        this._fixedW = fixedWidthPx;
        this._fixedH = fixedHeightPx;
      }
      init(container) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        // If fixed pixel size provided, use that instead of measuring the container
        if (this._fixed) {
          this.width = Math.max(1, Math.floor(this._fixedW));
          this.height = Math.max(1, Math.floor(this._fixedH));
          this.aspect = this.width / this.height;
        } else {
          this.resize();
        }
        // Try to create a real WebGL renderer. If creation fails (e.g. browser/host
        // environment doesn't allow WebGL), fall back to a minimal mock renderer
        // so the component degrades gracefully instead of throwing an exception.
        try {
          this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          this._webglAvailable = true;
          this.renderer.autoClear = false;
          this.renderer.setClearColor(new THREE.Color(0x000000), 0);
          this.renderer.setPixelRatio(this.pixelRatio);
          this.renderer.setSize(this.width, this.height);
        } catch (e) {
          console.warn('WebGL not available, falling back to mock renderer:', e);
          // Notify parent so it can switch to a Canvas2D fallback.
          try {
            if (typeof onWebglError === 'function') onWebglError(e);
          } catch {}

          const fallback = document.createElement('div');
          fallback.style.width = this._fixed ? this.width + 'px' : '100%';
          fallback.style.height = this._fixed ? this.height + 'px' : '100%';
          fallback.style.display = 'block';
          this.renderer = {
            domElement: fallback,
            autoClear: false,
            setPixelRatio: () => {},
            setSize: () => {},
            setClearColor: () => {},
            setRenderTarget: () => {},
            render: () => {},
            dispose: () => {},
          };
          this._webglAvailable = false;
        }
        // If fixed size, set DOM element to fixed pixel dimensions to avoid percentage inheritance
        if (this._fixed) {
          this.renderer.domElement.style.width = this.width + 'px';
          this.renderer.domElement.style.height = this.height + 'px';
        } else {
          this.renderer.domElement.style.width = '100%';
          this.renderer.domElement.style.height = '100%';
        }
        this.renderer.domElement.style.display = 'block';
        // Make the canvas non-blocking for pointer events so underlying UI remains interactive
        this.renderer.domElement.style.pointerEvents = 'none';
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        // If fixed pixel size is set, do not recompute from the DOM - keep fixed values
        if (this._fixed) {
          if (this.renderer) this.renderer.setSize(this._fixedW, this._fixedH, false);
          this.width = this._fixedW;
          this.height = this._fixedH;
          this.aspect = this.width / this.height;
          return;
        }
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      constructor() {
        this.mouseMoved = false;
        this.coords = new THREE.Vector2();
        this.coords_old = new THREE.Vector2();
        this.diff = new THREE.Vector2();
        this.timer = null;
        this.container = null;
        // pending raw client coordinates (defer DOM rect reads to RAF/update)
        this._pending = null;
        // pending takeover raw coords (when auto driver hands off to user)
        this._takeoverPending = null;
        this._onMouseMove = this.onDocumentMouseMove.bind(this);
        this._onTouchStart = this.onDocumentTouchStart.bind(this);
        this._onTouchMove = this.onDocumentTouchMove.bind(this);
        this._onMouseEnter = this.onMouseEnter.bind(this);
        this._onMouseLeave = this.onMouseLeave.bind(this);
        this._onTouchEnd = this.onTouchEnd.bind(this);
        this.isHoverInside = false;
        this.hasUserControl = false;
        this.isAutoActive = false;
        this.autoIntensity = 2.0;
        this.takeoverActive = false;
        this.takeoverStartTime = 0;
        this.takeoverDuration = 0.25;
        this.takeoverFrom = new THREE.Vector2();
        this.takeoverTo = new THREE.Vector2();
        // pointer-events toggle timeout handle
        this._pointerEventsTimeout = null;
        this.onInteract = null;
        this._allowPointer = allowPointerInteraction;
      }
      init(container) {
        this.container = container;
        // Attach pointer events to document so the canvas can be pointer-events:none
        // (the canvas won't block clicks or hovers on page content), but the
        // simulation still receives global pointer input.
        document.addEventListener('mousemove', this._onMouseMove, false);
        // Use passive listeners for touch events to avoid blocking scroll on mobile
        document.addEventListener('touchstart', this._onTouchStart, { passive: true });
        document.addEventListener('touchmove', this._onTouchMove, { passive: true });
        container.addEventListener('mouseenter', this._onMouseEnter, false);
        container.addEventListener('mouseleave', this._onMouseLeave, false);
        // touchend doesn't affect scroll; use passive listener for consistency
        container.addEventListener('touchend', this._onTouchEnd, { passive: true });
      }
      dispose() {
        if (!this.container) return;
        // Remove listeners attached to document and container
        document.removeEventListener('mousemove', this._onMouseMove, false);
        document.removeEventListener('touchstart', this._onTouchStart, { passive: true });
        document.removeEventListener('touchmove', this._onTouchMove, { passive: true });
        // Remove container listeners
        this.container.removeEventListener('mouseenter', this._onMouseEnter, false);
        this.container.removeEventListener('mouseleave', this._onMouseLeave, false);
        this.container.removeEventListener('touchend', this._onTouchEnd, { passive: true });
        if (this._pointerEventsTimeout) {
          clearTimeout(this._pointerEventsTimeout);
          this._pointerEventsTimeout = null;
        }
      }
      setCoords(x, y) {
        if (!this.container) return;
        if (this.timer) clearTimeout(this.timer);
        // Defer DOM reads (getBoundingClientRect) to the RAF-driven update loop
        // by storing raw client coordinates in a pending buffer. This avoids
        // forcing layout on high-frequency mouse/touch events and improves scroll
        // smoothness on mobile.
        this._pending = { x, y };
        this.mouseMoved = true;
        this.timer = setTimeout(() => {
          this.mouseMoved = false;
        }, 100);
      }
      setNormalized(nx, ny) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }
      // Process any pending raw coordinates; called from update() once per frame
      _flushPendingCoords() {
        if (!this._pending || !this.container) return;
        const { x, y } = this._pending;
        this._pending = null;
        const rect = this.container.getBoundingClientRect();
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      }
      onDocumentMouseMove(event) {
        if (this.onInteract) this.onInteract();
        // ensure canvas accepts pointer events while actively interacting
        if (this._allowPointer && Common && Common.renderer && Common.renderer.domElement) {
          Common.renderer.domElement.style.pointerEvents = 'auto';
          if (this._pointerEventsTimeout) {
            clearTimeout(this._pointerEventsTimeout);
            this._pointerEventsTimeout = null;
          }
        }
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          // Defer takeover target normalization to the RAF loop to avoid layout
          // reads during mousemove. Store raw client coords and mark takeover
          // active; update() will compute normalized takeoverTo.
          this.takeoverFrom.copy(this.coords);
          this._takeoverPending = { x: event.clientX, y: event.clientY };
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(event.clientX, event.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          // enable pointer events on touch devices while interacting
          if (this._allowPointer && Common && Common.renderer && Common.renderer.domElement) {
            Common.renderer.domElement.style.pointerEvents = 'auto';
            if (this._pointerEventsTimeout) {
              clearTimeout(this._pointerEventsTimeout);
              this._pointerEventsTimeout = null;
            }
          }
          this.setCoords(t.pageX, t.pageY);
          this.hasUserControl = true;
        }
      }
      onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          this.setCoords(t.pageX, t.pageY);
        }
      }
      onTouchEnd() {
        this.isHoverInside = false;
        // disable pointer events shortly after touch ends so underlying UI is reachable
        if (this._allowPointer && Common && Common.renderer && Common.renderer.domElement) {
          if (this._pointerEventsTimeout) clearTimeout(this._pointerEventsTimeout);
          this._pointerEventsTimeout = setTimeout(() => {
            if (Common && Common.renderer && Common.renderer.domElement) {
              Common.renderer.domElement.style.pointerEvents = 'none';
            }
            this._pointerEventsTimeout = null;
          }, 300);
        }
      }
      onMouseEnter() {
        this.isHoverInside = true;
        // enable canvas pointer events when pointer enters the container
        if (this._allowPointer && Common && Common.renderer && Common.renderer.domElement) {
          if (this._pointerEventsTimeout) {
            clearTimeout(this._pointerEventsTimeout);
            this._pointerEventsTimeout = null;
          }
          Common.renderer.domElement.style.pointerEvents = 'auto';
        }
      }
      onMouseLeave() {
        this.isHoverInside = false;
        // disable canvas pointer events shortly after leaving so clicks pass through
        if (this._allowPointer && Common && Common.renderer && Common.renderer.domElement) {
          if (this._pointerEventsTimeout) clearTimeout(this._pointerEventsTimeout);
          this._pointerEventsTimeout = setTimeout(() => {
            if (Common && Common.renderer && Common.renderer.domElement) {
              Common.renderer.domElement.style.pointerEvents = 'none';
            }
            this._pointerEventsTimeout = null;
          }, 300);
        }
      }
      update() {
        // Flush any pending pointer coords once per frame to avoid layout thrash
        this._flushPendingCoords();

        // If a takeover was initiated from mousemove, compute normalized target now
        if (this.takeoverActive && this._takeoverPending) {
          const { x, y } = this._takeoverPending;
          this._takeoverPending = null;
          if (this.container) {
            const rect = this.container.getBoundingClientRect();
            const nx = (x - rect.left) / rect.width;
            const ny = (y - rect.top) / rect.height;
            this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          }
        }

        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      constructor(mouse, manager, opts) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed; // normalized units/sec
        this.resumeDelay = opts.resumeDelay || 3000; // ms
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.active = false;
        this.current = new THREE.Vector2(0, 0);
        this.target = new THREE.Vector2();
        this.lastTime = performance.now();
        this.activationTime = 0;
        this.margin = 0.2;
        this._tmpDir = new THREE.Vector2(); // reuse temp vector to avoid per-frame alloc
        this.pickNewTarget();
      }
      pickNewTarget() {
        const r = Math.random;
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
      }
      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }
      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }
        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        if (!this.active) return;
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    const face_vert = `
  attribute vec3 position;
  uniform vec2 px;
  uniform vec2 boundarySpace;
  varying vec2 uv;
  precision highp float;
  void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}
`;
    const line_vert = `
  attribute vec3 position;
  uniform vec2 px;
  precision highp float;
  varying vec2 uv;
  void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`;
    const mouse_vert = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;
    const advection_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform bool isBFECC;
    uniform vec2 fboSize;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        vec2 error = spot_new2 - spot_new;
        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
}
`;
    const color_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D palette;
    uniform vec4 bgColor;
    varying vec2 uv;
    void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float lenv = clamp(length(vel), 0.0, 1.0);
    vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
    vec3 outRGB = mix(bgColor.rgb, c, lenv);
    float outA = mix(bgColor.a, 1.0, lenv);
    gl_FragColor = vec4(outRGB, outA);
}
`;
    const divergence_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
    float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    gl_FragColor = vec4(divergence / dt);
}
`;
    const externalForce_frag = `
    precision highp float;
    uniform vec2 force;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0 - min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`;
    const poisson_frag = `
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D divergence;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
    float div = texture2D(divergence, uv).r;
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
}
`;
    const pressure_frag = `
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D velocity;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    float step = 1.0;
    float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
}
`;
    const viscous_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D velocity_new;
    uniform float v;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
    vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    newv /= 4.0 * (1.0 + v * dt);
    gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;

    class ShaderPass {
      constructor(props) {
        this.props = props || {};
        this.uniforms = this.props.material?.uniforms;
        this.scene = null;
        this.camera = null;
        this.material = null;
        this.geometry = null;
        this.plane = null;
      }
      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        if (this.uniforms) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          this.geometry = new THREE.PlaneGeometry(2.0, 2.0);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      }
      update() {
        Common.renderer.setRenderTarget(this.props.output || null);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      constructor(simProps) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: advection_frag,
            uniforms: {
              boundarySpace: { value: simProps.cellScale },
              px: { value: simProps.cellScale },
              fboSize: { value: simProps.fboSize },
              velocity: { value: simProps.src.texture },
              dt: { value: simProps.dt },
              isBFECC: { value: true }
            }
          },
          output: simProps.dst
        });
        this.uniforms = this.props.material.uniforms;
        this.init();
      }
      init() {
        super.init();
        this.createBoundary();
      }
      createBoundary() {
        const boundaryG = new THREE.BufferGeometry();
        const vertices_boundary = new Float32Array([
          -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
        ]);
        boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3));
        const boundaryM = new THREE.RawShaderMaterial({
          vertexShader: line_vert,
          fragmentShader: advection_frag,
          uniforms: this.uniforms
        });
        this.line = new THREE.LineSegments(boundaryG, boundaryM);
        this.scene.add(this.line);
      }
      update({ dt, isBounce, BFECC }) {
        this.uniforms.dt.value = dt;
        this.line.visible = isBounce;
        this.uniforms.isBFECC.value = BFECC;
        super.update();
      }
    }

    class ExternalForce extends ShaderPass {
      constructor(simProps) {
        super({ output: simProps.dst });
        this.init(simProps);
      }
      init(simProps) {
        super.init();
        const mouseG = new THREE.PlaneGeometry(1, 1);
        const mouseM = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert,
          fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            px: { value: simProps.cellScale },
            force: { value: new THREE.Vector2(0.0, 0.0) },
            center: { value: new THREE.Vector2(0.0, 0.0) },
            scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
          }
        });
        this.mouse = new THREE.Mesh(mouseG, mouseM);
        this.scene.add(this.mouse);
      }
      update(props) {
        const forceX = (Mouse.diff.x / 2) * props.mouse_force;
        const forceY = (Mouse.diff.y / 2) * props.mouse_force;
        const cursorSizeX = props.cursor_size * props.cellScale.x;
        const cursorSizeY = props.cursor_size * props.cellScale.y;
        const centerX = Math.min(
          Math.max(Mouse.coords.x, -1 + cursorSizeX + props.cellScale.x * 2),
          1 - cursorSizeX - props.cellScale.x * 2
        );
        const centerY = Math.min(
          Math.max(Mouse.coords.y, -1 + cursorSizeY + props.cellScale.y * 2),
          1 - cursorSizeY - props.cellScale.y * 2
        );
        const uniforms = this.mouse.material.uniforms;
        uniforms.force.value.set(forceX, forceY);
        uniforms.center.value.set(centerX, centerY);
        uniforms.scale.value.set(props.cursor_size, props.cursor_size);
        super.update();
      }
    }

    class Viscous extends ShaderPass {
      constructor(simProps) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: viscous_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              velocity_new: { value: simProps.dst_.texture },
              v: { value: simProps.viscous },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
        this.init();
      }
      update({ viscous, iterations, dt }) {
        let fbo_in, fbo_out;
        this.uniforms.v.value = viscous;
        for (let i = 0; i < iterations; i++) {
          if (i % 2 === 0) {
            fbo_in = this.props.output0;
            fbo_out = this.props.output1;
          } else {
            fbo_in = this.props.output1;
            fbo_out = this.props.output0;
          }
          this.uniforms.velocity_new.value = fbo_in.texture;
          this.props.output = fbo_out;
          this.uniforms.dt.value = dt;
          super.update();
        }
        return fbo_out;
      }
    }

    class Divergence extends ShaderPass {
      constructor(simProps) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: divergence_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
        this.init();
      }
      update({ vel }) {
        this.uniforms.velocity.value = vel.texture;
        super.update();
      }
    }

    class Poisson extends ShaderPass {
      constructor(simProps) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: poisson_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.dst_.texture },
              divergence: { value: simProps.src.texture },
              px: { value: simProps.cellScale }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
        this.init();
      }
      update({ iterations }) {
        let p_in, p_out;
        for (let i = 0; i < iterations; i++) {
          if (i % 2 === 0) {
            p_in = this.props.output0;
            p_out = this.props.output1;
          } else {
            p_in = this.props.output1;
            p_out = this.props.output0;
          }
          this.uniforms.pressure.value = p_in.texture;
          this.props.output = p_out;
          super.update();
        }
        return p_out;
      }
    }

    class Pressure extends ShaderPass {
      constructor(simProps) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: pressure_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.src_p.texture },
              velocity: { value: simProps.src_v.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
        this.init();
      }
      update({ vel, pressure }) {
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
        super.update();
      }
    }

    class Simulation {
      constructor(options) {
        this.options = {
          iterations_poisson: 32,
          iterations_viscous: 32,
          mouse_force: 20,
          resolution: 0.5,
          cursor_size: 100,
          viscous: 30,
          isBounce: false,
          dt: 0.014,
          isViscous: false,
          BFECC: true,
          ...options
        };
        this.fbos = {
          vel_0: null,
          vel_1: null,
          vel_viscous0: null,
          vel_viscous1: null,
          div: null,
          pressure_0: null,
          pressure_1: null
        };
        this.fboSize = new THREE.Vector2();
        this.cellScale = new THREE.Vector2();
        this.boundarySpace = new THREE.Vector2();
        this.init();
      }
      init() {
        // If WebGL isn't available (we fell back to a mock renderer), skip
        // creating float render targets / shader passes which require a real
        // GL context. This prevents runtime errors in environments without
        // WebGL support.
        if (!Common._webglAvailable) {
          console.warn('Simulation initialization skipped: WebGL not available');
          return;
        }
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }
      getFloatType() {
        const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
        return isIOS ? THREE.HalfFloatType : THREE.FloatType;
      }
      createAllFBO() {
        const type = this.getFloatType();
        const opts = {
          type,
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping
        };
        for (let key in this.fbos) {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
        }
      }
      createShaderPass() {
        this.advection = new Advection({
          cellScale: this.cellScale,
          fboSize: this.fboSize,
          dt: this.options.dt,
          src: this.fbos.vel_0,
          dst: this.fbos.vel_1
        });
        this.externalForce = new ExternalForce({
          cellScale: this.cellScale,
          cursor_size: this.options.cursor_size,
          dst: this.fbos.vel_1
        });
        this.viscous = new Viscous({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          viscous: this.options.viscous,
          src: this.fbos.vel_1,
          dst: this.fbos.vel_viscous1,
          dst_: this.fbos.vel_viscous0,
          dt: this.options.dt
        });
        this.divergence = new Divergence({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.vel_viscous0,
          dst: this.fbos.div,
          dt: this.options.dt
        });
        this.poisson = new Poisson({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.div,
          dst: this.fbos.pressure_1,
          dst_: this.fbos.pressure_0
        });
        this.pressure = new Pressure({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src_p: this.fbos.pressure_0,
          src_v: this.fbos.vel_viscous0,
          dst: this.fbos.vel_0,
          dt: this.options.dt
        });
      }
      calcSize() {
        const width = Math.max(1, Math.round(this.options.resolution * Common.width));
        const height = Math.max(1, Math.round(this.options.resolution * Common.height));
        const px_x = 1.0 / width;
        const px_y = 1.0 / height;
        this.cellScale.set(px_x, px_y);
        this.fboSize.set(width, height);
      }
      resize() {
        this.calcSize();
        for (let key in this.fbos) {
          this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
        }
      }
      update() {
        if (this.options.isBounce) {
          this.boundarySpace.set(0, 0);
        } else {
          this.boundarySpace.copy(this.cellScale);
        }
        this.advection.update({
          dt: this.options.dt,
          isBounce: this.options.isBounce,
          BFECC: this.options.BFECC
        });
        this.externalForce.update({
          cursor_size: this.options.cursor_size,
          mouse_force: this.options.mouse_force,
          cellScale: this.cellScale
        });
        let vel = this.fbos.vel_1;
        if (this.options.isViscous) {
          vel = this.viscous.update({
            viscous: this.options.viscous,
            iterations: this.options.iterations_viscous,
            dt: this.options.dt
          });
        }
        this.divergence.update({ vel });
        const pressure = this.poisson.update({
          iterations: this.options.iterations_poisson
        });
        this.pressure.update({ vel, pressure });
      }
    }

    class Output {
      constructor() {
        this.init();
      }
      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        // If WebGL isn't available, avoid creating the simulation and shader
        // materials that require a GL context. The output will be a no-op.
        if (!Common._webglAvailable) {
          this.simulation = null;
          this.output = null;
          return;
        }
        this.simulation = new Simulation();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 }
            }
          })
        );
        this.scene.add(this.output);
      }
      addScene(mesh) {
        this.scene.add(mesh);
      }
      resize() {
        if (this.simulation && typeof this.simulation.resize === 'function') this.simulation.resize();
      }
      render() {
        if (!Common._webglAvailable) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
      update() {
        if (this.simulation && typeof this.simulation.update === 'function') this.simulation.update();
        this.render();
      }
    }

    class WebGLManager {
      constructor(props) {
        this.props = props;
        Common.init(props.$wrapper);
        // Ensure canvas starts with pointer-events none so it doesn't block scrolling
        if (Common && Common.renderer && Common.renderer.domElement) {
          Common.renderer.domElement.style.pointerEvents = 'none';
        }
        Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity;
        Mouse.takeoverDuration = props.takeoverDuration;
        this.lastUserInteraction = performance.now();
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          if (this.autoDriver) this.autoDriver.forceStop();
        };
        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration
        });
        this.init();
        this._loop = this.loop.bind(this);
        this._resize = this.resize.bind(this);
        window.addEventListener('resize', this._resize);
        this._onVisibility = () => {
          const hidden = document.hidden;
          if (hidden) {
            this.pause();
          } else if (isVisibleRef.current) {
            this.start();
          }
        };
        document.addEventListener('visibilitychange', this._onVisibility);
        this.running = false;
        // throttling state: 0 means uncapped (use rAF), >0 is target FPS when throttled
        this.targetFPS = 0;
        this._lastRenderTime = 0;
      }
      init() {
        this.props.$wrapper.prepend(Common.renderer.domElement);
        this.output = new Output();
      }
      resize() {
        Common.resize();
        this.output.resize();
      }
      render() {
        // If WebGL isn't available (mock renderer), do nothing.
        if (!Common._webglAvailable) return;
        if (this.autoDriver) this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
      }
      loop() {
        if (!this.running) return; // safety
        const now = performance.now();
        if (this.targetFPS > 0) {
          const interval = 1000 / this.targetFPS;
          if (now - this._lastRenderTime >= interval) {
            this.render();
            this._lastRenderTime = now;
          }
        } else {
          this.render();
          this._lastRenderTime = now;
        }
        rafRef.current = requestAnimationFrame(this._loop);
      }
      // Public API to set a target FPS (0 = uncapped)
      setThrottle(fps) {
        this.targetFPS = Math.max(0, Math.floor(fps || 0));
        // reset last render time so the next frame renders immediately
        this._lastRenderTime = performance.now();
      }
      start() {
        if (this.running) return;
        this.running = true;
        this._loop();
      }
      pause() {
        this.running = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
      dispose() {
        try {
          window.removeEventListener('resize', this._resize);
          document.removeEventListener('visibilitychange', this._onVisibility);
          Mouse.dispose();
          if (Common.renderer) {
            const canvas = Common.renderer.domElement;
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            Common.renderer.dispose();
          }
        } catch (e) {
          void 0;
        }
      }
    }

    const container = mountRef.current;
    // Do not force overflow/position on the mount container; this can accidentally
    // prevent document scrolling depending on where the component is mounted.
    // The parent (BackgroundEffects) already constrains sizing/positioning.
    // container.style.position = container.style.position || 'relative';
    // container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration,
    });

    // expose webgl manager for external control and cleanup
    webglRef.current = webgl;

    // Throttle rendering during scroll/wheel to avoid occasional scroll "lock"/jank.
    // Keep this extremely lightweight; overly-aggressive listeners (scroll/touchmove) can fire a lot.
    const SCROLL_THROTTLE_FPS = 18;
    const SCROLL_IDLE_MS = 100;
    let scrollRafPending = false;

    const onScroll = () => {
      if (scrollRafPending) return;
      scrollRafPending = true;
      requestAnimationFrame(() => {
        scrollRafPending = false;
        const mgr = webglRef.current;
        if (!mgr || typeof mgr.setThrottle !== 'function') return;
        mgr.setThrottle(SCROLL_THROTTLE_FPS);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          const mgr2 = webglRef.current;
          if (mgr2 && typeof mgr2.setThrottle === 'function') mgr2.setThrottle(0);
          scrollTimeoutRef.current = null;
        }, SCROLL_IDLE_MS);
      });
    };

    // Use passive listeners so we never block scroll.
    // Prefer wheel (trackpad/mouse) and avoid scroll/touchmove, which can be extremely chatty.
    window.addEventListener('wheel', onScroll, { passive: true });

    // Apply props to the simulation and start rendering
    if (typeof applyOptionsFromProps === 'function') applyOptionsFromProps();

    // Start the RAF loop so the background renders continuously
    webgl.start();

    return () => {
      // Disconnect observers
      if (resizeObserverRef.current) {
        try { resizeObserverRef.current.disconnect(); } catch (e) { /* ignore */ }
        resizeObserverRef.current = null;
      }
      if (intersectionObserverRef.current) {
        try { intersectionObserverRef.current.disconnect(); } catch (e) { /* ignore */ }
        intersectionObserverRef.current = null;
      }

      // Cancel RAF loop
      if (rafRef.current) {
        try { cancelAnimationFrame(rafRef.current); } catch (e) { /* ignore */ }
        rafRef.current = null;
      }

      // Clear scroll debounce timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }

      // Dispose webgl manager
      if (webglRef.current && webglRef.current.dispose) {
        try { webglRef.current.dispose(); } catch (e) { /* ignore */ }
      }
      webglRef.current = null;

      // Remove scroll throttle listeners
      try {
        window.removeEventListener('wheel', onScroll);
      } catch {}
    };
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    colors,
    style,
    className,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration,
    fixedWidthPx,
    fixedHeightPx,
    allowPointerInteraction,
    onWebglError,
  ]);

  return (
    <div
      ref={mountRef}
      className={`liquid-ether-container ${className}`}
      style={{
        // if fixed pixels requested, force the mount element to that size so getBoundingClientRect is stable
        ...(fixedWidthPx && fixedHeightPx ? { width: fixedWidthPx + 'px', height: fixedHeightPx + 'px' } : { width: '100%', height: '100%' }),
        ...style
      }}
    />
  );
}
