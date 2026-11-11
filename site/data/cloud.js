const POINT_VS = `
attribute vec3 aPos;
attribute vec3 aColor;
attribute float aSize;
attribute float aAlpha;
attribute float aRing;
uniform mat4 uMvp;
uniform float uScale;
varying vec3 vColor;
varying float vAlpha;
varying float vRing;
void main() {
  vec4 clip = uMvp * vec4(aPos, 1.0);
  gl_Position = clip;
  gl_PointSize = clamp(aSize * uScale / max(clip.w, 0.2), 1.5, 42.0);
  vColor = aColor;
  vAlpha = aAlpha;
  vRing = aRing;
}
`;

const POINT_FS = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
varying float vRing;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  float core = smoothstep(0.55, 0.0, r);
  float ring = smoothstep(0.38, 0.55, r) * smoothstep(1.0, 0.68, r);
  float body = vRing > 0.5 ? ring : max(core, ring * 0.25);
  float glow = smoothstep(1.0, 0.2, r);
  float a = (body * 0.95 + glow * 0.28) * vAlpha;
  if (a < 0.03) discard;
  vec3 hot = mix(vColor, vec3(0.82, 0.92, 1.0), body);
  gl_FragColor = vec4(hot, a);
}
`;

const LINE_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform mat4 uMvp;
varying vec4 vColor;
void main() {
  gl_Position = uMvp * vec4(aPos, 1.0);
  vColor = aColor;
}
`;

const LINE_FS = `
precision mediump float;
varying vec4 vColor;
void main() {
  gl_FragColor = vColor;
}
`;

/* Data mode. Schemas are nodes in a WebGL graph. A line means one schema
   names another in its prose or a field type. Schemas that share a domain
   stay together; a mention pulls the two toward each other. Click a node to fly
   in. The hash is the place: empty or #all, #domain:<slug>, #<schema id>,
   #<schema id>/<field>. D3 7 (../vendor/d3.min.js) supplies the domain color.
   Read, the prose site, is the other mode. */
(function () {
  "use strict";

  const d3 = window.d3;
  const payloadNode = document.getElementById("rig-cloud");
  if (!d3 || !payloadNode) {
    document.body.classList.add("cloud-failed");
    return;
  }

  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const FOV = 0.9;
  const ACCENT = [0.25, 0.65, 1];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let payload;
  try {
    payload = JSON.parse(payloadNode.textContent);
  } catch (err) {
    console.error(err);
    document.body.classList.add("cloud-failed");
    return;
  }

  const stage = document.querySelector(".cloud-stage");
  const plot = document.getElementById("plot");
  const labels = document.createElement("canvas");
  labels.id = "labels";
  labels.setAttribute("aria-hidden", "true");
  stage.appendChild(labels);
  const tip = document.getElementById("tip");
  const card = document.getElementById("card");
  const crumbs = document.getElementById("crumbs");
  const input = document.getElementById("q");
  const hits = document.getElementById("hits");
  const status = document.getElementById("status");
  const labelCtx = labels.getContext("2d");

  let width = 1;
  let height = 1;
  let dpr = 1;
  let query = "";
  let booted = false;
  let focus = null;
  let hover = null;
  let dragging = false;
  let spin = true;
  const lastClick = { t: 0, hash: "" };
  const cam = {
    yaw: 0.55,
    pitch: 0.32,
    dist: 800,
    tx: 0,
    ty: 0,
    tz: 0,
    gyaw: 0.55,
    gpitch: 0.32,
    gdist: 800,
    gtx: 0,
    gty: 0,
    gtz: 0,
  };

  const model = layout(payload);
  const allSchemas = model.domains.flatMap((d) => d.schemas);
  const schemaById = new Map(allSchemas.map((s) => [s.id, s]));
  const neighbors = new Map(allSchemas.map((s) => [s, new Set()]));
  for (const link of model.links) {
    neighbors.get(link.a).add(link.b);
    neighbors.get(link.b).add(link.a);
  }
  for (const schema of allSchemas) {
    schema.degree = neighbors.get(schema).size;
    schema.size = Math.min(10, 2.6 + Math.sqrt(schema.degree) * 0.9);
    schema.mass = 1 + Math.sqrt(schema.degree) * 0.85;
  }
  focus = model.root;

  const gl = plot.getContext("webgl", {
    antialias: true,
    alpha: false,
    premultipliedAlpha: false,
  });
  if (!gl) {
    document.body.classList.add("cloud-failed");
    return;
  }

  const pointProg = program(gl, POINT_VS, POINT_FS);
  const lineProg = program(gl, LINE_VS, LINE_FS);
  const pointBuf = gl.createBuffer();
  const lineBuf = gl.createBuffer();
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(11 / 255, 13 / 255, 16 / 255, 1);

  let down = null;
  let pin = null;
  let pinDepth = 1;
  let live = false;
  const hold = { x: 0, y: 0, z: 0 };
  plot.addEventListener("pointerdown", (event) => {
    if (event.button > 2) return;
    if (event.button === 1 || event.button === 2) event.preventDefault();
    const hit = pick(event);
    const grabbed = hit && hit.kind === "schema" ? hit : null;
    const mode = dragMode(event, grabbed);
    if (!mode) return;
    down = { x: event.clientX, y: event.clientY, moved: false, mode };
    dragging = true;
    spin = false;
    if (mode === "pull") {
      pin = grabbed;
      live = true;
      const basis = cameraBasis();
      pinDepth = (grabbed.x - basis.eye[0]) * basis.fx
        + (grabbed.y - basis.eye[1]) * basis.fy
        + (grabbed.z - basis.eye[2]) * basis.fz;
      hold.x = grabbed.x;
      hold.y = grabbed.y;
      hold.z = grabbed.z;
    }
    try { plot.setPointerCapture(event.pointerId); }
    catch (err) { /* synthetic events have nothing to capture */ }
  });
  plot.addEventListener("pointermove", (event) => {
    if (down) {
      const dx = event.clientX - down.x;
      const dy = event.clientY - down.y;
      if (Math.hypot(dx, dy) > 3 || down.moved) down.moved = true;
      if (down.moved && down.mode === "pull" && pin) {
        const p = pointerWorld(event, pinDepth);
        hold.x = p.x;
        hold.y = p.y;
        hold.z = p.z;
        down.x = event.clientX;
        down.y = event.clientY;
        tip.hidden = true;
        return;
      }
      if (down.moved && down.mode === "truck") {
        truckBy(dx, dy);
        down.x = event.clientX;
        down.y = event.clientY;
        tip.hidden = true;
        return;
      }
      if (down.moved && down.mode === "orbit") {
        cam.yaw -= dx * 0.005;
        cam.pitch = clamp(cam.pitch - dy * 0.005, -1.15, 1.15);
        cam.gyaw = cam.yaw;
        cam.gpitch = cam.pitch;
        down.x = event.clientX;
        down.y = event.clientY;
        tip.hidden = true;
        return;
      }
      if (down.moved && down.mode === "tumble") {
        tumbleBy(dx, dy);
        down.x = event.clientX;
        down.y = event.clientY;
        tip.hidden = true;
        return;
      }
    }
    hover = pick(event);
    placeTip(event, hover);
    plot.classList.toggle("is-hot", !!hover);
  });
  plot.addEventListener("pointerup", (event) => {
    const moved = down?.moved;
    pin = null;
    dragging = false;
    down = null;
    if (moved || event.button) return;
    const now = performance.now();
    const hit = pick(event);
    const hash = hit ? hit.hash : "out";
    if (hash === lastClick.hash && now - lastClick.t < 380) return;
    lastClick.t = now;
    lastClick.hash = hash;
    if (hit) navigate(hit.hash);
    else if (focus.kind !== "world") navigate(parentOf(focus));
  });
  plot.addEventListener("pointerleave", () => {
    if (dragging) return;
    hover = null;
    tip.hidden = true;
    plot.classList.remove("is-hot");
  });
  plot.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });
  plot.addEventListener("contextmenu", (event) => event.preventDefault());
  plot.addEventListener("wheel", (event) => {
    event.preventDefault();
    spin = false;
    zoomAt(event);
  }, { passive: false });

  input.addEventListener("input", onQuery);
  input.addEventListener("focus", onQuery);
  input.addEventListener("blur", () => {
    setTimeout(() => { hits.hidden = true; }, 160);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const first = hits.querySelector("a");
      if (first) first.click();
    } else if (event.key === "Escape") {
      input.blur();
      if (input.value) {
        event.stopPropagation();
        input.value = "";
        onQuery();
      }
    }
  });
  hits.addEventListener("click", () => input.blur());

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping()) {
      event.preventDefault();
      input.focus();
      input.select();
      return;
    }
    if (isTyping()) return;
    if (event.key === "Escape" && focus && focus.kind !== "world") {
      event.preventDefault();
      navigate(parentOf(focus));
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      spin = false;
      cam.gyaw += event.key === "ArrowLeft" ? 0.18 : -0.18;
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      spin = false;
      cam.gpitch = clamp(cam.gpitch + (event.key === "ArrowUp" ? 0.12 : -0.12), -1.15, 1.15);
    }
  });

  window.addEventListener("hashchange", () => go(false));

  function onResize() {
    const prevW = width;
    const prevH = height;
    measure();
    if (!booted || (prevW === width && prevH === height)) return;
  }

  if (window.ResizeObserver) new ResizeObserver(onResize).observe(stage);
  else window.addEventListener("resize", onResize);

  try {
    measure();
    go(true);
    booted = true;
    document.body.classList.add("cloud-ready");
    requestAnimationFrame(frame);
  } catch (err) {
    console.error(err);
    document.body.classList.add("cloud-failed");
  }

  function layout(data) {
    const domains = data.groups.map((src, i) => {
      const color = domainColor(i);
      const domain = {
        kind: "domain",
        title: src.title,
        slug: src.slug,
        note: src.note || "",
        href: src.href,
        hash: `domain:${src.slug}`,
        short: shortTitle(src.title),
        color,
        rgb: hexRgb(color),
        schemas: [],
      };
      const count = src.schemas.length;
      const [ax, ay, az] = fibonacci(i, data.groups.length, 360);
      src.schemas.forEach((s, si) => {
        const ang = si * GOLDEN;
        const rad = (18 + Math.sqrt(count) * 6) * Math.sqrt((si + 0.5) / Math.max(count, 1));
        const fields = s.fields.map((f, fi) => ({
          kind: "field",
          name: f.name,
          type: f.type || "",
          constraint: f.constraint || "",
          required: f.required,
          meaning: f.meaning || "",
          hash: `${s.id}/${f.name}`,
          index: fi,
        }));
        const schema = {
          kind: "schema",
          id: s.id,
          leaf: s.leaf || s.id,
          summary: s.summary || "",
          maturity: s.maturity || "",
          union: !!s.union,
          href: s.href,
          seen: s.seen || [],
          hash: s.id,
          fields,
          ax,
          ay,
          az,
          x: ax + Math.cos(ang) * rad * 0.35,
          y: ay + Math.sin(ang) * rad * 0.22,
          z: az + Math.sin(ang * 1.7) * rad * 0.35,
          vx: 0,
          vy: 0,
          vz: 0,
          search: [s.id, s.leaf || s.id, s.summary || "", ...s.fields.map((f) => `${f.name} ${f.meaning || ""}`)]
            .join(" ")
            .toLowerCase(),
        };
        for (const field of fields) {
          field.schema = schema;
          field.domain = domain;
        }
        schema.domain = domain;
        domain.schemas.push(schema);
      });
      return domain;
    });
    const byId = new Map(domains.flatMap((d) => d.schemas.map((s) => [s.id, s])));
    const links = [];
    for (const edge of data.links || []) {
      const a = byId.get(edge.a);
      const b = byId.get(edge.b);
      if (!a || !b || a === b) continue;
      links.push({
        a,
        b,
        same: a.domain === b.domain,
        anchorDist: Math.hypot(a.ax - b.ax, a.ay - b.ay, a.az - b.az),
      });
    }
    simulate(domains.flatMap((d) => d.schemas), links);
    const schemas = domains.flatMap((d) => d.schemas);
    const mid = centroid(schemas);
    for (const schema of schemas) {
      schema.x -= mid.x;
      schema.y -= mid.y;
      schema.z -= mid.z;
      schema.hx = schema.x;
      schema.hy = schema.y;
      schema.hz = schema.z;
      schema.vx = 0;
      schema.vy = 0;
      schema.vz = 0;
    }
    for (const link of links) {
      link.rest = Math.hypot(link.a.x - link.b.x, link.a.y - link.b.y, link.a.z - link.b.z) || 1;
    }
    let radius = 1;
    for (const schema of schemas) {
      radius = Math.max(radius, Math.hypot(schema.x, schema.y, schema.z));
    }
    return {
      root: { kind: "world", hash: "all" },
      domains,
      links,
      worldDist: (radius / Math.tan(FOV / 2)) * 1.16,
    };
  }

  function simulate(nodes, links) {
    const n = nodes.length;
    const seen = new Map();
    for (let iter = 0; iter < 260; iter++) {
      for (let i = 0; i < n; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < n; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let dz = a.z - b.z;
          let d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < 1) d2 = 1;
          const d = Math.sqrt(d2);
          const mag = Math.min(3.2, 2200 / d2);
          dx = (dx / d) * mag;
          dy = (dy / d) * mag;
          dz = (dz / d) * mag;
          a.vx += dx;
          a.vy += dy;
          a.vz += dz;
          b.vx -= dx;
          b.vy -= dy;
          b.vz -= dz;
        }
      }
      for (const link of links) {
        const a = link.a;
        const b = link.b;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dz = b.z - a.z;
        const d = Math.hypot(dx, dy, dz) || 0.01;
        const rest = link.same ? 22 : 78;
        const mag = (d - rest) * (link.same ? 0.018 : 0.006);
        dx = (dx / d) * mag;
        dy = (dy / d) * mag;
        dz = (dz / d) * mag;
        a.vx += dx;
        a.vy += dy;
        a.vz += dz;
        b.vx -= dx;
        b.vy -= dy;
        b.vz -= dz;
      }
      seen.clear();
      for (const node of nodes) {
        let g = seen.get(node.domain);
        if (!g) {
          g = { x: 0, y: 0, z: 0, n: 0 };
          seen.set(node.domain, g);
        }
        g.x += node.x;
        g.y += node.y;
        g.z += node.z;
        g.n += 1;
      }
      for (const node of nodes) {
        const g = seen.get(node.domain);
        node.vx += (g.x / g.n - node.x) * 0.045;
        node.vy += (g.y / g.n - node.y) * 0.045;
        node.vz += (g.z / g.n - node.z) * 0.045;
        node.vx -= node.x * 0.003;
        node.vy -= node.y * 0.003;
        node.vz -= node.z * 0.003;
        const sp = Math.hypot(node.vx, node.vy, node.vz);
        const cap = sp > 8 ? 8 / sp : 1;
        node.x += node.vx * cap;
        node.y += node.vy * cap;
        node.z += node.vz * cap;
        node.vx *= 0.55;
        node.vy *= 0.55;
        node.vz *= 0.55;
      }
    }
  }

  function domainColor(i) {
    return d3.hsl((198 + i * 137.508) % 360, 0.55, 0.62).formatHex();
  }

  function hexRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ];
  }

  function shortTitle(title) {
    const cut = String(title).split(/\s+(?:\/|\()/)[0];
    return cut || title;
  }

  function fibonacci(i, n, radius) {
    const y = 1 - ((i + 0.5) / Math.max(n, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = i * GOLDEN;
    return [Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius];
  }

  function centroid(list) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (const node of list) {
      x += node.x;
      y += node.y;
      z += node.z;
    }
    const k = list.length || 1;
    return { x: x / k, y: y / k, z: z / k };
  }

  function fitDist(list) {
    const c = centroid(list);
    let r = 12;
    for (const node of list) {
      r = Math.max(r, Math.hypot(node.x - c.x, node.y - c.y, node.z - c.z));
    }
    return r / Math.tan(FOV / 2) + 48;
  }

  function measure() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    plot.width = Math.round(width * dpr);
    plot.height = Math.round(height * dpr);
    labels.width = plot.width;
    labels.height = plot.height;
    gl.viewport(0, 0, plot.width, plot.height);
  }

  function eyeOf() {
    const cp = Math.cos(cam.pitch);
    return [
      cam.tx + cam.dist * cp * Math.sin(cam.yaw),
      cam.ty + cam.dist * Math.sin(cam.pitch),
      cam.tz + cam.dist * cp * Math.cos(cam.yaw),
    ];
  }

  function viewProjection() {
    const eye = eyeOf();
    const view = new Float32Array(16);
    const proj = new Float32Array(16);
    const mvp = new Float32Array(16);
    lookAt(view, eye, [cam.tx, cam.ty, cam.tz], [0, 1, 0]);
    perspective(proj, FOV, width / height, 0.1, 8000);
    multiply(mvp, proj, view);
    return mvp;
  }

  function project(mvp, x, y, z) {
    const clipX = mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12];
    const clipY = mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13];
    const w = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
    if (w <= 0.08) return null;
    return {
      x: (clipX / w * 0.5 + 0.5) * width,
      y: (1 - (clipY / w * 0.5 + 0.5)) * height,
      w,
    };
  }

  function fieldSpots(schema) {
    const eye = eyeOf();
    let fx = schema.x - eye[0];
    let fy = schema.y - eye[1];
    let fz = schema.z - eye[2];
    const fl = Math.hypot(fx, fy, fz) || 1;
    fx /= fl;
    fy /= fl;
    fz /= fl;
    let rx = -fz;
    let ry = 0;
    let rz = fx;
    let rl = Math.hypot(rx, ry, rz);
    if (rl < 1e-4) {
      rx = 1;
      ry = 0;
      rz = 0;
      rl = 1;
    }
    rx /= rl;
    ry /= rl;
    rz /= rl;
    const ux = ry * fz - rz * fy;
    const uy = rz * fx - rx * fz;
    const uz = rx * fy - ry * fx;
    const radius = 18 + Math.sqrt(Math.max(schema.fields.length, 1)) * 5;
    return schema.fields.map((field, i) => {
      const ang = (i / Math.max(schema.fields.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const c = Math.cos(ang) * radius;
      const s = Math.sin(ang) * radius;
      return {
        field,
        x: schema.x + rx * c + ux * s,
        y: schema.y + ry * c + uy * s,
        z: schema.z + rz * c + uz * s,
      };
    });
  }

  function reveal() {
    if (query || !focus || focus.kind === "world") return query ? 0 : 1;
    const near = focus.kind === "field" ? 62 : focus.kind === "domain" ? model.worldDist * 0.3 : 120;
    const far = model.worldDist * 0.8;
    if (far <= near + 1) return 1;
    return clamp((cam.dist - near) / (far - near), 0, 1);
  }

  function dimOf(node) {
    let base = 1;
    if (query) base = node.search.includes(query) ? 1 : 0.06;
    else if (focus && focus.kind === "domain") base = node.domain === focus ? 1 : 0.08;
    else if (focus && focus.kind !== "world") {
      const schema = focusedSchema(focus);
      base = schema && (node === schema || neighbors.get(schema).has(node)) ? 1 : 0.08;
    }
    const opened = query ? 0 : reveal();
    return base + (1 - base) * opened;
  }

  function frame() {
    relax();
    const idle = !reduce && !dragging && !query && focus && focus.kind === "world" && spin && !live;
    if (idle) cam.gyaw += 0.0024;
    const k = reduce ? 1 : 0.1;
    cam.tx += (cam.gtx - cam.tx) * k;
    cam.ty += (cam.gty - cam.ty) * k;
    cam.tz += (cam.gtz - cam.tz) * k;
    cam.dist += (cam.gdist - cam.dist) * k;
    cam.pitch += (cam.gpitch - cam.pitch) * k;
    cam.yaw = dampAngle(cam.yaw, cam.gyaw, idle ? 1 : k);
    draw();
    paintLabels();
    requestAnimationFrame(frame);
  }

  /** Near-camera side of the cloud stays bright; far side falls toward the
   *  background — even when fully zoomed out, so the mesh keeps depth. */
  function depthOf(node, eye) {
    const d = Math.hypot(node.x - eye[0], node.y - eye[1], node.z - eye[2]);
    const near = cam.dist * 0.55;
    const far = cam.dist * 1.55;
    const t = clamp((d - near) / Math.max(far - near, 1), 0, 1);
    return 1 - 0.62 * t * t;
  }

  function depthTint(rgb, depth) {
    const fog = 1 - depth;
    const bg = [0.043, 0.051, 0.063];
    return [
      rgb[0] + (bg[0] - rgb[0]) * fog * 0.85,
      rgb[1] + (bg[1] - rgb[1]) * fog * 0.85,
      rgb[2] + (bg[2] - rgb[2]) * fog * 0.85,
    ];
  }

  function draw() {
    const mvp = viewProjection();
    const eye = eyeOf();
    const open = focusedSchema(focus);
    const close = 1 - reveal();
    const spots = open && open.fields.length && close > 0.35 ? fieldSpots(open) : [];
    const hoverSchema = hover && (hover.kind === "field" ? hover.schema : hover.kind === "schema" ? hover : null);

    const lines = [];
    for (const link of model.links) {
      const hot = hoverSchema && (link.a === hoverSchema || link.b === hoverSchema);
      const shown = focusedSchema(focus);
      const incident = shown && (link.a === shown || link.b === shown);
      const depth = Math.sqrt(depthOf(link.a, eye) * depthOf(link.b, eye));
      let alpha = link.same ? 0.55 : 0.7;
      alpha *= Math.sqrt(dimOf(link.a) * dimOf(link.b)) * (0.42 + 0.58 * depth);
      if (hot || (incident && close > 0.15)) alpha = Math.max(alpha, hot ? 0.95 : 0.55 + 0.4 * close);
      else if ((hoverSchema || shown) && close > 0) alpha *= 1 - 0.72 * close;
      if (alpha < 0.012) continue;
      let rgb = hot || incident
        ? lift(ACCENT, 0.35)
        : lift(link.same ? link.a.domain.rgb : ACCENT, 0.32);
      if (!hot && !incident) rgb = depthTint(rgb, depth);
      pushLine(lines, link.a, link.b, rgb, alpha);
    }
    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      const next = spots[(i + 1) % spots.length];
      const hot = hover && (hover === spot.field || hover === open);
      pushLine(lines, open, spot, lift(open.domain.rgb, 0.28), hot ? 0.95 : 0.72);
      if (spots.length > 2) pushLine(lines, spot, next, lift(open.domain.rgb, 0.28), 0.46);
    }

    const points = [];
    for (const schema of allSchemas) {
      const hot = hoverSchema === schema || (open && schema === open);
      const depth = depthOf(schema, eye);
      let alpha = Math.min(1, dimOf(schema) * (schema.maturity === "draft" ? 0.72 : 1) * (hot ? 1 : 0.92));
      if (!hot) alpha *= 0.38 + 0.62 * depth;
      if (alpha < 0.02) continue;
      const size = schema.size * (hot ? 1.45 : 1) * (hot ? 1 : 0.82 + 0.18 * depth);
      const rgb = hot ? schema.domain.rgb : depthTint(schema.domain.rgb, depth);
      pushPoint(points, schema, rgb, size, alpha, schema.maturity === "experimental" ? 1 : 0);
    }
    for (const spot of spots) {
      const hot = hover === spot.field || focus === spot.field;
      pushPoint(points, spot, open.domain.rgb, hot ? 4.4 : 3.1, hot ? 1 : 0.85, 0);
    }

    gl.viewport(0, 0, plot.width, plot.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    drawLines(mvp, new Float32Array(lines));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    drawPoints(mvp, new Float32Array(points));
  }

  function pushLine(out, a, b, rgb, alpha) {
    out.push(a.x, a.y, a.z, rgb[0], rgb[1], rgb[2], alpha);
    out.push(b.x, b.y, b.z, rgb[0], rgb[1], rgb[2], alpha);
  }

  function pushPoint(out, node, rgb, size, alpha, ring) {
    out.push(node.x, node.y, node.z, rgb[0], rgb[1], rgb[2], size, alpha, ring);
  }

  function drawLines(mvp, data) {
    if (data.length < 14) return;
    gl.useProgram(lineProg.prog);
    gl.uniformMatrix4fv(lineProg.mvp, false, mvp);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    enable(lineProg, "pos", 3, 7, 0);
    enable(lineProg, "color", 4, 7, 3);
    gl.drawArrays(gl.LINES, 0, data.length / 7);
  }

  function drawPoints(mvp, data) {
    if (data.length < 9) return;
    gl.useProgram(pointProg.prog);
    gl.uniformMatrix4fv(pointProg.mvp, false, mvp);
    gl.uniform1f(pointProg.scale, 1040 * (plot.height / height));
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    enable(pointProg, "pos", 3, 9, 0);
    enable(pointProg, "color", 3, 9, 3);
    enable(pointProg, "size", 1, 9, 6);
    enable(pointProg, "alpha", 1, 9, 7);
    enable(pointProg, "ring", 1, 9, 8);
    gl.drawArrays(gl.POINTS, 0, data.length / 9);
  }

  function enable(prog, name, size, stride, offset) {
    const loc = prog[name];
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
  }

  function paintLabels() {
    const ctx = labelCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const mvp = viewProjection();
    const mono = monoFont();
    ctx.font = `400 12px ${mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    const queue = [];
    const open = focusedSchema(focus);
    const hoverSchema = hover && hover.kind === "schema" ? hover : null;
    const tight = open && cam.dist < model.worldDist * 0.42;

    if (!query && !tight) {
      for (const domain of model.domains) {
        if (focus.kind === "domain" && domain !== focus) continue;
        const c = centroid(domain.schemas);
        const p = project(mvp, c.x, c.y, c.z);
        if (!p) continue;
        let reach = 0;
        for (const schema of domain.schemas) {
          const q = project(mvp, schema.x, schema.y, schema.z);
          if (q) reach = Math.max(reach, Math.hypot(q.x - p.x, q.y - p.y));
        }
        if (reach < 14) continue;
        if (focus.kind === "world" && reach > 560) continue;
        queue.push({ text: domain.short, x: p.x, y: p.y, font: 12, priority: 3, tone: "domain" });
      }
    }

    const pushSchema = (schema, priority) => {
      const p = project(mvp, schema.x, schema.y, schema.z);
      if (!p) return;
      // Light (low-degree) nodes stay visible — just quieter fill.
      const tone = schema.degree <= 1 ? "light" : schema.degree <= 3 ? "mid" : "heavy";
      queue.push({
        text: schema.leaf,
        x: p.x,
        y: p.y - 11,
        font: 11,
        priority,
        tone,
      });
    };

    if (query) {
      for (const schema of allSchemas) {
        if (schema.search.includes(query)) pushSchema(schema, 2 + schema.degree * 0.01);
      }
    } else if (tight) {
      pushSchema(open, 6);
      for (const spot of fieldSpots(open)) {
        const p = project(mvp, spot.x, spot.y, spot.z);
        if (!p) continue;
        queue.push({
          text: spot.field.name,
          x: p.x,
          y: p.y - 10,
          font: 10.5,
          priority: spot.field === focus ? 5 : 2,
          tone: "field",
        });
      }
      for (const schema of neighbors.get(open)) pushSchema(schema, 4);
      if (hoverSchema && hoverSchema !== open) pushSchema(hoverSchema, 7);
    } else {
      const floor = degreeFloor();
      for (const schema of allSchemas) {
        const inDomain = focus.kind === "domain" && schema.domain === focus;
        const hot = schema === hoverSchema || schema === open;
        if (!hot && !inDomain && schema.degree < floor) continue;
        const priority = hot ? 7 : inDomain ? 4 + schema.degree * 0.02 : 1 + schema.degree * 0.05;
        pushSchema(schema, priority);
      }
    }
    queue.sort((a, b) => b.priority - a.priority);
    const placed = [];
    for (const item of queue) stamp(ctx, placed, item, mono);
  }

  function stamp(ctx, placed, item, mono) {
    const { text, x, y, font, tone } = item;
    if (x < -20 || y < -12 || x > width + 20 || y > height + 12) return;
    ctx.font = `400 ${font}px ${mono}`;
    const w = ctx.measureText(text).width;
    const box = { x: x - w / 2 - 3, y: y - font / 2 - 2, w: w + 6, h: font + 4 };
    if (placed.some((p) => overlaps(p, box))) return;
    placed.push(box);
    ctx.strokeStyle = "#0b0d10";
    ctx.lineWidth = 2.4;
    ctx.strokeText(text, x, y);
    ctx.fillStyle =
      tone === "light" ? "#8d97a8"
      : tone === "mid" ? "#b4becc"
      : tone === "field" ? "#a8b4c4"
      : "#d5deea";
    ctx.fillText(text, x, y);
  }

  function degreeFloor() {
    // Keep light nodes labeled once you are not fully zoomed out.
    const d = cam.dist / (model.worldDist || 1);
    if (d > 0.92) return 1;
    return 0;
  }

  function overlaps(a, b) {
    const pad = 1;
    return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
  }

  function monoFont() {
    return getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace";
  }

  function pick(event) {
    const rect = plot.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const mvp = viewProjection();
    let best = null;
    let bestD = Infinity;
    const open = focusedSchema(focus);
    if (open) {
      for (const spot of fieldSpots(open)) {
        const p = project(mvp, spot.x, spot.y, spot.z);
        if (!p) continue;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d <= 16 && d < bestD) {
          best = spot.field;
          bestD = d;
        }
      }
    }
    for (const schema of allSchemas) {
      if (query && !schema.search.includes(query)) continue;
      const p = project(mvp, schema.x, schema.y, schema.z);
      if (!p) continue;
      const reach = Math.max(16, (schema.size * 1040) / p.w / dpr * 0.55);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d <= reach && d < bestD) {
        best = schema;
        bestD = d;
      }
    }
    return best;
  }

  function placeTip(event, hit) {
    if (!hit || dragging) {
      tip.hidden = true;
      return;
    }
    tip.hidden = false;
    tip.textContent = hit.kind === "field"
      ? `${hit.name}  ·  ${hit.schema.id}`
      : `${hit.id}  ·  ${weightWord(hit)}`;
    const approx = tip.textContent.length * 7.2 + 18;
    let x = event.clientX + 14;
    let y = event.clientY + 16;
    if (x + approx > width - 8) x = Math.max(8, event.clientX - 14 - approx);
    if (y > height - 36) y = event.clientY - 30;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }

  function dragMode(event, grabbed) {
    const mid = event.button === 1;
    const left = event.button === 0;
    if (event.button === 2) return "truck";
    if (mid && (event.shiftKey || event.altKey)) return "truck";
    if (mid || (left && event.altKey)) return "orbit";
    if (left && event.shiftKey) return "truck";
    if (left && (event.ctrlKey || event.metaKey) && grabbed) return "pull";
    if (left) return "tumble";
    return "";
  }

  function tumbleBy(dx, dy) {
    const dYaw = dx * 0.005;
    const dPitch = dy * 0.005;
    let cx = 0;
    let cy0 = 0;
    let cz = 0;
    for (const node of allSchemas) {
      cx += node.hx;
      cy0 += node.hy;
      cz += node.hz;
    }
    const n = allSchemas.length || 1;
    cx /= n;
    cy0 /= n;
    cz /= n;
    const yawCos = Math.cos(dYaw);
    const yawSin = Math.sin(dYaw);
    const pitchCos = Math.cos(dPitch);
    const pitchSin = Math.sin(dPitch);
    const rx = Math.cos(cam.yaw);
    const rz = -Math.sin(cam.yaw);
    const spin = (x, y, z) => {
      const x0 = x - cx;
      const y0 = y - cy0;
      const z0 = z - cz;
      const x1 = x0 * yawCos + z0 * yawSin;
      const y1 = y0;
      const z1 = -x0 * yawSin + z0 * yawCos;
      const dot = rx * x1 + rz * z1;
      const crossX = -rz * y1;
      const crossY = rz * x1 - rx * z1;
      const crossZ = rx * y1;
      return [
        cx + x1 * pitchCos + crossX * pitchSin + rx * dot * (1 - pitchCos),
        cy0 + y1 * pitchCos + crossY * pitchSin,
        cz + z1 * pitchCos + crossZ * pitchSin + rz * dot * (1 - pitchCos),
      ];
    };
    for (const node of allSchemas) {
      const p = spin(node.x, node.y, node.z);
      node.x = p[0];
      node.y = p[1];
      node.z = p[2];
      const h = spin(node.hx, node.hy, node.hz);
      node.hx = h[0];
      node.hy = h[1];
      node.hz = h[2];
      node.vx = 0;
      node.vy = 0;
      node.vz = 0;
    }
  }

  function truckBy(dx, dy) {
    const cp = Math.cos(cam.pitch);
    const sp = Math.sin(cam.pitch);
    const sy = Math.sin(cam.yaw);
    const cy = Math.cos(cam.yaw);
    const right = [cy, 0, -sy];
    const up = [-sy * sp, cp, -cy * sp];
    const scale = (2 * cam.dist * Math.tan(FOV / 2)) / height;
    cam.tx = cam.gtx = cam.tx + (-dx * right[0] + dy * up[0]) * scale;
    cam.ty = cam.gty = cam.ty + (-dx * right[1] + dy * up[1]) * scale;
    cam.tz = cam.gtz = cam.tz + (-dx * right[2] + dy * up[2]) * scale;
  }

  function lift(rgb, t) {
    return [
      rgb[0] + (1 - rgb[0]) * t,
      rgb[1] + (1 - rgb[1]) * t,
      rgb[2] + (1 - rgb[2]) * t,
    ];
  }

  function weightWord(schema) {
    if (schema.mass >= 4.5) return "heavy";
    if (schema.mass >= 2.6) return "medium";
    return "light";
  }

  function cameraBasis() {
    const eye = eyeOf();
    let fx = cam.tx - eye[0];
    let fy = cam.ty - eye[1];
    let fz = cam.tz - eye[2];
    const fl = Math.hypot(fx, fy, fz) || 1;
    fx /= fl;
    fy /= fl;
    fz /= fl;
    let rx = -fz;
    let ry = 0;
    let rz = fx;
    let rl = Math.hypot(rx, ry, rz);
    if (rl < 1e-4) {
      rx = 1;
      ry = 0;
      rz = 0;
      rl = 1;
    }
    rx /= rl;
    ry /= rl;
    rz /= rl;
    const ux = ry * fz - rz * fy;
    const uy = rz * fx - rx * fz;
    const uz = rx * fy - ry * fx;
    return { eye, fx, fy, fz, rx, ry, rz, ux, uy, uz };
  }

  function pointerWorld(event, depth) {
    const rect = plot.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / width) * 2 - 1;
    const ny = 1 - ((event.clientY - rect.top) / height) * 2;
    const b = cameraBasis();
    const halfH = Math.max(depth, 0.2) * Math.tan(FOV / 2);
    const halfW = halfH * (width / height);
    return {
      x: b.eye[0] + b.fx * depth + b.rx * nx * halfW + b.ux * ny * halfH,
      y: b.eye[1] + b.fy * depth + b.ry * nx * halfW + b.uy * ny * halfH,
      z: b.eye[2] + b.fz * depth + b.rz * nx * halfW + b.uz * ny * halfH,
    };
  }

  function focusAnchor() {
    if (!focus || focus.kind === "world") return { x: 0, y: 0, z: 0 };
    if (focus.kind === "domain") return centroid(focus.schemas);
    const schema = focus.kind === "field" ? focus.schema : focus;
    return { x: schema.hx, y: schema.hy, z: schema.hz };
  }

  function zoomAt(event) {
    let dy = event.deltaY;
    if (event.deltaMode === 1) dy *= 16;
    else if (event.deltaMode === 2) dy *= height;
    const factor = Math.exp(dy * 0.00115);
    const rect = plot.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / width) * 2 - 1;
    const ny = 1 - ((event.clientY - rect.top) / height) * 2;
    const b = cameraBasis();
    const halfH = cam.dist * Math.tan(FOV / 2);
    const halfW = halfH * (width / height);
    const px = cam.tx + b.rx * nx * halfW + b.ux * ny * halfH;
    const py = cam.ty + b.ry * nx * halfW + b.uy * ny * halfH;
    const pz = cam.tz + b.rz * nx * halfW + b.uz * ny * halfH;
    const home = model.worldDist * 0.52;
    const dist = clamp(cam.dist * factor, 22, model.worldDist * 2.2);
    const halfH2 = dist * Math.tan(FOV / 2);
    const halfW2 = halfH2 * (width / height);
    let tx = px - (b.rx * nx * halfW2 + b.ux * ny * halfH2);
    let ty = py - (b.ry * nx * halfW2 + b.uy * ny * halfH2);
    let tz = pz - (b.rz * nx * halfW2 + b.uz * ny * halfH2);
    // Wide zoom used to snap the look-at back onto the focused schema, so
    // the far side of the cloud stayed off-screen. Hand framing back to the
    // world origin as distance leaves the close orbit.
    let rest = focusAnchor();
    if (focus && focus.kind !== "world") {
      const leaveStart = focus.kind === "domain" ? home * 0.65 : 120;
      const leave = clamp((dist - leaveStart) / Math.max(home - leaveStart, 1), 0, 1);
      rest = {
        x: rest.x * (1 - leave),
        y: rest.y * (1 - leave),
        z: rest.z * (1 - leave),
      };
    }
    const wide = clamp((dist - home * 0.88) / Math.max(home * 0.55, 1), 0, 1);
    tx += (rest.x - tx) * wide;
    ty += (rest.y - ty) * wide;
    tz += (rest.z - tz) * wide;
    cam.tx = cam.gtx = tx;
    cam.ty = cam.gty = ty;
    cam.tz = cam.gtz = tz;
    cam.dist = cam.gdist = dist;
  }

  function relax() {
    if (!live && !pin) return;
    const steps = pin ? 5 : 3;
    let energy = 0;
    let wander = 0;
    for (let step = 0; step < steps; step++) {
      for (const node of allSchemas) {
        node.ax = (node.hx - node.x) * (node === pin ? 0.05 : 0.2);
        node.ay = (node.hy - node.y) * (node === pin ? 0.05 : 0.2);
        node.az = (node.hz - node.z) * (node === pin ? 0.05 : 0.2);
        if (node === pin) {
          node.ax += (hold.x - node.x) * 0.42;
          node.ay += (hold.y - node.y) * 0.42;
          node.az += (hold.z - node.z) * 0.42;
        }
      }
      for (const link of model.links) {
        const a = link.a;
        const b = link.b;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dz = b.z - a.z;
        const d = Math.hypot(dx, dy, dz) || 0.01;
        const mag = (d - link.rest) * 0.055;
        dx = (dx / d) * mag;
        dy = (dy / d) * mag;
        dz = (dz / d) * mag;
        a.ax += dx;
        a.ay += dy;
        a.az += dz;
        b.ax -= dx;
        b.ay -= dy;
        b.az -= dz;
      }
      for (const node of allSchemas) {
        const mass = node.mass || 1;
        node.vx = (node.vx + node.ax / mass) * 0.7;
        node.vy = (node.vy + node.ay / mass) * 0.7;
        node.vz = (node.vz + node.az / mass) * 0.7;
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        energy += node.vx * node.vx + node.vy * node.vy + node.vz * node.vz;
        wander = Math.max(wander, Math.hypot(node.x - node.hx, node.y - node.hy, node.z - node.hz));
      }
    }
    if (!pin && wander < 0.25 && energy < 0.02) {
      for (const node of allSchemas) {
        node.x = node.hx;
        node.y = node.hy;
        node.z = node.hz;
        node.vx = 0;
        node.vy = 0;
        node.vz = 0;
      }
      live = false;
    }
  }

  function aim(node, immediate) {
    let goal;
    if (!node || node.kind === "world") {
      // Start / Escape inside the framing distance so the mesh has presence
      // instead of sitting as a distant ball.
      goal = { x: 0, y: 0, z: 0, dist: model.worldDist * 0.52 };
      if (!dragging) spin = !query;
    } else if (node.kind === "domain") {
      const c = centroid(node.schemas);
      goal = { x: c.x, y: c.y, z: c.z, dist: Math.max(96, fitDist(node.schemas)) };
      spin = false;
    } else {
      const schema = node.kind === "field" ? node.schema : node;
      goal = {
        x: schema.hx,
        y: schema.hy,
        z: schema.hz,
        dist: node.kind === "field" ? 54 : 96,
      };
      spin = false;
    }
    cam.gtx = goal.x;
    cam.gty = goal.y;
    cam.gtz = goal.z;
    cam.gdist = goal.dist;
    if (immediate || reduce) {
      cam.tx = cam.gtx;
      cam.ty = cam.gty;
      cam.tz = cam.gtz;
      cam.dist = cam.gdist;
      cam.yaw = cam.gyaw;
      cam.pitch = cam.gpitch;
    }
  }

  function dampAngle(cur, goal, k) {
    let d = goal - cur;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return cur + d * k;
  }

  function go(immediate) {
    measure();
    const hash = readHash();
    let node = lookup(hash);
    if (!node) node = model.root;
    if (!samePlace(hash, node)) {
      const url = node.kind === "world"
        ? location.pathname + location.search
        : "#" + node.hash;
      history.replaceState(null, "", url);
    }
    focus = node;
    renderCrumbs(node);
    renderCard(node);
    syncRead(node);
    syncTitle(node);
    status.textContent = statusText(node);
    hover = null;
    tip.hidden = true;
    aim(node, immediate);
  }

  function lookup(hash) {
    if (!hash || hash === "all") return model.root;
    if (hash.startsWith("domain:")) {
      return model.domains.find((d) => d.slug === hash.slice(7)) || null;
    }
    const cut = hash.indexOf("/");
    const id = cut === -1 ? hash : hash.slice(0, cut);
    const schema = schemaById.get(id);
    if (!schema) return null;
    if (cut === -1) return schema;
    return schema.fields.find((f) => f.name === hash.slice(cut + 1)) || schema;
  }

  function samePlace(hash, node) {
    if (node.kind === "world") return hash === "" || hash === "all";
    return hash === node.hash;
  }

  function readHash() {
    const raw = location.hash.replace(/^#/, "");
    if (!raw) return "";
    try { return decodeURIComponent(raw); }
    catch (err) { return raw; }
  }

  function navigate(hash) {
    if (readHash() === hash || (hash === "all" && readHash() === "")) go(false);
    else location.hash = hash;
  }

  function parentOf(node) {
    if (node.kind === "field") return node.schema.hash;
    if (node.kind === "schema") return node.domain.hash;
    return "all";
  }

  function onQuery() {
    query = input.value.trim().toLowerCase();
    const found = query ? allSchemas.filter((s) => s.search.includes(query)) : [];
    hits.replaceChildren();
    const focused = document.activeElement === input;
    if (!query || !focused) hits.hidden = true;
    else if (!found.length) {
      hits.hidden = false;
      hits.append(el("li", { class: "hit-none", text: "No schema matches" }));
    } else {
      hits.hidden = false;
      for (const s of found.slice(0, 8)) {
        const li = el("li");
        const a = el("a", { href: "#" + s.hash });
        a.append(el("code", { text: s.id }));
        a.append(el("span", { class: "hit-domain", text: s.domain.title }));
        li.append(a);
        hits.append(li);
      }
      if (found.length > 8) {
        hits.append(el("li", { class: "hit-none", text: `${found.length - 8} more in the graph` }));
      }
    }
    if (focus && (focus.kind === "schema" || focus.kind === "field")) renderCard(focus);
  }

  function renderCrumbs(node) {
    crumbs.replaceChildren();
    const parts = [{ label: "Schemas", hash: "all" }];
    const domain = focusedDomain(node);
    if (domain) parts.push({ label: domain.title, hash: domain.hash });
    const schema = focusedSchema(node);
    if (schema) parts.push({ label: schema.leaf, hash: schema.hash });
    if (node.kind === "field") parts.push({ label: node.name, hash: node.hash });
    parts.forEach((part, i) => {
      if (i) crumbs.append(el("span", { class: "sep", text: "/" }));
      if (i === parts.length - 1) crumbs.append(el("span", { class: "here", text: part.label }));
      else crumbs.append(el("a", { href: "#" + part.hash, text: part.label }));
    });
  }

  function renderCard(node) {
    card.replaceChildren();
    card.scrollTop = 0;
    if (node.kind === "world") renderWorld();
    else if (node.kind === "domain") renderDomain(node);
    else if (node.kind === "schema") renderSchema(node);
    else renderField(node);
  }

  function renderWorld() {
    card.append(el("h1", { text: "Schemas" }));
    card.append(el("p", {
      class: "card-summary",
      text: `Each node is a schema. A line means one schema names another. ${payload.count.schemas} schemas, ${model.links.length} links, across ${model.domains.length} domains. Click a node to fly in.`,
    }));
    card.append(el("p", {
      class: "card-quiet",
      text: "Drag to rotate the whole mesh. Shift-drag or right-drag trucks, as do Shift-middle and Alt-middle. Ctrl-drag a node to pull it; heavier nodes spring back harder. Scroll zooms toward the cursor. Escape steps back out.",
    }));
    card.append(el("p", {
      class: "card-meta",
      text: `v${payload.version} · ${payload.tier} · ${payload.count.stable} stable · ${payload.count.draft} draft · ${payload.count.experimental} experimental`,
    }));
    card.append(legend());
    card.append(el("p", { class: "card-quiet", text: "Color is the domain. A hollow node is experimental, a dimmer one is draft." }));
    const details = el("details");
    details.append(el("summary", { text: "Domains" }));
    details.append(linkList(model.domains.map((d) => ({ href: "#" + d.hash, text: d.title }))));
    card.append(details);
  }

  function renderDomain(d) {
    card.append(el("h1", { text: d.title }));
    if (d.note) card.append(el("p", { class: "card-summary", text: d.note }));
    card.append(el("p", {
      class: "card-meta",
      text: `${d.schemas.length} schema${d.schemas.length === 1 ? "" : "s"}`,
    }));
    const open = el("p", { class: "card-link" });
    open.append(el("a", { href: d.href, text: "Open the schema" }));
    card.append(open);
    card.append(linkList(d.schemas.map((s) => ({ href: "#" + s.hash, text: s.leaf }))));
  }

  function renderSchema(s) {
    const h = el("h1");
    h.append(el("code", { text: s.id }));
    card.append(h);
    const required = s.fields.filter((f) => f.required === true).length;
    card.append(el("p", {
      class: "card-meta",
      text: [
        s.maturity,
        `${s.fields.length} field${s.fields.length === 1 ? "" : "s"}`,
        `${required} required`,
        `${s.degree} link${s.degree === 1 ? "" : "s"} · ${weightWord(s)}`,
      ].filter(Boolean).join(" · "),
    }));
    if (s.summary) card.append(el("p", { class: "card-summary", text: s.summary }));
    if (s.union) {
      card.append(el("p", {
        class: "card-quiet",
        text: "Tagged union. Only the storage field selected by type may be present.",
      }));
    }
    const linked = [...neighbors.get(s)].sort((a, b) => a.id.localeCompare(b.id));
    if (linked.length) {
      card.append(el("p", {
        class: "card-quiet",
        text: "Linked because one schema names the other.",
      }));
      card.append(linkList(linked.slice(0, 8).map((n) => ({
        href: "#" + n.hash,
        text: n.id.replace(/^rig\./, ""),
      }))));
      if (linked.length > 8) {
        card.append(el("p", { class: "card-quiet", text: `${linked.length - 8} more on the mesh.` }));
      }
    }
    if (!s.fields.length) {
      card.append(el("p", { class: "card-quiet", text: "Marker. Presence is the whole meaning." }));
    } else {
      card.append(el("p", { class: "card-quiet", text: "The ring around this node is its fields." }));
    }
    const open = el("p", { class: "card-link" });
    open.append(el("a", { href: s.href, text: "Open the page" }));
    card.append(open);
    if (s.seen.length) {
      const seen = el("p", { class: "card-seen" });
      seen.append(document.createTextNode("Seen in "));
      s.seen.forEach((ex, i) => {
        if (i) seen.append(document.createTextNode(", "));
        seen.append(el("a", { href: ex.href, text: ex.name }));
      });
      card.append(seen);
    }
    if (s.fields.length) {
      const rows = el("div", { class: "field-rows" });
      for (const f of s.fields) {
        const a = el("a", { href: "#" + f.hash });
        if (query && (`${f.name} ${f.meaning}`.toLowerCase().includes(query))) a.classList.add("is-on");
        a.append(el("code", { text: f.name }));
        a.append(el("span", { text: fieldMeta(f) }));
        rows.append(a);
      }
      card.append(rows);
    }
  }

  function renderField(f) {
    const h = el("h1");
    h.append(el("code", { text: f.name }));
    card.append(h);
    card.append(el("p", { class: "card-meta", text: fieldMeta(f) }));
    const on = el("p", { class: "card-quiet" });
    on.append(document.createTextNode("on "));
    on.append(el("a", { href: "#" + f.schema.hash, text: f.schema.id }));
    card.append(on);
    if (f.meaning) card.append(el("p", { class: "card-summary", text: f.meaning }));
    const open = el("p", { class: "card-link" });
    open.append(el("a", { href: f.schema.href, text: "Open the page" }));
    card.append(open);
  }

  function legend() {
    const row = el("div", { class: "legend" });
    for (const [key, label] of [["stable", "stable"], ["draft", "draft"], ["experimental", "experimental"]]) {
      const span = el("span");
      span.append(el("i", { class: `swatch ${key}`, "aria-hidden": "true" }));
      span.append(document.createTextNode(label));
      row.append(span);
    }
    return row;
  }

  function linkList(items) {
    const ul = el("ul", { class: "jump" });
    for (const item of items) {
      const li = el("li");
      li.append(el("a", { href: item.href, text: item.text }));
      ul.append(li);
    }
    return ul;
  }

  function fieldMeta(f) {
    const req = f.required === true ? "required" : f.required === false ? "optional" : "";
    return [f.type, f.constraint, req].filter(Boolean).join(" · ");
  }

  function syncRead(node) {
    const a = document.getElementById("mode-read");
    if (!a) return;
    if (node.kind === "schema") setRead(a, node.href, "Read this schema");
    else if (node.kind === "field") setRead(a, node.schema.href, "Read this schema");
    else if (node.kind === "domain") setRead(a, node.href, "Read this domain");
    else setRead(a, payload.home, "");
  }

  function setRead(a, href, label) {
    a.href = href;
    if (label) a.setAttribute("aria-label", label);
    else a.removeAttribute("aria-label");
  }

  function syncTitle(node) {
    if (node.kind === "schema") document.title = `${node.id} — Data — RigWorks`;
    else if (node.kind === "field") document.title = `${node.name} — ${node.schema.id} — Data — RigWorks`;
    else if (node.kind === "domain") document.title = `${node.title} — Data — RigWorks`;
    else document.title = "Data — RigWorks";
  }

  function statusText(node) {
    if (node.kind === "world") {
      return `Schemas. ${payload.count.schemas} nodes, ${model.links.length} links.`;
    }
    if (node.kind === "domain") return `${node.title}. ${node.schemas.length} schemas.`;
    if (node.kind === "schema") {
      return `${node.id}. ${node.maturity || "schema"}. ${node.fields.length} fields, ${node.degree} links.`;
    }
    return `${node.name}. ${fieldMeta(node)}. ${node.schema.id}.`;
  }

  function focusedSchema(node) {
    if (!node) return null;
    if (node.kind === "schema") return node;
    if (node.kind === "field") return node.schema;
    return null;
  }

  function focusedDomain(node) {
    if (!node) return null;
    if (node.kind === "domain") return node;
    if (node.kind === "schema" || node.kind === "field") return node.domain;
    return null;
  }

  function isTyping() {
    const node = document.activeElement;
    if (!node) return false;
    const tag = node.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function el(tag, props) {
    const node = document.createElement(tag);
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (value == null || value === false) continue;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value);
      }
    }
    return node;
  }

  function program(gl, vs, fs) {
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "shader link");
    }
    const loc = (name) => {
      const at = gl.getAttribLocation(prog, name);
      return at;
    };
    return {
      prog,
      mvp: gl.getUniformLocation(prog, "uMvp"),
      scale: gl.getUniformLocation(prog, "uScale"),
      pos: loc("aPos"),
      color: loc("aColor"),
      size: loc("aSize"),
      alpha: loc("aAlpha"),
      ring: loc("aRing"),
    };
  }

  function shader(gl, type, source) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) || "shader compile");
    }
    return sh;
  }

  function lookAt(out, eye, center, up) {
    let z0 = eye[0] - center[0];
    let z1 = eye[1] - center[1];
    let z2 = eye[2] - center[2];
    let len = Math.hypot(z0, z1, z2) || 1;
    z0 /= len;
    z1 /= len;
    z2 /= len;
    let x0 = up[1] * z2 - up[2] * z1;
    let x1 = up[2] * z0 - up[0] * z2;
    let x2 = up[0] * z1 - up[1] * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      x0 /= len;
      x1 /= len;
      x2 /= len;
    }
    const y0 = z1 * x2 - z2 * x1;
    const y1 = z2 * x0 - z0 * x2;
    const y2 = z0 * x1 - z1 * x0;
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
    out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
    out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
    out[15] = 1;
  }

  function perspective(out, fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    out.fill(0);
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[14] = (2 * far * near) / (near - far);
  }

  function multiply(out, a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    for (let i = 0; i < 4; i++) {
      const b0 = b[i * 4];
      const b1 = b[i * 4 + 1];
      const b2 = b[i * 4 + 2];
      const b3 = b[i * 4 + 3];
      out[i * 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }
  }
})();
