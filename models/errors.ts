// models/errors.ts
export type Errors = { [key: string]: string | undefined };
export type Resolver = () => Errors;
