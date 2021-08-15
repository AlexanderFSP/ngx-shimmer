export class IntendedError extends Error {
  public readonly intention: string = 'forcePromiseReject';
}
