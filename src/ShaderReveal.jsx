import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Original two-image fluid reveal. This is not the licensed React Bits source.
const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const common = `precision highp float; varying vec2 vUv;`;
const advection = `${common}
  uniform sampler2D source, velocity;
  uniform float dt, decay;
  void main(){vec2 flow=texture2D(velocity,vUv).xy;
    gl_FragColor=texture2D(source,clamp(vUv-flow*dt,vec2(.001),vec2(.999)))*decay;}`;
const splat = `${common}
  uniform sampler2D source;
  uniform vec2 point, impulse;
  uniform float aspect, radius, amount;
  uniform bool dye;
  void main(){vec2 p=vUv-point;p.x*=aspect;
    float g=exp(-dot(p,p)/(radius*radius));
    vec4 old=texture2D(source,vUv);
    if(dye){gl_FragColor=vec4(min(1.,old.r+g*amount),0.,0.,1.);}
    else{vec2 swirl=vec2(-p.y,p.x)*g*amount*.18;
      gl_FragColor=vec4(clamp(old.xy+impulse*g+swirl,vec2(-1.5),vec2(1.5)),0.,1.);}}`;
const divergence = `${common}
  uniform sampler2D velocity;uniform vec2 texel;
  void main(){float l=texture2D(velocity,vUv-vec2(texel.x,0)).x;
    float r=texture2D(velocity,vUv+vec2(texel.x,0)).x;
    float b=texture2D(velocity,vUv-vec2(0,texel.y)).y;
    float t=texture2D(velocity,vUv+vec2(0,texel.y)).y;
    gl_FragColor=vec4(.5*(r-l+t-b),0.,0.,1.);}`;
const pressure = `${common}
  uniform sampler2D pressureField, divergenceField;uniform vec2 texel;
  void main(){float l=texture2D(pressureField,vUv-vec2(texel.x,0)).r;
    float r=texture2D(pressureField,vUv+vec2(texel.x,0)).r;
    float b=texture2D(pressureField,vUv-vec2(0,texel.y)).r;
    float t=texture2D(pressureField,vUv+vec2(0,texel.y)).r;
    gl_FragColor=vec4((l+r+b+t-texture2D(divergenceField,vUv).r)*.25,0.,0.,1.);}`;
const gradient = `${common}
  uniform sampler2D pressureField, velocity;uniform vec2 texel;
  void main(){float l=texture2D(pressureField,vUv-vec2(texel.x,0)).r;
    float r=texture2D(pressureField,vUv+vec2(texel.x,0)).r;
    float b=texture2D(pressureField,vUv-vec2(0,texel.y)).r;
    float t=texture2D(pressureField,vUv+vec2(0,texel.y)).r;
    gl_FragColor=vec4(texture2D(velocity,vUv).xy-.5*vec2(r-l,t-b),0.,1.);}`;
const display = `${common}
  uniform sampler2D frontImage, backImage, dyeField, velocity;
  uniform vec2 viewport, frontSize, backSize;
  uniform float fullReveal, scrollReveal, time;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float melt(vec2 uv){
    if(scrollReveal<=0.)return 0.;
    if(scrollReveal>=.999)return 1.;
    vec2 p=(uv-vec2(.55,.55))*vec2(min(viewport.x/viewport.y,1.8),1.);
    // A reversible, scroll-driven liquid edge; no automatic reveal on load.
    float n=noise(uv*6.+vec2(0,scrollReveal*1.4))*.7+noise(uv*17.-scrollReveal)*.3;
    float field=length(p)*.72+n*.28;
    return smoothstep(field-.065,field+.065,scrollReveal*1.4-.16);
  }
  vec2 cover(vec2 uv, vec2 size){
    float a=viewport.x/viewport.y, b=size.x/size.y;
    vec2 scale=vec2(min(1.,a/b),min(1.,b/a));
    return uv*scale+(1.-scale)*vec2(.55,.5);
  }
  vec4 front(vec2 uv){
    float a=viewport.x/viewport.y, b=frontSize.x/frontSize.y;
    vec2 scale=vec2(min(1.,b/a),min(1.,a/b));
    vec2 p=(uv-.5)/scale+.5;
    return texture2D(frontImage,clamp(p,vec2(.001),vec2(.999)));
  }
  void main(){
    float density=texture2D(dyeField,vUv).r;
    float ripple=sin(vUv.x*38.+time*1.4)*cos(vUv.y*31.-time)*.018;
    float mask=smoothstep(.06,.48,density+ripple*min(density*4.,1.));
    mask=max(mask,melt(vUv));
    mask=mix(mask,1.,fullReveal);
    float edge=mask*(1.-mask);
    vec2 flow=texture2D(velocity,vUv).xy;
    vec2 displacement=flow*.15*edge+vec2(sin(vUv.y*26.+time),cos(vUv.x*24.-time))*.009*edge;
    vec4 base=front(vUv+displacement);
    vec4 photo=texture2D(backImage,cover(vUv-displacement,backSize));
    gl_FragColor=vec4(mix(base.rgb,photo.rgb,mask),1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

export default function ShaderReveal({
  frontImage,
  backImage,
  backAlt = "Amrit smiling",
  revealPhoto = false,
  scrollReveal = 0,
  reducedMotion = false,
  onToggle,
}) {
  const host = useRef(null);
  const canvasHost = useRef(null);
  const wakeRef = useRef(null);
  const fullRef = useRef(revealPhoto);
  const scrollRef = useRef(scrollReveal);
  const [ready, setReady] = useState(false);
  fullRef.current = revealPhoto;
  scrollRef.current = scrollReveal;
  useEffect(() => {
    wakeRef.current?.();
  }, [revealPhoto, scrollReveal]);

  useEffect(() => {
    const container = host.current,
      mount = canvasHost.current;
    setReady(false);
    let renderer,
      frame,
      disposed = false,
      visible = true,
      loaded = false;
    let lastTime = 0,
      lastInput = -Infinity,
      full = fullRef.current ? 1 : 0;
    let pending = [],
      pointerInside = false;
    let pointer = new THREE.Vector2(0.5, 0.5),
      lastPoint = null;
    const materials = [],
      textures = [],
      targets = [];
    const scene = new THREE.Scene(),
      camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry);
    scene.add(mesh);

    if (reducedMotion) {
      geometry.dispose();
      return;
    }
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: "low-power",
      });
      if (!renderer.extensions.has("EXT_color_buffer_float")) {
        renderer.dispose();
        geometry.dispose();
        return;
      }
    } catch {
      geometry.dispose();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const makeMaterial = (fragmentShader, values) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader,
        uniforms: Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, { value: v }]),
        ),
        depthTest: false,
        depthWrite: false,
      });
      materials.push(material);
      return material;
    };
    const makeTarget = (w, h) => {
      const target = new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      });
      targets.push(target);
      return target;
    };
    const makePair = (w, h) => ({
      read: makeTarget(w, h),
      write: makeTarget(w, h),
      swap() {
        [this.read, this.write] = [this.write, this.read];
      },
    });
    // Fixed small simulation grid; the final two-image composite uses full canvas resolution.
    const aspect = container.clientWidth / container.clientHeight;
    const simWidth = aspect >= 1 ? 256 : Math.max(96, Math.round(256 * aspect));
    const simHeight =
      aspect >= 1 ? Math.max(96, Math.round(256 / aspect)) : 256;
    const velocity = makePair(simWidth, simHeight),
      dye = makePair(simWidth, simHeight),
      pressureField = makePair(simWidth, simHeight);
    const divergenceField = makeTarget(simWidth, simHeight),
      texel = new THREE.Vector2(1 / simWidth, 1 / simHeight);
    const advect = makeMaterial(advection, {
      source: null,
      velocity: null,
      dt: 0.016,
      decay: 1,
    });
    const inject = makeMaterial(splat, {
      source: null,
      point: pointer,
      impulse: new THREE.Vector2(),
      aspect,
      radius: 0.12,
      amount: 1,
      dye: false,
    });
    const diverge = makeMaterial(divergence, { velocity: null, texel });
    const solve = makeMaterial(pressure, {
      pressureField: null,
      divergenceField: divergenceField.texture,
      texel,
    });
    const project = makeMaterial(gradient, {
      pressureField: null,
      velocity: null,
      texel,
    });
    const composite = makeMaterial(display, {
      frontImage: null,
      backImage: null,
      dyeField: dye.read.texture,
      velocity: velocity.read.texture,
      viewport: new THREE.Vector2(
        container.clientWidth,
        container.clientHeight,
      ),
      frontSize: new THREE.Vector2(1, 1),
      backSize: new THREE.Vector2(1, 1),
      fullReveal: full,
      scrollReveal: scrollRef.current,
      time: 0,
    });
    const pass = (material, target) => {
      mesh.material = material;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
    };
    const clearSimulation = () => {
      for (const target of targets) {
        renderer.setRenderTarget(target);
        renderer.clear();
      }
      renderer.setRenderTarget(null);
    };
    clearSimulation();

    const simulate = (dt, now) => {
      advect.uniforms.source.value = velocity.read.texture;
      advect.uniforms.velocity.value = velocity.read.texture;
      advect.uniforms.dt.value = dt;
      advect.uniforms.decay.value = Math.exp(-dt * 2.5);
      pass(advect, velocity.write);
      velocity.swap();
      // Keep a small pool open under a stationary hovered cursor, too.
      if (pointerInside && pending.length === 0 && now - lastInput < 900) {
        pending.push({ point: pointer.clone(), dx: 0, dy: 0 });
      }
      for (const input of pending.slice(-12)) {
        inject.uniforms.point.value = input.point;
        inject.uniforms.radius.value = Math.min(
          0.16,
          160 / container.clientHeight,
        );
        inject.uniforms.source.value = velocity.read.texture;
        inject.uniforms.dye.value = false;
        inject.uniforms.amount.value = 1;
        inject.uniforms.impulse.value.set(input.dx * 8, input.dy * 8);
        pass(inject, velocity.write);
        velocity.swap();
        inject.uniforms.source.value = dye.read.texture;
        inject.uniforms.dye.value = true;
        inject.uniforms.amount.value = 0.62;
        pass(inject, dye.write);
        dye.swap();
      }
      pending = [];
      diverge.uniforms.velocity.value = velocity.read.texture;
      pass(diverge, divergenceField);
      for (let i = 0; i < 10; i++) {
        solve.uniforms.pressureField.value = pressureField.read.texture;
        pass(solve, pressureField.write);
        pressureField.swap();
      }
      project.uniforms.pressureField.value = pressureField.read.texture;
      project.uniforms.velocity.value = velocity.read.texture;
      pass(project, velocity.write);
      velocity.swap();
      advect.uniforms.source.value = dye.read.texture;
      advect.uniforms.velocity.value = velocity.read.texture;
      advect.uniforms.decay.value = Math.exp(-dt * 1.35);
      pass(advect, dye.write);
      dye.swap();
    };
    const render = (now) => {
      frame = null;
      if (disposed || !loaded || !visible || document.hidden) return;
      const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const target = fullRef.current ? 1 : 0;
      full += (target - full) * Math.min(1, dt * 7);
      const active = now - lastInput < 6500;
      if (active) simulate(dt, now);
      else clearSimulation();
      composite.uniforms.dyeField.value = dye.read.texture;
      composite.uniforms.velocity.value = velocity.read.texture;
      composite.uniforms.fullReveal.value = full;
      composite.uniforms.scrollReveal.value = scrollRef.current;
      composite.uniforms.time.value = now / 1000;
      pass(composite, null);
      if (active || Math.abs(target - full) > 0.001)
        frame = requestAnimationFrame(render);
    };
    const wake = () => {
      if (!frame && loaded && !disposed && visible && !document.hidden) {
        lastTime = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    wakeRef.current = wake;
    const resize = new ResizeObserver(() => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      composite.uniforms.viewport.value.set(
        container.clientWidth,
        container.clientHeight,
      );
      inject.uniforms.aspect.value =
        container.clientWidth / container.clientHeight;
      wake();
    });
    resize.observe(container);
    renderer.setSize(container.clientWidth, container.clientHeight);
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    const load = (url, key, sizeKey) =>
      loader.load(
        url,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          textures.push(texture);
          composite.uniforms[key].value = texture;
          composite.uniforms[sizeKey].value.set(
            texture.image.width,
            texture.image.height,
          );
          if (++loadedCount === 2) {
            loaded = true;
            pass(composite, null);
            setReady(true);
            wake();
          }
        },
        undefined,
        () => {
          if (!disposed) setReady(false);
        },
      );
    load(frontImage, "frontImage", "frontSize");
    load(backImage, "backImage", "backSize");
    const move = (e) => {
      const r = container.getBoundingClientRect();
      pointer = new THREE.Vector2(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      );
      const delta = lastPoint
        ? pointer.clone().sub(lastPoint)
        : new THREE.Vector2();
      pending.push({
        point: pointer.clone(),
        dx: Math.max(-0.1, Math.min(0.1, delta.x)),
        dy: Math.max(-0.1, Math.min(0.1, delta.y)),
      });
      lastPoint = pointer.clone();
      pointerInside = true;
      lastInput = performance.now();
      wake();
    };
    const leave = () => {
      pointerInside = false;
      lastPoint = null;
    };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerenter", move);
    container.addEventListener("pointerdown", move);
    container.addEventListener("pointerleave", leave);
    container.addEventListener("pointerup", leave);
    container.addEventListener("pointercancel", leave);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = null;
      } else wake();
    });
    observer.observe(container);
    document.addEventListener("visibilitychange", wake);
    const lost = (e) => {
      e.preventDefault();
      setReady(false);
      loaded = false;
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      wakeRef.current = null;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerenter", move);
      container.removeEventListener("pointerdown", move);
      container.removeEventListener("pointerleave", leave);
      container.removeEventListener("pointerup", leave);
      container.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", wake);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      targets.forEach((t) => t.dispose());
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [frontImage, backImage, reducedMotion]);

  const touchStart = useRef(null);
  return (
    <div
      ref={host}
      className={`image-reveal ${ready && !reducedMotion ? "is-ready" : ""} ${revealPhoto ? "show-photo" : ""} ${scrollReveal > 0 ? "is-scrolling" : ""}`}
      style={{ "--scroll-reveal": scrollReveal }}
      data-ready={ready && !reducedMotion}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--cursor-x",
          `${e.clientX - r.left}px`,
        );
        e.currentTarget.style.setProperty(
          "--cursor-y",
          `${e.clientY - r.top}px`,
        );
        if (
          touchStart.current &&
          Math.hypot(
            e.clientX - touchStart.current.x,
            e.clientY - touchStart.current.y,
          ) > 12
        )
          touchStart.current.dragged = true;
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") {
          touchStart.current = { x: e.clientX, y: e.clientY, dragged: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      }}
      onPointerUp={(e) => {
        if (
          e.pointerType !== "mouse" &&
          touchStart.current &&
          !touchStart.current.dragged
        )
          onToggle?.();
        touchStart.current = null;
      }}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
    >
      <img
        className="reveal-front"
        src={frontImage}
        alt="Hello Kitty with a pink bow, filling the opening banner"
        fetchPriority="high"
        draggable="false"
      />
      <img
        className="reveal-back"
        src={backImage}
        alt={backAlt}
        fetchPriority="high"
        draggable="false"
      />
      <div className="reveal-canvas" ref={canvasHost} aria-hidden="true" />
    </div>
  );
}
