
import React from "react";

class Timeout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now_time: new Date(),
      timeout: props.timeout * 1000
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.setState({ now_time: new Date() }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render(){
    const now = this.state.now_time;
    const last_time = this.props.last_interaction_time;

    if (now - last_time > this.state.timeout){
      console.log("Ran out of time!");
      this.props.emitReload();
    }

    return <div></div>;
  }
};

export default Timeout;
