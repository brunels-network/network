
import React from "react";
import PropTypes from "prop-types";

import HBox from "./HBox";
import BigBox from "./BigBox";

import Keyboard from "react-simple-keyboard";

import styles from "./SearchBar.module.css";

import 'react-simple-keyboard/build/css/index.css';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      layoutName: "default",
      showKeyboard: false,
    };
  }

  onChangeHandler(event) {
    let text = event.target.value;

    if (this.props.emitUpdate) {
      this.props.emitUpdate(text);
    }

    this.keyboard.setInput(text);
  }

  onSubmitHandler(event) {
    event.preventDefault();
  }

  onChange = (input) => {
    let last_text = this.props.searchText;

    if (input.endsWith("close")) {
      if (!last_text.endsWith("close")){
        this.keyboard.setInput(last_text);
        return;
      }
    } else if (input.endsWith("clear")){
      if (!last_text.endsWith("clear")){
        this.keyboard.setInput("");
        return;
      }
    } else if (input.endsWith("enter")){
      if (!last_text.endsWith("enter")){
        this.keyboard.setInput(last_text);
        return;
      }
    }

    if (this.props.emitUpdate) {
      this.props.emitUpdate(input);
    }
  }

  onKeyPress = (button) => {
    if (button === "{shift}") this.handleShift();

    if (button === "{lock}") this.handleCaps();

    if (button === "clear") this.handleClear();

    if (button === "close") this.handleClose();

    if (button === "enter") this.handleEnter();
  }

  handleClose = () => {
    this.setState({showKeyboard: false});
  }

  handleEnter = () => {
    this.setState({showKeyboard: false});
  }

  handleClear = () => {
    this.keyboard.setInput("");

    if (this.props.emitUpdate){
      this.props.emitUpdate("");
    }
  }

  handleShift = () => {
    let layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "shift" ? "default" : "shift"
    });
  };

  handleCaps = () => {
    let layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "caps" ? "default" : "caps"
    });
  };

  render() {
    let search_text = "";

    if (this.props.searchText) {
      search_text = this.props.searchText;
    }

    let clear_button = null;
    let link_button = null;

    if (search_text) {
      clear_button = (
        <div className={styles.clearButton}
             onClick={()=>{this.keyboard.setInput(""); this.props.emitUpdate("")}}
        >
          &nbsp;X&nbsp;
        </div>);

      if (this.props.searchHighlightAvailable) {
        let highlight = this.props.searchHighlightToggled;

        let link_style = styles.linkButton;

        if (highlight) {
          link_style = styles.linkButtonHighlighted;
        }

        link_button = (
          <div className={link_style}
            onClick={() => { this.props.emitSearchHighlightToggled(!highlight) }}
          >
            &nbsp;✺&nbsp;
          </div>);
      }
    }

    let keyboard = null;

    if (this.state.showKeyboard){
      const layout = {
        'default': [
          'clear 1 2 3 4 5 6 7 8 9 0 {bksp}',
          'close q w e r t y u i o p close',
          '{lock} a s d f g h j k l enter',
          '{shift} z x c v b n m {shift}',
          '{space}'
        ],
        'shift': [
          'clear 1 2 3 4 5 6 7 8 9 0 {bksp}',
          'close Q W E R T Y U I O P close',
          '{lock} A S D F G H J K L enter',
          '{shift} Z X C V B N M {shift}',
          '{space}'
        ],
        'caps': [
          'clear 1 2 3 4 5 6 7 8 9 0 {bksp}',
          'close Q W E R T Y U I O P close',
          '{lock} A S D F G H J K L enter',
          '{shift} Z X C V B N M {shift}',
          '{space}'
        ]
      };

      keyboard = (
        <div className={styles.keyboardHolder}>
          <Keyboard
            input={search_text}
            keyboardRef={r => (this.keyboard = r)}
            layoutName={this.state.layoutName}
            className={styles.keyboard}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            layout={layout}/>
        </div>
      );
    }

    return (
      <form className={styles.form}
        onSubmit={(e) => this.onSubmitHandler(e)} >
        <HBox>
          <BigBox>
            <input key="input" className={styles.input} type="search"
              onClick={()=>{
                this.props.emitUpdate("");
                this.setState({showKeyboard: true});
              }}
              onChange={(e) => this.onChangeHandler(e)}
              value={search_text}
              placeholder="Search..." />
          </BigBox>
          {link_button}
          {clear_button}
        </HBox>
        {keyboard}
      </form>
    );
  }
}

SearchBar.propTypes = {
  searchHighlightToggled: PropTypes.bool.isRequired,
  emitUpdate: PropTypes.func.isRequired,
  emitSearchHighlightToggled: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  searchHighlightAvailable: PropTypes.bool,
};



export default SearchBar;
