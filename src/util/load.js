export default function load (name) {
  return require(path.join('../../../../build/src', name));
}
