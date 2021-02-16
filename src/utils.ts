export function pick<K extends keyof T, T>(props: readonly K[], o: T): Pick<T, K> {
  const result = {} as T;

  for (const prop of props) {
    const { [prop]: value } = o;

    result[prop] = value;
  }

  return result;
}
