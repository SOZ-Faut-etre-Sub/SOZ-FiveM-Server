type ResultOk<R> = {
    ok: R;
};

type ResultErr<E> = {
    err: E;
};

export type Result<R, E> = ResultOk<R> | ResultErr<E>;

export const Ok = <R, E>(ok: R): Result<R, E> => {
    return { ok };
};

export const Err = <R, E>(err: E): Result<R, E> => {
    return { err };
};

export const isOk = <R, E>(result: Result<R, E>): result is ResultOk<R> => {
    return 'ok' in result;
};

export const isErr = <R, E>(result: Result<R, E>): result is ResultErr<E> => {
    return 'err' in result;
};
