const AppError = require('../../utils/AppError');

describe('AppError', () => {
  it('creates an operational error with status and statusCode', () => {
    const error = new AppError('test message', 404);

    expect(error.message).toBe('test message');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });
});
