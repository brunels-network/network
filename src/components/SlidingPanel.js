
import React from "react";
import {CSSTransition} from "react-transition-group";

import styles from './SlidingPanel.module.css'
import SlideFromLeft from './transitions/SlideFromLeft.module.css';
import SlideFromRight from './transitions/SlideFromRight.module.css';
import SlideFromBottom from './transitions/SlideFromBottom.module.css';
import SlideFromTop from './transitions/SlideFromTop.module.css';

function SlidingPanel({children, isOpen=false, position="right",
                       size="40%", minSize="300px", maxSize=null, }){
  let container = styles.rightContainer;
  let transition = SlideFromRight;
  let horiz_size = {width:size, minWidth:minSize};
  let vert_size = {height:size, minHeight:minSize};

  if (maxSize){
    horiz_size.maxWidth = maxSize;
    vert_size.maxHeight = maxSize;
  }

  let style = horiz_size;

  if (position === "right"){
    container = styles.rightContainer;
    transition = SlideFromRight;
  }
  else if (position === "bottom"){
    container = styles.bottomContainer;
    transition = SlideFromBottom;
    style = vert_size;
  }
  else if (position === "top"){
    container = styles.topContainer;
    transition = SlideFromTop;
    style = vert_size;
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
            <div className={container} style={style}>
              {children}
            </div>
          </CSSTransition>);
};

export default SlidingPanel;
