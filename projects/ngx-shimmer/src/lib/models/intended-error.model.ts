export class IntendedError extends Error {
  date: Date;
  intention: string;

  constructor(intention = 'forcePromiseReject', ...params) {
    super(...params);
    this.date = new Date();
    this.intention = intention;
  }
}
