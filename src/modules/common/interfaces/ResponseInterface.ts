export interface CommonError {
    message:string;
    e:null
}

export interface ResponseInterface<T,ErrorT> {
    data: T | null;
    ok: boolean;
    error: ErrorT | unknown
}
  