/* ================================================================
   THREE-BG.JS — Animated Topographical Wave Background
   Midnight Tech Portfolio | Mayank
   ================================================================ */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Background disabled.');
    return;
  }

  var canvas = document.getElementById('webgl-bg');
  if (!canvas) return;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);
  scene.fog = new THREE.FogExp2(0x050510, 0.045);

  var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 18);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  document.addEventListener('mousemove', function (e) {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  var planeWidth = 60;
  var planeDepth = 40;
  var segmentsW = 120;
  var segmentsD = 80;

  var geometry = new THREE.PlaneGeometry(
    planeWidth,
    planeDepth,
    segmentsW,
    segmentsD
  );
  geometry.rotateX(-Math.PI * 0.55);

  var waveMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x7c3aed) },
      uColorB: { value: new THREE.Color(0x06b6d4) },
      uColorC: { value: new THREE.Color(0xec4899) },
      uOpacity: { value: 0.55 },
    },
    vertexShader: [
      'uniform float uTime;',
      'varying float vElevation;',
      'varying vec2 vUv;',
      '',
      'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }',
      '',
      'float snoise(vec2 v) {',
      '  const vec4 C = vec4(',
      '    0.211324865405187,',
      '    0.366025403784439,',
      '    -0.577350269189626,',
      '    0.024390243902439',
      '  );',
      '  vec2 i  = floor(v + dot(v, C.yy));',
      '  vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1;',
      '  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
      '  vec4 x12 = x0.xyxy + C.xxzz;',
      '  x12.xy -= i1;',
      '  i = mod289(i);',
      '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))',
      '    + i.x + vec3(0.0, i1.x, 1.0));',
      '  vec3 m = max(0.5 - vec3(',
      '    dot(x0, x0),',
      '    dot(x12.xy, x12.xy),',
      '    dot(x12.zw, x12.zw)',
      '  ), 0.0);',
      '  m = m * m;',
      '  m = m * m;',
      '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
      '  vec3 h = abs(x) - 0.5;',
      '  vec3 ox = floor(x + 0.5);',
      '  vec3 a0 = x - ox;',
      '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
      '  vec3 g;',
      '  g.x = a0.x * x0.x + h.x * x0.y;',
      '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
      '  return 130.0 * dot(m, g);',
      '}',
      '',
      'void main() {',
      '  vUv = uv;',
      '  vec3 pos = position;',
      '  float wave1 = snoise(vec2(pos.x * 0.15 + uTime * 0.12, pos.y * 0.15 + uTime * 0.08)) * 1.8;',
      '  float wave2 = snoise(vec2(pos.x * 0.3 - uTime * 0.06, pos.y * 0.3 + uTime * 0.1)) * 0.8;',
      '  float wave3 = snoise(vec2(pos.x * 0.6 + uTime * 0.15, pos.y * 0.6)) * 0.3;',
      '  float elevation = wave1 + wave2 + wave3;',
      '  pos.z += elevation;',
      '  vElevation = elevation;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uColorA;',
      'uniform vec3 uColorB;',
      'uniform vec3 uColorC;',
      'uniform float uOpacity;',
      'varying float vElevation;',
      'varying vec2 vUv;',
      '',
      'void main() {',
      '  float normalizedElev = (vElevation + 2.5) / 5.0;',
      '  normalizedElev = clamp(normalizedElev, 0.0, 1.0);',
      '  vec3 color;',
      '  if (normalizedElev < 0.5) {',
      '    color = mix(uColorA, uColorB, normalizedElev * 2.0);',
      '  } else {',
      '    color = mix(uColorB, uColorC, (normalizedElev - 0.5) * 2.0);',
      '  }',
      '  float glow = smoothstep(0.3, 1.0, normalizedElev) * 0.6;',
      '  color += color * glow;',
      '  float edgeFade = smoothstep(0.0, 0.15, vUv.x)',
      '                 * smoothstep(1.0, 0.85, vUv.x)',
      '                 * smoothstep(0.0, 0.2, vUv.y)',
      '                 * smoothstep(1.0, 0.8, vUv.y);',
      '  gl_FragColor = vec4(color, uOpacity * edgeFade);',
      '}',
    ].join('\n'),
    wireframe: true,
    transparent: true,
    depthWrite: false,
  });

  var waveMesh = new THREE.Mesh(geometry, waveMaterial);
  waveMesh.position.set(0, -3, -5);
  scene.add(waveMesh);

  var particleCount = 300;
  var particleGeometry = new THREE.BufferGeometry();
  var particlePositions = new Float32Array(particleCount * 3);
  var particleSizes = new Float32Array(particleCount);

  for (var i = 0; i < particleCount; i++) {
    var i3 = i * 3;
    particlePositions[i3]     = (Math.random() - 0.5) * 50;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 30;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 40;
    particleSizes[i] = Math.random() * 2.0 + 0.5;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(particleSizes, 1));

  var particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'attribute float aSize;',
      'varying float vAlpha;',
      '',
      'void main() {',
      '  vec3 pos = position;',
      '  pos.y += sin(uTime * 0.15 + position.x * 0.3) * 0.5;',
      '  pos.x += cos(uTime * 0.1 + position.z * 0.2) * 0.3;',
      '  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);',
      '  gl_Position = projectionMatrix * mvPos;',
      '  gl_PointSize = aSize * uPixelRatio * (80.0 / -mvPos.z);',
      '  gl_PointSize = max(gl_PointSize, 1.0);',
      '  vAlpha = smoothstep(50.0, 5.0, -mvPos.z) * 0.6;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'varying float vAlpha;',
      '',
      'void main() {',
      '  float dist = length(gl_PointCoord - vec2(0.5));',
      '  if (dist > 0.5) discard;',
      '  float softness = 1.0 - smoothstep(0.2, 0.5, dist);',
      '  vec3 color = mix(vec3(0.486, 0.231, 0.929), vec3(1.0), 0.3);',
      '  gl_FragColor = vec4(color, vAlpha * softness);',
      '}',
    ].join('\n'),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  function createGlowOrb(color, position, scale) {
    var orbGeometry = new THREE.SphereGeometry(1, 16, 16);
    var orbMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
        '  vNormal = normalize(normalMatrix * normal);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'varying vec3 vNormal;',
        'void main() {',
        '  float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);',
        '  gl_FragColor = vec4(uColor, intensity * 0.15);',
        '}',
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    var orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(position.x, position.y, position.z);
    orb.scale.setScalar(scale);
    scene.add(orb);
    return orb;
  }

  var orb1 = createGlowOrb(0x7c3aed, { x: -12, y: 4, z: -15 }, 6);
  var orb2 = createGlowOrb(0x06b6d4, { x: 14, y: -2, z: -20 }, 5);
  var orb3 = createGlowOrb(0xec4899, { x: 0, y: 8, z: -25 }, 4);

  var clock = new THREE.Clock();
  var animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    var elapsed = clock.getElapsedTime();

    waveMaterial.uniforms.uTime.value = elapsed;
    particleMaterial.uniforms.uTime.value = elapsed;

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    camera.position.x = mouse.x * 1.5;
    camera.position.y = 8 + mouse.y * -0.8;
    camera.lookAt(0, 0, 0);

    orb1.position.y = 4 + Math.sin(elapsed * 0.3) * 2;
    orb1.position.x = -12 + Math.cos(elapsed * 0.2) * 1.5;

    orb2.position.y = -2 + Math.sin(elapsed * 0.4 + 1) * 1.5;
    orb2.position.x = 14 + Math.cos(elapsed * 0.25 + 2) * 1;

    orb3.position.y = 8 + Math.sin(elapsed * 0.35 + 2) * 1.8;

    particles.rotation.y = elapsed * 0.02;

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onResize, 150);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      clock.stop();
    } else {
      clock.start();
      animate();
    }
  });

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleReducedMotion() {
    if (motionQuery.matches) {
      cancelAnimationFrame(animationId);
      waveMaterial.uniforms.uTime.value = 0;
      renderer.render(scene, camera);
    } else {
      animate();
    }
  }

  motionQuery.addEventListener('change', handleReducedMotion);
  handleReducedMotion();

})();