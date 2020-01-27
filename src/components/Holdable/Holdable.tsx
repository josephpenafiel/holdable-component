import React, { ReactElement } from "react";
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, tap, filter } from 'rxjs/operators';

export interface HoldableProps {
  limitMs: number; // ms to cancel event
  callbackData: Function;
}

export interface HoldableState {
}

export interface IHoldableData {
  value?: number; // interval value
  isHeld?: boolean;
  progress?: number; // value from 0 to 100 (100 indicates end of event)
  isDone: boolean; // indicates if hold event has terminated
}

class Holdable extends React.Component<HoldableProps, HoldableState> {

  cancel: Observable<string>;
  holdableState: Subject<string> = new Subject();

  constructor(props: HoldableProps) {
    super(props);
    this.cancel = this.holdableState.pipe(
      filter(v => v === 'cancel'),
      tap(v => {
        this.props.callbackData({ value: 0, isHeld: false, progress: 0, isDone: true })
      })
    );
  }

  onExit = () => {
    // this.props.callbackData({ isDone: true });
    this.holdableState.next('cancel');
    console.log('hold canceled');
  }

  onHold = () => {
    this.holdableState.next('start');
    console.log('being holded');
    const n = 10;
    interval(n)
      .pipe(
        takeUntil(this.cancel),
        tap(v => {
          this.props.callbackData({ isDone: false, value: v * n, isHeld: true, progress: (v * n / this.props.limitMs) * 100 });
          if (v * n >= this.props.limitMs) this.holdableState.next('cancel');
        })
      )
      .subscribe();
  }

  child = React.cloneElement(
    this.props.children as React.ReactElement<any>,
    {
      onMouseDown: this.onHold,
      onMouseLeave: this.onExit,
      onMouseUp: this.onExit
    }
  );

  render() {
    return (
      <div>
        {this.child}
      </div>
    );
  }
}

export default Holdable;