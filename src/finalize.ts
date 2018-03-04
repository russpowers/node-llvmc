import * as weak from 'weak';

// Call the given callback on the object immediately prior to garbage collection.
export function finalize<T extends object>(obj: T, callback: (this: T) => void) {
    const weakref = weak(obj);

    weak(obj, function () {
        // We avoid closing over obj here because that reference would keep obj alive
        // and the callback would never get triggered.
        const strongref = weak.get(weakref);
        if (!strongref) {
            return;
        }

        callback.call(strongref);
    });
}
