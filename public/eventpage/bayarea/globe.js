const canvas = document.getElementById('globe'),
  ctx = canvas.getContext('2d'),
  section = document.getElementById('journey');
let world = [],
  W,
  H,
  R,
  cx,
  cy,
  progress = 0;
const rad = Math.PI / 180,
  sf = [-122.42, 37.77],
  muc = [11.58, 48.14];
const planeLogo = new Image();
planeLogo.src = '/eventpage/bayarea/assets/start-emblem.svg';
planeLogo.onload = () => draw();
document.fonts.ready.then(() => resize());
const journeyPin = document.querySelector('.journey-pin'),
  mobilePeek = document.querySelector('.mobile-story-peek'),
  introArticle = document.querySelector('.story-row-1 .story-text'),
  introLabel = introArticle.querySelector('.note-label'),
  introHeading = introArticle.querySelector('h2');
function placeIntro() {
  if (innerWidth <= 600) {
    mobilePeek.append(introLabel, introHeading);
    section.style.setProperty('--mobile-peek-height', mobilePeek.offsetHeight + 'px');
  } else {
    introArticle.prepend(introLabel, introHeading);
    section.style.removeProperty('--mobile-peek-height');
  }
}
function resize() {
  placeIntro();
  let d = Math.min(devicePixelRatio || 1, 2);
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = W * d;
  canvas.height = H * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  R = Math.min(W * (W < 600 ? 0.39 : 0.29), H * (W < 600 ? 0.37 : 0.39));
  cx = W / 2;
  cy = H * (W < 600 ? 0.43 : 0.46);
  update();
}
function project(lon, lat, center = 11.58 - 134 * progress, alt = 1) {
  let l = (lon - center) * rad,
    p = lat * rad,
    t = (43 - 4 * progress) * rad;
  return [
    cx + R * alt * Math.cos(p) * Math.sin(l),
    cy - R * alt * (Math.cos(t) * Math.sin(p) - Math.sin(t) * Math.cos(p) * Math.cos(l)),
    Math.sin(t) * Math.sin(p) + Math.cos(t) * Math.cos(p) * Math.cos(l),
  ];
}
function locationAt(t) {
  let vec = ([lon, lat]) => [
      Math.cos(lat * rad) * Math.cos(lon * rad),
      Math.cos(lat * rad) * Math.sin(lon * rad),
      Math.sin(lat * rad),
    ],
    a = vec(muc),
    b = vec(sf),
    omega = Math.acos(a.reduce((v, n, i) => v + n * b[i], 0)),
    v = a.map(
      (n, i) => (Math.sin((1 - t) * omega) * n + Math.sin(t * omega) * b[i]) / Math.sin(omega),
    );
  return [Math.atan2(v[1], v[0]) / rad, Math.atan2(v[2], Math.hypot(v[0], v[1])) / rad];
}
function line(points, color, width = 1, dash = []) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}
function bridge(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#a9d9f4';
  ctx.beginPath();
  ctx.ellipse(0, 12, 91, 24, -0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#aac897';
  ctx.beginPath();
  ctx.moveTo(-87, 8);
  ctx.lineTo(-75, -13);
  ctx.lineTo(-56, -20);
  ctx.lineTo(-39, -6);
  ctx.lineTo(-30, 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c2d7aa';
  ctx.beginPath();
  ctx.moveTo(43, 7);
  ctx.lineTo(62, -12);
  ctx.lineTo(80, -17);
  ctx.lineTo(91, 3);
  ctx.lineTo(87, 12);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 3; i++) {
    let yy = 17 + i * 6;
    line(
      [
        [-66 + i * 17, yy],
        [-46 + i * 17, yy - 1],
        [-32 + i * 17, yy],
      ],
      '#e0f3ff',
      1,
    );
  }
  line(
    [
      [-76, 0],
      [74, -8],
    ],
    '#F04A00',
    8,
  );
  for (let a of [-42, 39]) {
    ctx.fillStyle = '#F04A00';
    ctx.fillRect(a - 4, -60, 8, 70);
    ctx.fillStyle = '#faad89';
    ctx.fillRect(a - 4, -60, 3, 70);
    line(
      [
        [a - 8, -60],
        [a + 8, -60],
      ],
      '#b43a00',
      3,
    );
  }
  for (let k = 0; k < 3; k++) {
    let x1 = [-77, -42, 39][k],
      x2 = [-42, 39, 76][k];
    ctx.beginPath();
    ctx.moveTo(x1, k === 0 ? -1 : -57);
    ctx.quadraticCurveTo((x1 + x2) / 2, k === 1 ? 5 : -2, x2, k === 2 ? -8 : -57);
    ctx.strokeStyle = '#F04A00';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  for (let i = -70; i < 74; i += 9) {
    let yy =
      i < -42
        ? -3 - ((i + 77) / 35) * 54
        : i > 39
          ? -57 + ((i - 39) / 37) * 49
          : -57 + 48 * (1 - Math.pow((i + 1.5) / 40.5, 2));
    line(
      [
        [i, yy],
        [i, (-(i + 76) / 150) * 8],
      ],
      '#F04A00',
      0.8,
    );
  }
  ctx.restore();
}
function munich(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#b5d69b';
  ctx.beginPath();
  ctx.ellipse(0, 10, 79, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#759e73';
  ctx.beginPath();
  ctx.moveTo(-3, 4);
  ctx.lineTo(35, -60);
  ctx.lineTo(77, 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#94b981';
  ctx.beginPath();
  ctx.moveTo(32, 7);
  ctx.lineTo(68, -44);
  ctx.lineTo(95, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(22, -39);
  ctx.lineTo(35, -60);
  ctx.lineTo(49, -38);
  ctx.lineTo(39, -43);
  ctx.lineTo(33, -37);
  ctx.lineTo(29, -43);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(57, -28);
  ctx.lineTo(68, -44);
  ctx.lineTo(79, -27);
  ctx.lineTo(70, -31);
  ctx.lineTo(65, -26);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e7c59b';
  ctx.fillRect(-35, -31, 45, 35);
  ctx.fillStyle = '#be704f';
  ctx.beginPath();
  ctx.moveTo(-40, -30);
  ctx.lineTo(-13, -50);
  ctx.lineTo(16, -30);
  ctx.closePath();
  ctx.fill();
  for (let xx of [-39, -8]) {
    ctx.fillStyle = '#f3dfba';
    ctx.fillRect(xx, -62, 13, 66);
    ctx.fillStyle = '#618c86';
    ctx.beginPath();
    ctx.ellipse(xx + 6.5, -64, 8, 10, 0, Math.PI, 2 * Math.PI);
    ctx.lineTo(xx + 14, -61);
    ctx.lineTo(xx - 1, -61);
    ctx.fill();
    line(
      [
        [xx + 6, -78],
        [xx + 6, -72],
      ],
      '#526e69',
      1.3,
    );
    ctx.fillStyle = '#797c70';
    ctx.fillRect(xx + 4, -51, 4, 8);
    ctx.fillRect(xx + 4, -34, 4, 7);
  }
  for (let xx of [-20, -10, 0]) {
    ctx.fillStyle = '#8c7b67';
    ctx.fillRect(xx, -19, 4, 8);
  }
  for (let tx of [-58, 62]) {
    line(
      [
        [tx, 9],
        [tx, -4],
      ],
      '#8c7858',
      2,
    );
    ctx.fillStyle = '#6c9c6b';
    ctx.beginPath();
    ctx.ellipse(tx, -7, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function plane(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.65, 1.65);
  ctx.shadowColor = '#00002c20';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#00002c';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.quadraticCurveTo(14, -3, 4, -3);
  ctx.lineTo(-4, -17);
  ctx.lineTo(-9, -17);
  ctx.lineTo(-6, -3);
  ctx.lineTo(-16, -2);
  ctx.lineTo(-21, -8);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-21, 0);
  ctx.lineTo(-24, 8);
  ctx.lineTo(-21, 8);
  ctx.lineTo(-16, 2);
  ctx.lineTo(-6, 3);
  ctx.lineTo(-9, 17);
  ctx.lineTo(-4, 17);
  ctx.lineTo(4, 3);
  ctx.quadraticCurveTo(14, 3, 19, 0);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.restore();
  if (planeLogo.complete && planeLogo.naturalWidth) {
    ctx.save();
    const size = W < 600 ? 23 : 29;
    ctx.shadowColor = '#00002c18';
    ctx.shadowBlur = 5;
    ctx.drawImage(planeLogo, x - size / 2, y - 60 - size, size, size);
    ctx.restore();
  }
}
function cityLabel(name, x, y) {
  ctx.save();
  ctx.font = (W < 600 ? '500 16px' : '500 21px') + ' Figtree, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,.92)';
  ctx.lineJoin = 'round';
  ctx.strokeText(name, x, y);
  ctx.fillStyle = '#00002c';
  ctx.fillText(name, x, y);
  ctx.restore();
}
function cloud(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#dbeaff';
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 5, 0, 0, 7);
  ctx.ellipse(-6, -4, 10, 7, 0, 0, 7);
  ctx.ellipse(7, -5, 8, 8, 0, 0, 7);
  ctx.fill();
  ctx.restore();
}
function draw() {
  if (!W) return;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(cx, cy + R * 1.04);
  ctx.scale(1, 0.1);
  let shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  shadow.addColorStop(0, '#00002c18');
  shadow.addColorStop(1, '#00002c00');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, 7);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 7);
  ctx.clip();
  let grad = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.5, 0, cx, cy, R * 1.3);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.65, '#f5f7fb');
  grad.addColorStop(1, '#dfe3ec');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  world.forEach((f) => {
    let polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    polys.forEach((poly) => {
      let pts = poly[0].map((p) => project(p[0], p[1]));
      if (!pts.some((p) => p[2] > 0)) return;
      ctx.beginPath();
      pts.forEach((p, i) => {
        let x = p[0],
          y = p[1];
        if (p[2] < 0) {
          let d = Math.hypot(x - cx, y - cy) || 1;
          x = cx + ((x - cx) / d) * R;
          y = cy + ((y - cy) / d) * R;
        }
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = '#d8d6df';
      ctx.fill();
      ctx.strokeStyle = '#b9b6c6';
      ctx.lineWidth = 0.4;
      ctx.stroke();
    });
  });
  for (let lat = -60; lat <= 80; lat += 20) {
    let pts = [];
    for (let lon = -180; lon <= 180; lon += 2) {
      let p = project(lon, lat);
      if (p[2] > 0) pts.push(p);
      else if (pts.length) {
        line(pts, '#00002c12', 0.6);
        pts = [];
      }
    }
    line(pts, '#00002c12', 0.6);
  }
  for (let lon = -180; lon < 180; lon += 20) {
    let pts = [];
    for (let lat = -90; lat <= 90; lat += 2) {
      let p = project(lon, lat);
      if (p[2] > 0) pts.push(p);
      else if (pts.length) {
        line(pts, '#00002c12', 0.6);
        pts = [];
      }
    }
    line(pts, '#00002c12', 0.6);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 7);
  ctx.strokeStyle = '#c5c2cf';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  let route = [];
  for (let t = 0; t <= 1.001; t += 0.0125) {
    let p = project(...locationAt(t), undefined, 1.07);
    if (p[2] > 0) route.push(p);
    else if (route.length) {
      line(route, '#F04A0070', 1, [2, 5]);
      route = [];
    }
  }
  line(route, '#F04A0070', 1, [2, 5]);
  let scale = Math.max(0.5, R / 270);
  let a = project(...muc),
    b = project(...sf);
  if (a[2] > 0.12) {
    munich(a[0], a[1] - 6, scale);
    cityLabel('Munich', a[0], a[1] + Math.max(36 * scale, W < 600 ? 55 : 42));
  }
  if (b[2] > 0.12) {
    bridge(b[0], b[1] - 6, scale);
    cityLabel('San Francisco', b[0], b[1] + Math.max(42 * scale, W < 600 ? 55 : 45));
  }
  let p = project(...locationAt(progress), undefined, 1.11),
    q = project(...locationAt(Math.min(progress + 0.005, 1)), undefined, 1.11);
  if (progress > 0.995) {
    let prev = project(...locationAt(0.99), undefined, 1.11);
    q = [p[0] + p[0] - prev[0], p[1] + p[1] - prev[1]];
  }
  plane(p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]));
  const cs = Math.max(0.65, Math.min(1.2, R / 220));
  cloud(cx - R * 1.15, cy - R * 0.7, 1.5 * cs);
  cloud(cx + R * 1.12, cy - R * 0.78, 1.8 * cs);
  cloud(cx - R * 1.24, cy + R * 0.12, 1.1 * cs);
  cloud(cx + R * 1.2, cy + R * 0.35, 1.5 * cs);
  cloud(cx - R * 0.67, cy - R * 1.04, 1.1 * cs);
  cloud(cx + R * 0.65, cy + R * 0.9, 1.25 * cs);
}
let scheduled = false;
function update() {
  const rect = section.getBoundingClientRect();
  progress = Math.max(
    0,
    Math.min(
      1,
      -rect.top /
        (W < 600
          ? section.offsetHeight - journeyPin.offsetHeight
          : section.offsetHeight - innerHeight),
    ),
  );
  document.getElementById('route-fill').style.width = progress * 100 + '%';
  draw();
  scheduled = false;
}
window.addEventListener(
  'scroll',
  () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  },
  { passive: true },
);
window.addEventListener('resize', resize);
resize();
fetch('/eventpage/bayarea/assets/world.json')
  .then((r) => r.json())
  .then((j) => {
    world = j.features.filter((f) => f.properties.name !== 'Antarctica');
    draw();
  })
  .catch(() => {});
