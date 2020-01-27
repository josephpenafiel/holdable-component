import React from "react";
import Holdable, { IHoldableData } from "./components/Holdable/Holdable";

export interface AppProps { }

export interface AppState extends IHoldableData {
  limit?: number;
  progress: number;
  other?: number;
}

class App extends React.Component<AppProps, AppState> {

  state = {
    isDone: true,
    value: 0,
    isHeld: false,
    other: 0,
    progress: 0,
  }


  holdableHandler = (holdableData: AppState) => {
    this.setState(holdableData);
    if (this.state.isDone) {
      console.log('hold event finished!');
      console.log('doing business logic');
      this.setState({ value: 0, isHeld: false, progress: 0, isDone: true })
    }
  }

  n = 0;
  timer = setInterval(() => {
    this.n++;
    this.setState({ other: this.n });
  }, 1000);
  render() {

    return (
      <div>
        <p>holdable value: {this.state.value}</p>
        <p>App state value: {this.state.other}</p>
        <Holdable callbackData={this.holdableHandler}
          limitMs={500}>
          <button className="btn btn-dark">Other button</button>
        </Holdable>
        {this.state.isHeld ? null : <p>hold to action</p>}
        {this.state.isHeld ? <progress value={this.state.progress} max="100"></progress> : null}

      </div>
    )
  }
}
export default App;
