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
