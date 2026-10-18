/** A fixed-step mass/spring sheet. Rendering is deliberately separate from its physics. */
export class ElasticSheet {
  readonly positions: Float32Array;
  readonly rest: Float32Array;
  readonly velocities: Float32Array;
  readonly absorbed: Uint8Array;
  private forces: Float32Array;
  private springs: { a: number; b: number; length: number; stiffness: number }[] = [];
  readonly width: number;
  readonly height: number;
  constructor(width: number, height: number, columns = 38, rows = 26) {
    this.width = width; this.height = height;
    const count = (columns + 1) * (rows + 1);
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.forces = new Float32Array(count * 3);
    this.absorbed = new Uint8Array(count);
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
      const i = (y * (columns + 1) + x) * 3;
      this.positions[i] = (x / columns - .5) * width;
      this.positions[i + 1] = (.5 - y / rows) * height;
    }
    this.rest = this.positions.slice();
    const connect = (a: number, b: number, stiffness: number) => {
      const dx = this.rest[a * 3] - this.rest[b * 3], dy = this.rest[a * 3 + 1] - this.rest[b * 3 + 1];
      this.springs.push({ a, b, length: Math.hypot(dx, dy), stiffness });
    };
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
      const i = y * (columns + 1) + x;
      if (x < columns) connect(i, i + 1, 110);
      if (y < rows) connect(i, i + columns + 1, 110);
      if (x < columns && y < rows) {
        connect(i, i + columns + 2, 55);
        connect(i + 1, i + columns + 1, 55);
      }
    }
  }
  step(dt: number, progress: number, centerX: number, centerY: number) {
    const p = Math.max(0, Math.min(1, progress));
    const { positions: q, velocities: v, forces: f } = this;
    f.fill(0);
    // Rest lengths contract as the sheet approaches the horizon. Anchors release gradually.
    const contraction = 1 - .985 * smooth(.15, .94, p);
    const anchor = 80 * Math.pow(1 - p, 4);
    for (const spring of this.springs) {
      const a = spring.a * 3, b = spring.b * 3;
      const dx = q[b] - q[a], dy = q[b + 1] - q[a + 1], dz = q[b + 2] - q[a + 2];
      const length = Math.max(.01, Math.hypot(dx, dy, dz));
      const force = spring.stiffness * (length - spring.length * contraction) / length;
      for (let axis = 0; axis < 3; axis++) {
        const value = (q[b + axis] - q[a + axis]) * force;
        f[a + axis] += value; f[b + axis] -= value;
      }
    }
    const gravity = Math.max(this.width, this.height) * 140000 * p * p;
    for (let n = 0; n < this.absorbed.length; n++) {
      const i = n * 3, dx = centerX - q[i], dy = centerY - q[i + 1];
      const radius = Math.max(1, Math.hypot(dx, dy));
      if (this.absorbed[n] || (p > .12 && radius < 28 + p * 25)) {
        this.absorbed[n] = 1;
        q[i] = centerX; q[i + 1] = centerY; q[i + 2] = -180;
        v[i] = v[i + 1] = v[i + 2] = 0;
        continue;
      }
      const acceleration = gravity / (radius * radius + 18000);
      f[i] += dx / radius * acceleration - dy / radius * 150 * p;
      f[i + 1] += dy / radius * acceleration + dx / radius * 150 * p;
      // Differential attraction bends the sheet into a funnel, rather than scaling a flat screenshot.
      f[i + 2] += (-180 * Math.exp(-radius / 220) * p - q[i + 2]) * 30;
      for (let axis = 0; axis < 3; axis++) {
        f[i + axis] += (this.rest[i + axis] - q[i + axis]) * anchor;
        v[i + axis] = (v[i + axis] + f[i + axis] * dt) * Math.exp(-2.1 * dt);
        q[i + axis] += v[i + axis] * dt;
      }
    }
  }
  get captured() { return this.absorbed.reduce((sum, x) => sum + x, 0); }
}
export function smooth(a: number, b: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
