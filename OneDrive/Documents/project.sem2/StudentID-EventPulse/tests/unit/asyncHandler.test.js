const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  it('calls the wrapped function and passes through success', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const wrapped = asyncHandler(async (reqArg, resArg, nextArg) => {
      expect(reqArg).toBe(req);
      expect(resArg).toBe(res);
      expect(nextArg).toBe(next);
    });

    await wrapped(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes errors to next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const error = new Error('boom');

    const wrapped = asyncHandler(async () => {
      throw error;
    });

    await wrapped(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
