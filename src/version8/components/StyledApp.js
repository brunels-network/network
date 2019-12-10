import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './StyledApp.styles';
import injectSheet from 'react-jss';

class App extends Component {
  state = {
    showList: true,
    highlightedHobby: false,
  };

  switch = () => {
    this.setState(prevState => ({
      showList: !prevState.showList,
    }));
  };

  listSwitch = () => {
    this.setState(state => ({
      highlightedHobby: !state.highlightedHobby,
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <button
          className={classes.display}
          onClick={this.switch}
        >
          Obinna
        </button>
        <CSSTransition
          in={this.state.showList}
          timeout={400}
          classNames="list-transition"
          unmountOnExit
          classNames={{
            enter: classes.listTransitionEnter,
            enterActive:
              classes.listTransitionEnterActive,
            exit: classes.listTransitionExit,
            exitActive:
              classes.listTransitionExitActive,
          }}
        >
          <div className={classes.listBody}>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                Writing JavaScript
              </li>
              <li className={classes.listItem}>
                Running
              </li>
              <li className={classes.listItem}>
                Technical Writing
              </li>
              <li className={classes.listItem}>
                Writing Clean code
              </li>
            </ul>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

const StyledApp = injectSheet(styles)(App);

export default StyledApp;
