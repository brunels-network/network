
import React from "react";

import Timeout from "./Timeout";

import styles from "./WelcomePage.module.css";

function WelcomePage(props){

  const { useState } = React;
  const [showSecond, setShowSecond] = useState(false);

  if (showSecond){
    let filename = "images/welcome/welcome2.png";

    return (
      <div className={styles.ui_main}
           onClick={props.emitCloseWelcome}>
        <img className={styles.image} data-testid="bioImage"
             src={require(`../${filename}`)} alt="Welcome 2 page" />
        <Timeout last_interaction_time={new Date()}
                 timeout={props.timeout}
                 emitReload={props.emitReload}/>
      </div>
    );
  } else {
    let filename = "images/welcome/welcome1.png";

    return (
      <div className={styles.ui_main}
           onClick={()=>{setShowSecond(true)}}>
      <img className={styles.image} data-testid="bioImage"
           src={require(`../${filename}`)} alt="Welcome 1 page" />
      </div>
    );
  }
}

export default WelcomePage;
