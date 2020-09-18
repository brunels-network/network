
import React from "react";
import PropTypes from "prop-types";

import BigBox from "./BigBox";

import styles from "./HBox.module.css";


function _wrap(child, i) {
    if (!child) {
        return null;
    }
    else if (child.type === BigBox) {
        return child;
    }
    else {
        return (
            <div key={i} className={styles.child}>
                {child}
            </div>);
    }
}

class HBox extends React.Component {
    render(){
        let parts = [];

        for (let i = 0; i < this.props.children.length; ++i) {
            if (this.props.children[i] !== null) {
                parts.push(_wrap(this.props.children[i], i));
            }
        }

        return (
            <div className={styles.hbox}>
                {parts}
            </div>);
    }
}


HBox.propTypes = {
    children: PropTypes.any,
}

export default HBox;
