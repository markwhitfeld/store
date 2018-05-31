import { TestBed } from '@angular/core/testing';

import { NgxsModule, State, Store, Action, StateContext, InitState, UpdateState } from '@ngxs/store';

import { NgxsDevModePluginModule } from '../';
import { Injectable, ErrorHandler } from '@angular/core';
import { NoopErrorHandler } from '@ngxs/store/tests/helpers/utils';

describe('NgxsDevModePlugin', () => {
  class Increment {
    static type = 'INCREMENT';
    constructor(public amount: number = 1) {}
  }

  interface StateModel {
    count: number;
  }

  it('should not give errors for normal operation', () => {
    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(Increment)
      increment({ getState, setState }: StateContext<StateModel>, { amount }: Increment) {
        setState({ count: Number(getState().count) + amount });
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()]
    });

    const store = <Store>TestBed.get(Store);
    const observedCallbacks = [];

    store.dispatch(new Increment()).subscribe({
      next: () => observedCallbacks.push('next'),
      error: error => observedCallbacks.push('error: ' + error),
      complete: () => observedCallbacks.push('complete')
    });

    expect(observedCallbacks).toEqual(['next', 'complete']);
  });

  it('should give an error if the default state is mutated by the InitState action', () => {
    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(InitState)
      init({ getState, setState }: StateContext<StateModel>) {
        const state = getState();
        state.count = Number(getState().count) + 1;
        setState(state);
      }
    }

    const observedErrors = [];
    @Injectable()
    class CustomErrorHandler implements ErrorHandler {
      handleError(error: any) {
        observedErrors.push('error: ' + error);
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [
        {
          provide: ErrorHandler,
          useClass: CustomErrorHandler
        }
      ]
    });
    TestBed.get(Store);

    expect(observedErrors).toEqual([
      `error: TypeError: Cannot assign to read only property 'count' of object '[object Object]'`
    ]);
  });

  it('should give an error if the default state is mutated by the UpdateState action', () => {
    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(UpdateState)
      updateState({ getState, setState }: StateContext<StateModel>) {
        const state = getState();
        state.count = Number(getState().count) + 1;
        console.log('blah');
        setState(state);
      }
    }

    const observedErrors = [];
    @Injectable()
    class CustomErrorHandler implements ErrorHandler {
      handleError(error: any) {
        observedErrors.push('error: ' + error);
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), NgxsModule.forFeature([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [
        {
          provide: ErrorHandler,
          useClass: CustomErrorHandler
        }
      ]
    });
    TestBed.get(Store);

    expect(observedErrors).toEqual([
      `error: TypeError: Cannot assign to read only property 'count' of object '[object Object]'`
    ]);
  });

  it('should give an error if the default state is mutatued by a handler', () => {
    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(Increment)
      mutatingIncrement({ getState, setState }: StateContext<StateModel>, { amount }: Increment) {
        const state = getState();
        state.count = Number(getState().count) + amount;
        setState(state);
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [{ provide: ErrorHandler, useClass: NoopErrorHandler }]
    });

    const store = <Store>TestBed.get(Store);
    const observedCallbacks = [];

    store.dispatch(new Increment()).subscribe({
      next: () => observedCallbacks.push('next'),
      error: error => observedCallbacks.push('error: ' + error),
      complete: () => observedCallbacks.push('complete')
    });

    expect(observedCallbacks).toEqual([
      `error: TypeError: Cannot assign to read only property 'count' of object '[object Object]'`
    ]);
  });

  it('should give an error if the state is mutatued by a handler', () => {
    class Reset {
      static type = 'RESET';
    }

    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(Reset)
      reset({ setState }) {
        setState({ count: 0 });
      }

      @Action(Increment)
      mutatingIncrement({ getState, setState }: StateContext<StateModel>, { amount }: Increment) {
        const state = getState();
        state.count = Number(getState().count) + amount;
        setState(state);
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [{ provide: ErrorHandler, useClass: NoopErrorHandler }]
    });

    const store = <Store>TestBed.get(Store);
    const observedCallbacks = [];

    store.dispatch(new Reset());
    store.dispatch(new Increment()).subscribe({
      next: () => observedCallbacks.push('next'),
      error: error => observedCallbacks.push('error: ' + error),
      complete: () => observedCallbacks.push('complete')
    });

    expect(observedCallbacks).toEqual([
      `error: TypeError: Cannot assign to read only property 'count' of object '[object Object]'`
    ]);
  });

  it('should give an error if the action is mutatued by a handler', () => {
    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(Increment)
      mutatingIncrement({ getState, setState }: StateContext<StateModel>, action: Increment) {
        action.amount++;
        setState({ count: Number(getState().count) + action.amount });
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [{ provide: ErrorHandler, useClass: NoopErrorHandler }]
    });

    const store = <Store>TestBed.get(Store);
    const observedCallbacks = [];

    store.dispatch(new Increment()).subscribe({
      next: () => observedCallbacks.push('next'),
      error: error => observedCallbacks.push('error: ' + error),
      complete: () => observedCallbacks.push('complete')
    });

    expect(observedCallbacks).toEqual([
      `error: TypeError: Cannot assign to read only property 'amount' of object '[object Object]'`
    ]);
  });

  it('should give an error if a child action is mutatued by a handler', () => {
    class Start {
      static type = 'START';
    }

    @State<StateModel>({
      name: 'counter',
      defaults: { count: 0 }
    })
    class MyStore {
      @Action(Start)
      start({ dispatch }: StateContext<StateModel>, action: Increment) {
        return dispatch(new Increment());
      }

      @Action(Increment)
      mutatingIncrement({ getState, setState }: StateContext<StateModel>, action: Increment) {
        action.amount++;
        setState({ count: Number(getState().count) + action.amount });
      }
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MyStore]), NgxsDevModePluginModule.forRoot()],
      providers: [{ provide: ErrorHandler, useClass: NoopErrorHandler }]
    });

    const store = <Store>TestBed.get(Store);
    const observedCallbacks = [];

    store.dispatch(new Start()).subscribe({
      next: () => observedCallbacks.push('next'),
      error: error => observedCallbacks.push('error: ' + error),
      complete: () => observedCallbacks.push('complete')
    });

    expect(observedCallbacks).toEqual([
      `error: TypeError: Cannot assign to read only property 'amount' of object '[object Object]'`
    ]);
  });
});
