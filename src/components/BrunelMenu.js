import React from "react";
import PropTypes from "prop-types";
import styles from "./BrunelMenu.module.css";

class BrunelMenu extends React.Component {
  constructor(props) {
    super(props);

    this.viewAbout = this.viewAbout.bind(this);
    this.viewSource = this.viewSource.bind(this);
  }

  viewAbout() {
    let item = (
      <div>
        <div>
          This is a demo of the application to view Brunel&apos;s temporal social network. This is an incomplete
          application containing incomplete data and should not be relied on or viewed as being accurate.
        </div>
        <div>
          If you want more information, then please visit the{" "}
          <a href="https://github.com/chryswoods/brunel">GitHub repository</a>
        </div>
      </div>
    );

    this.props.setOverlay(item);
  }

  viewSource() {
    var win = window.open("https://github.com/gareth-j/brunel", "_blank");
    win.focus();
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <button key="about" className={styles.menuItem} onClick={this.viewAbout}>
          About
        </button>
        <button key="about" className={styles.menuItem} onClick={this.viewSource}>
          Source
        </button>
        <button key="about" className={styles.menuItem} onClick={this.props.clickReset}>
          Reset
        </button>
      </div>
    );
  }
}

BrunelMenu.propTypes = {
  clickReset: PropTypes.func.isRequired,
  setOverlay: PropTypes.func.isRequired,
};

export default BrunelMenu;
