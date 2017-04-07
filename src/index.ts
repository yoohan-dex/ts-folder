import * as Immutable from 'immutable';


export interface DefaultState {
  [prop: string]: any;
}

export default class Hello {
  private hey: string;
  constructor(defaultState: DefaultState) {
    this.hey = 'hello';
  }
}
