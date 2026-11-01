"use client";

import { useEffect, useRef } from "react";

const vertex = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// A ringing phone drawn as water: posterised contour bands, so the field stays
// in flat tones of navy instead of turning into a soft gradient.
const fragment = `
precision mediump float;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 q = uv - uPointer * vec2(0.18, -0.12);
  q.y *= 1.9;
  float d = length(q);
  float wobble = noise(uv * 1.7 + uTime * 0.05) * 1.6;

  // Ring cadence: two pulses, then a rest, like a phone.
  float t = mod(uTime, 4.0);
  float pulse = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(1.6, 2.6, t));

  float wave = sin(d * 15.0 - uTime * 1.5 + wobble) * 0.5 + 0.5;
  float reach = smoothstep(1.5, 0.28, d) * smoothstep(0.1, 0.5, d);
  float level = wave * reach * (0.55 + 0.45 * pulse);

  float band = floor(level * 4.0) / 4.0;
  float edge = fract(level * 4.0);
  band += smoothstep(0.96, 1.0, edge) * 0.25;

  vec3 ground = vec3(0.020, 0.027, 0.039);
  vec3 navy = vec3(0.122, 0.169, 0.302);
  gl_FragColor = vec4(mix(ground, navy, band * 0.9), 1.0);
}
`;

export function Ripple() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    const resize = () => {
      const scale = Math.min(devicePixelRatio, matchMedia("(hover: none)").matches ? 1 : 1.5);
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    addEventListener("resize", resize);

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    };
    addEventListener("pointermove", onMove);

    let frame = 0;
    let visible = true;
    const draw = (time: number) => {
      frame = 0;
      if (!visible) return;
      eased.x += (pointer.x - eased.x) * 0.06;
      eased.y += (pointer.y - eased.y) * 0.06;
      gl.uniform1f(uTime, time / 1000);
      gl.uniform2f(uPointer, eased.x, eased.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    seen.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="ripple" aria-hidden="true" />;
}
