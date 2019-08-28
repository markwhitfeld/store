import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { throwError, of, merge } from 'rxjs';

import { NgxsModule, Store, State, Action, StateContext } from '@ngxs/store';
import { NoopErrorHandler } from '@ngxs/store/tests/helpers/utils';
import { StateClass } from '@ngxs/store/internals';

import { NgxsLoggerPluginModule, NgxsLoggerPluginOptions } from '../';
import { LoggerSpy } from './helpers';
import { tap, delay, flatMap } from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';

describe('NgxsLoggerPlugin', () => {
  const GREY_STYLE = 'color: #9E9E9E; font-weight: bold';
  const GREEN_STYLE = 'color: #4CAF50; font-weight: bold';
  const REDISH_STYLE = 'color: #FD8182; font-weight: bold';

  class UpdateBarAction {
    static type = 'UPDATE_BAR';

    constructor(public bar: string = 'baz') {}
  }

  class AsyncAction {
    static type = 'ASYNC_ACTION';

    constructor(public bar?: string) {}
  }

  class ErrorAction {
    static type = 'ERROR';
  }

  class AsyncError {
    static type = 'ASYNC_ERROR';
    constructor(public message: string) {}
  }

  interface StateModel {
    bar: string;
  }

  function setup(states: StateClass[], opts?: NgxsLoggerPluginOptions) {
    const logger = new LoggerSpy();

    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot(states),
        NgxsLoggerPluginModule.forRoot({
          ...opts,
          logger
        })
      ],
      providers: [{ provide: ErrorHandler, useClass: NoopErrorHandler }]
    });

    const store: Store = TestBed.get(Store);

    return {
      store,
      logger
    };
  }

  it('should log init action success with colors', () => {
    // Arrange & Act
    const stateModelDefaults: StateModel = { bar: '' };
    @State<StateModel>({ name: 'test', defaults: stateModelDefaults })
    class TestState {}

    const { logger } = setup([TestState]);
    // Assert
    const expectedCallStack = [
      ['group', 'action @@INIT (started @ )'],
      ['log', '%c prev state', GREY_STYLE, { test: stateModelDefaults }],
      ['log', '%c next state', GREEN_STYLE, { test: stateModelDefaults }],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log init action success with new init payload', () => {
    // Arrange & Act
    const stateModelDefaults: StateModel = { bar: '' };
    @State<StateModel>({ name: 'test', defaults: stateModelDefaults })
    class TestState {}

    const { logger } = setup([TestState]);
    // Assert
    const expectedCallStack = [
      ['group', 'action @@INIT (started @ )'],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state', GREEN_STYLE, { test: { bar: '' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log success action with payload', () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(UpdateBarAction)
      updateBar({ patchState }: StateContext<StateModel>, { bar }: UpdateBarAction) {
        patchState({ bar });
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();
    const payload = 'qux';

    // Act
    store.dispatch(new UpdateBarAction(payload));

    // Assert
    const expectedCallStack = [
      ['group', 'action UPDATE_BAR (started @ )'],
      ['log', '%c payload', GREY_STYLE, { bar: 'qux' }],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state', GREEN_STYLE, { test: { bar: 'qux' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log async success action', async () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(AsyncAction)
      asyncAction({ patchState }: StateContext<StateModel>, { bar }: AsyncAction) {
        patchState({ bar: '...' });
        return of(null).pipe(
          delay(1),
          tap(() => {
            patchState({ bar });
          })
        );
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();
    const payload = 'qux';

    // Act
    const promise = store.dispatch(new AsyncAction(payload)).toPromise();
    logger.log('Some other work');
    await promise;

    // Assert
    const expectedCallStack = [
      ['group', 'action ASYNC_ACTION (started @ )'],
      ['log', '%c payload', GREY_STYLE, { bar: 'qux' }],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: '...' } }],
      ['log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      ['groupEnd'],
      ['log', 'Some other work'],
      ['group', '(async work completed) action ASYNC_ACTION (started @ )'],
      ['log', '%c next state', GREEN_STYLE, { test: { bar: 'qux' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log error action with colors', () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(ErrorAction)
      error() {
        return throwError(new Error('My Error'));
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();

    // Act
    store.dispatch(new ErrorAction());

    // Assert
    const expectedCallStack = [
      ['group', 'action ERROR (started @ )'],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state after error', REDISH_STYLE, { test: { bar: '' } }],
      ['log', '%c error', REDISH_STYLE, new Error('My Error')],
      ['groupEnd']
    ];

    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log async error action', async () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(AsyncError)
      asyncErrorAction({ patchState }: StateContext<StateModel>, { message }: AsyncError) {
        patchState({ bar: '...' });
        return of(null).pipe(
          delay(1),
          tap(() => {
            patchState({ bar: 'erroring' });
            throw new Error(message);
          })
        );
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();
    const errorMessage = 'qux error';

    // Act
    const promise = store.dispatch(new AsyncError(errorMessage)).toPromise();
    logger.log('Some other work');
    try {
      await promise;
    } catch {}

    // Assert
    const expectedCallStack = [
      ['group', 'action ASYNC_ERROR (started @ )'],
      ['log', '%c payload', GREY_STYLE, { message: 'qux error' }],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: '...' } }],
      ['log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      ['groupEnd'],
      ['log', 'Some other work'],
      ['group', '(async work error) action ASYNC_ERROR (started @ )'],
      ['log', '%c next state after error', REDISH_STYLE, { test: { bar: 'erroring' } }],
      ['log', '%c error', REDISH_STYLE, new Error('qux error')],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should log collapsed success action', () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(UpdateBarAction)
      updateBar({ patchState }: StateContext<StateModel>, { bar }: UpdateBarAction) {
        patchState({ bar });
      }
    }

    const { store, logger } = setup([TestState], { collapsed: true });
    logger.clear();

    // Act
    store.dispatch(new UpdateBarAction());

    // Assert
    const expectedCallStack = [
      ['groupCollapsed', 'action UPDATE_BAR (started @ )'],
      ['log', '%c payload', GREY_STYLE, { bar: 'baz' }],
      ['log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      ['log', '%c next state', GREEN_STYLE, { test: { bar: 'baz' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack()).toEqual(expectedCallStack);
  });

  it('should not log while disabled', () => {
    // Arrange
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(UpdateBarAction)
      updateBar({ patchState }: StateContext<StateModel>, { bar }: UpdateBarAction) {
        patchState({ bar });
      }
    }

    const { store, logger } = setup([TestState], { disabled: true });

    // Act
    store.dispatch(new UpdateBarAction());

    // Assert
    expect(logger.getCallStack()).toEqual([]);
  });

  it('should log success actions for nested actions (acceptance test)', async () => {
    // Arrange

    class Action1 {
      static type = 'ACTION_1';
    }
    class Action2 {
      static type = 'ACTION_2';
    }
    class Action3 {
      static type = 'ACTION_3';
    }
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(Action1)
      action1({ patchState, dispatch }: StateContext<StateModel>) {
        patchState({ bar: 'A' });
        dispatch(new Action2());
      }

      @Action(Action2)
      action2({ setState }: StateContext<StateModel>) {
        setState(patch({ bar: val => val + 'B' }));
        // dispatch(new Action3());
      }

      @Action(Action3)
      action3({ setState }: StateContext<StateModel>) {
        setState(patch({ bar: val => val + 'C' }));
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();

    // Act
    store.dispatch(new Action1());

    // Assert
    const expectedCallStack = [
      ['group', 'action ACTION_1 (started @ )'],
      [' log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      [' group', 'action ACTION_2 (started @ )'],
      ['  log', '%c prev state', GREY_STYLE, { test: { bar: 'A' } }],
      ['  log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: 'A' } }],
      ['  log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      [' groupEnd'],
      [' group', '(async work completed) action ACTION_2 (started @ )'],
      ['  log', '%c next state', GREEN_STYLE, { test: { bar: 'AB' } }],
      [' groupEnd'],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'AB' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack({ indent: true })).toEqual(expectedCallStack);
  });

  it('should log async success actions for nested actions (acceptance test)', async () => {
    // Arrange

    class AsyncAction1 {
      static type = 'ASYNC_ACTION_1';
    }
    class AsyncAction1Inner {
      static type = 'ASYNC_ACTION_1_INNER';
    }
    class AsyncAction2 {
      static type = 'ASYNC_ACTION_2';
    }
    class AsyncAction2Inner {
      static type = 'ASYNC_ACTION_2_INNER';
    }
    class AsyncAction3 {
      static type = 'ASYNC_ACTION_3';
    }
    class AsyncAction3Inner {
      static type = 'ASYNC_ACTION_3_INNER';
    }
    @State<StateModel>({ name: 'test', defaults: { bar: '' } })
    class TestState {
      @Action(AsyncAction1)
      asyncAction1({ patchState, setState, dispatch }: StateContext<StateModel>) {
        patchState({ bar: 'A' });
        return merge(
          dispatch(new AsyncAction2()),
          of(null).pipe(
            delay(1),
            flatMap(() => {
              setState(patch({ bar: val => val + '1' }));
              return dispatch(new AsyncAction1Inner());
            })
          )
        );
      }

      @Action(AsyncAction2)
      asyncAction2({ setState, dispatch }: StateContext<StateModel>) {
        setState(patch({ bar: val => val + 'B' }));
        return merge(
          dispatch(new AsyncAction3()),
          of(null).pipe(
            delay(1),
            flatMap(() => {
              setState(patch({ bar: val => val + '2' }));
              return dispatch(new AsyncAction2Inner());
            })
          )
        );
      }

      @Action(AsyncAction3)
      asyncAction3({ setState, dispatch }: StateContext<StateModel>) {
        setState(patch({ bar: val => val + 'C' }));
        return of(null).pipe(
          delay(1),
          flatMap(() => {
            setState(patch({ bar: val => val + '3' }));
            return dispatch(new AsyncAction3Inner());
          })
        );
      }
    }

    const { store, logger } = setup([TestState]);
    logger.clear();

    // Act
    const promise = store.dispatch(new AsyncAction1()).toPromise();
    logger.log('Some other work');
    await promise;

    // Assert
    const expectedCallStack = [
      ['group', 'action ASYNC_ACTION_1 (started @ )'],
      [' log', '%c prev state', GREY_STYLE, { test: { bar: '' } }],
      [' group', 'action ASYNC_ACTION_2 (started @ )'],
      ['  log', '%c prev state', GREY_STYLE, { test: { bar: 'A' } }],
      ['  log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: 'A' } }],
      ['  log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      [' groupEnd'],
      [' group', 'action ASYNC_ACTION_3 (started @ )'],
      ['  log', '%c prev state', GREY_STYLE, { test: { bar: 'AB' } }],
      ['  log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: 'AB' } }],
      ['  log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      [' groupEnd'],
      [' log', '%c next state (synchronous)', GREEN_STYLE, { test: { bar: 'ABC' } }],
      [' log', '%c ( action doing async work... )', GREEN_STYLE, undefined],
      ['groupEnd'],
      ['log', 'Some other work'],
      ['group', 'action ASYNC_ACTION_1_INNER (started @ )'],
      [' log', '%c prev state', GREY_STYLE, { test: { bar: 'ABC1' } }],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC1' } }],
      ['groupEnd'],
      ['group', 'action ASYNC_ACTION_2_INNER (started @ )'],
      [' log', '%c prev state', GREY_STYLE, { test: { bar: 'ABC12' } }],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC12' } }],
      ['groupEnd'],
      ['group', 'action ASYNC_ACTION_3_INNER (started @ )'],
      [' log', '%c prev state', GREY_STYLE, { test: { bar: 'ABC123' } }],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC123' } }],
      ['groupEnd'],
      ['group', '(async work completed) action ASYNC_ACTION_3 (started @ )'],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC123' } }],
      ['groupEnd'],
      ['group', '(async work completed) action ASYNC_ACTION_2 (started @ )'],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC123' } }],
      ['groupEnd'],
      ['group', '(async work completed) action ASYNC_ACTION_1 (started @ )'],
      [' log', '%c next state', GREEN_STYLE, { test: { bar: 'ABC123' } }],
      ['groupEnd']
    ];
    expect(logger.getCallStack({ indent: true })).toEqual(expectedCallStack);
  });
});
