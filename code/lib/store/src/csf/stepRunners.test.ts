import { PlayFunctionContext, StepRunner } from '@storybook/csf';
import { composeStepRunners } from './stepRunners';

describe('stepRunners', () => {
  it('composes each step runner', async () => {
    const order: string[] = [];

    const firstStepRunner: StepRunner = async (label, play, ctx) => {
      order.push(`first-${label}-start`);
      await play(ctx);
      order.push(`first-${label}-end`);
    };

    const secondStepRunner: StepRunner = async (label, play, ctx) => {
      order.push(`second-${label}-start`);
      await play(ctx);
      order.push(`second-${label}-end`);
    };

    const composed = composeStepRunners([firstStepRunner, secondStepRunner]);

    const playFnA = jest.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = jest.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
    expect(order).toEqual([
      'first-a-start',
      'second-a-start',
      'second-a-end',
      'first-a-end',
      'first-b-start',
      'second-b-start',
      'second-b-end',
      'first-b-end',
    ]);
  });

  it('creates a sensible default if no step runner is provided', async () => {
    const composed = composeStepRunners([]);

    const playFnA = jest.fn();
    const playContextA = {} as PlayFunctionContext;
    await composed('a', playFnA, playContextA);
    const playFnB = jest.fn();
    const playContextB = {} as PlayFunctionContext;
    await composed('b', playFnB, playContextB);

    expect(playFnA).toHaveBeenCalledTimes(1);
    expect(playFnA).toHaveBeenCalledWith(playContextA);
    expect(playFnB).toHaveBeenCalledTimes(1);
    expect(playFnB).toHaveBeenCalledWith(playContextB);
  });
});
