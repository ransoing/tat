/** a class decorator that defines static properties and methods a class must use */
export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}
