import { useEffect, useRef } from "react";
import * as THREE from "three";

// Original shader: the requested @reactbits-starter registry is not registered
// with shadcn. Keep a real image underneath for unsupported WebGL and reduced motion.
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  void main() {
    float n=noise(vUv*7.0+uTime*.12)*.65+noise(vUv*19.0)*.35;
    float threshold=length((vUv-vec2(.5))*vec2(.9,1.0))*.7+n*.35;
    float mask=smoothstep(threshold-.07,threshold+.07,uProgress*1.3-.12);
    float edge=1.0-abs(mask*2.0-1.0);
    vec2 uv=vUv+(vUv-uPointer)*edge*.16;
    vec4 photo=texture2D(uTexture,clamp(uv,0.0,1.0));
    vec3 paper=mix(vec3(.95,.79,.84),vec3(1.0,.92,.86),n);
    vec3 color=mix(paper,photo.rgb,mask)+vec3(.1,.055,.04)*edge;
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
export default function ShaderReveal({ src }) {
  const host = useRef();
  useEffect(() => {
    const container = host.current;
    let renderer,
      texture,
      frame,
      disposed = false,
      loaded = false,
      visible = true;
    let progress = 0,
      previous = 0;
    const start = performance.now(),
      pointer = new THREE.Vector2(0.5, 0.5),
      scene = new THREE.Scene(),
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPointer: { value: pointer },
      },
      vertexShader:
        "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}",
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    const render = (now) => {
      frame = null;
      if (disposed || !loaded || !visible || document.hidden) return;
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      progress += (1 - progress) * Math.min(1, delta * 2.8);
      material.uniforms.uProgress.value = progress;
      material.uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
      if (1 - progress > 0.001) frame = requestAnimationFrame(render);
    };
    const wake = () => {
      if (!frame && loaded && visible && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    const resize = new ResizeObserver(() => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      wake();
    });
    resize.observe(container);
    new THREE.TextureLoader().load(
      src,
      (t) => {
        if (disposed) {
          t.dispose();
          return;
        }
        texture = t;
        texture.colorSpace = THREE.SRGBColorSpace;
        material.uniforms.uTexture.value = texture;
        loaded = true;
        container.style.opacity = "1";
        wake();
      },
      undefined,
      () => {
        container.style.opacity = "0";
      },
    );
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      pointer.set(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      );
    };
    const replay = () => {
      progress = 0.04;
      wake();
    };
    container.addEventListener("pointerenter", replay);
    container.addEventListener("pointermove", onMove);
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    observer.observe(container);
    document.addEventListener("visibilitychange", wake);
    const lost = (e) => {
      e.preventDefault();
      container.style.opacity = "0";
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      container.removeEventListener("pointerenter", replay);
      container.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", wake);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src]);
  return <div className="shader-reveal" ref={host} aria-hidden="true" />;
}
