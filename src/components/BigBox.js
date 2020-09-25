
import React from "react";
import PropTypes from "prop-types";

import styles from "./BigBox.module.css";


class BigBox extends React.Component {
    render(){
        return (
            <div className={styles.bigbox}>
                {this.props.children}
            </div>);
    }
}


BigBox.propTypes = {
    children: PropTypes.any,
}

export default BigBox;
