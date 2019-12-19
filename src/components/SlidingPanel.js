
import React from "react";
import {CSSTransition} from "react-transition-group";

import styles from './SlidingPanel.module.css'
import SlideFromLeft from './transitions/SlideFromLeft.module.css';
import SlideFromRight from './transitions/SlideFromRight.module.css';
import SlideFromBottom from './transitions/SlideFromBottom.module.css';
import SlideFromTop from './transitions/SlideFromTop.module.css';

function SlidingPanel({children, isOpen=false, position="right", }){
  let container = styles.rightContainer;
  let transition = SlideFromRight;

  if (position === "right"){
    container = styles.rightContainer;
    transition = SlideFromRight;
  }
  else if (position === "bottom"){
    container = styles.bottomContainer;
    transition = SlideFromBottom;
  }
  else if (position === "top"){
    container = styles.topContainer;
    transition = SlideFromTop;
  }
  else if (position === "left"){
    container = styles.leftContainer;
    transition = SlideFromLeft;
  }

  container = `${container} ${styles.container}`;

  return (<CSSTransition in={isOpen}
                         timeout={200}
                         classNames={transition}
                         unmountOnExit>
            <div className={container}>
              {children}
            </div>
          </CSSTransition>);
};

export default SlidingPanel;
