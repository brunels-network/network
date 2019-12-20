
import React from 'react';
import Iframe from 'react-iframe';

import styles from './OverlayBox.module.css';

function OverlayBox(props){
  let item = props.item;

  let url = null;

  if (item && item.getURL){
    url = item.getURL();
  }

  if (!url){
    return (<div className={styles.container}>
              <div className={styles.centerContainer}>
                There is nothing to display!
                {item}
                <div>
                  <button className={styles.button}
                          onClick={props.emitClose}>Close</button>
                </div>
              </div>
            </div>);
  }

  return (<div className={styles.container}>
            <div className={styles.url}>{url}</div>
            <div>
              <Iframe url={url}
                      height="95%"
                      width="100%"
                      position="absolute"
                      sandbox="allow-scripts" />
            </div>
          </div>
         );
}

export default OverlayBox;
