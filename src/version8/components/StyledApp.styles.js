const startTransitionStyles = {
  top: 0,
  width: '120px',
  maxHeight: '40px',
  color: 'transparent',
  backgroundColor: '#5a564c',
};

const finishTransitionStyles = {
  top: '45px',
  width: '200px',
  maxHeight: '200px',
  backgroundColor: '#9e8949',
};

const styles = {
  container: {
    position: 'relative',
  },

  display: {
    position: 'relative',
    zindex: '1',
    width: '120px',
    height: '40px',
    backgroundColor: '#5a564c',
    border: 'none',
    borderRadius: '5px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'backgroundColor 350ms',
  },

  displayActive: {
    backgroundColor: '#000000',
  },

  listBody: {
    position: 'absolute',
    top: '45px',
    Zindex: '1',
    boxSizing: 'border-box',
    width: '200px',
    padding: '0 20px',
    overflow: 'hidden',
    backgroundColor: '#9e8949',
    borderRadius: '5px',
  },

  list: {
    padding: '0',
    listStyleType: 'none',
  },

  listItem: {
    padding: '5px 0',
  },

  listItemActive: {
    color: 'blue',
    transition: 'color 500ms',
  },
  listTransitionEnter: {
    ...startTransitionStyles,
  },
  listTransitionEnterActive: {
    ...finishTransitionStyles,
    transition: 'all 400ms',
  },
  listTransitionExit: {
    ...finishTransitionStyles,
  },
  listTransitionExitActive: {
    ...startTransitionStyles,
    transition: 'all 400ms',
  },
};

export default styles;
