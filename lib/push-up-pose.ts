import * as THREE from "three";

/** Two fixed-length arm segments meeting a planted wrist. */
export function solveElbow(shoulder: THREE.Vector3, wrist: THREE.Vector3, side: number) {
  const upper = .32, forearm = .33;
  const direction = wrist.clone().sub(shoulder);
  const distance = direction.length();
  direction.normalize();
  const along = (upper * upper - forearm * forearm + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  const bend = new THREE.Vector3(side, 0, .65);
  bend.addScaledVector(direction, -bend.dot(direction)).normalize();
  return shoulder.clone().addScaledVector(direction, along).addScaledVector(bend, height);
}

export function pushUpPose(time: number) {
  // One controlled repetition every 2.6 seconds; start at the top of the movement.
  const rise = (1 + Math.cos(time * Math.PI * 2 / 2.6)) / 2;
  const hips = new THREE.Vector3(0, .28 + .15 * rise, .25);
  const ankle = new THREE.Vector3(0, .20, 1.10);
  const up = hips.clone().sub(ankle).normalize();
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
  const arms = [-1, 1].map(side => {
    const shoulder = new THREE.Vector3(side * .27, .58, -.015).applyQuaternion(rotation).add(hips);
    const wrist = new THREE.Vector3(side * .36, .065, -.47);
    return { shoulder, wrist, elbow: solveElbow(shoulder, wrist, side) };
  });
  return { hips, rotation, arms, rise };
}
