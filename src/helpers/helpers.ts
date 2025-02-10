export function transformObject(object: any = {}) {
  delete object._id;
  delete object.id;

  return object;
}