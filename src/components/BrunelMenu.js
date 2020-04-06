import React from "react";

import styles from "./BrunelMenu.module.css";

function BrunelMenu(props) {
  if (!props.items) {
    return <div>No menu</div>;
  }

  let buttons = [];

  props.items.forEach((item, index) => {
    let func = item[1];

    // if (props.emitClose) {
    //   func = () => {
    //     props.emitClose();
    //     item[1]();
    //   };
    // }

    buttons.push(
      <button
        key={index}
        className={styles.menuItem}
        onClick={() => {
          func();
        }}
      >
        {item[0]}
      </button>
    );
  });

  return <div className={styles.menu}>{buttons}</div>;
}

export default BrunelMenu;
