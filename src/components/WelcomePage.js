
import React from "react";

import styles from "./WelcomePage.module.css";

function WelcomePage(props){

  const { useState } = React;
  const [showSecond, setShowSecond] = useState(false);

  if (showSecond){
    return (
      <div className={styles.ui_main}
           onClick={props.emitCloseWelcome}>
        <div className={styles.welcome}>Second page</div>
      </div>
    );
  } else {
    return (
      <div className={styles.ui_main}
           onClick={()=>{setShowSecond(true)}}>
        <div className={styles.welcome}>Welcome Page</div>
      </div>
    );
  }
}

export default WelcomePage;
