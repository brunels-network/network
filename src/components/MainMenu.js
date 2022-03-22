import PropTypes from "prop-types";
import React from "react";

import VBox from "./VBox";
import moment from "moment";

import styles from "./MainMenu.module.css";

function MenuLabel(props) {
  return (
    <div className={styles.menu_label}
         onClick={props.onClick}>
      {props.children}
    </div>
  )
}


function MenuButton(props) {
  let onClick = null;

  if (props.onClick) {
    onClick = props.onClick;
  } else {
    onClick = () => null;
  }

  return (
    <button className={styles.menu_button} onClick={onClick}>
      {props.children}
    </button>
  );
}


class MainMenu extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.close();
      event.stopPropagation();
    }
  }

  render() {
    let unconnectedNodesText = this.props.unconnectedNodesVisible ? "Visible" : "Invisible";
    let ncEngineersText = this.props.ncEngineersVisible ? "Visible" : "Invisible";

    return (
      <div data-testid="AnalysisPanel" ref={this.setWrapperRef} className={styles.panel}>
        <VBox>
          <MenuButton
              onClick={() => {
                this.props.close();
              }}
          >
            ⤆ Close ⤆
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleSpiralOrder();
            }}>
            Current<br/>Spiral Order
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleSpiralOrder();
            }}
          >
            {this.props.spiralOrder}
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleNodeSize();
            }}>
            Current<br/>Node Size
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleNodeSize();
            }}
          >
            {this.props.sizeText}
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleFilter();
            }}
          >
            Current<br/>Filter
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleFilter();
            }}
          >
            {this.props.filterText}
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleUnconnectedNodesVisible();
            }}
          >
            Current<br/>Unconnected
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleUnconnectedNodesVisible();
            }}
          >
            {unconnectedNodesText}
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleNCEngineersVisible();
            }}
          >
            Current<br/>Non-contributers
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleNCEngineersVisible();
            }}
          >
            {ncEngineersText}
          </MenuButton>

          <MenuLabel
            onClick={() => {
              this.props.emitToggleSearch();
            }}
          >
            Current<br/>Search
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitToggleSearch();
            }}
          >
            {this.props.searchText}
          </MenuButton>

          <MenuLabel>
            Further Options
          </MenuLabel>
          <MenuButton
            onClick={() => {
              this.props.emitReload();
            }}
          >
            Reload
          </MenuButton>
        </VBox>
      </div>
    );
  }
}

MenuButton.propTypes = {
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

MenuLabel.propTypes = {
  children: PropTypes.object.isRequired,
}

MainMenu.propTypes = {
  close: PropTypes.func.isRequired,
  unconnectedNodesVisible: PropTypes.bool.isRequired,
  ncEngineersVisible: PropTypes.bool.isRequired,
  engineersFiltered: PropTypes.bool.isRequired,
  commercialFiltered: PropTypes.bool.isRequired,
  searchBios: PropTypes.bool.isRequired,
  searchHighlight: PropTypes.bool.isRequired,
  emitToggleFilterCommercial: PropTypes.func.isRequired,
  emitToggleFilterEngineering: PropTypes.func.isRequired,
  emitToggleUnconnectedNodesVisible: PropTypes.func.isRequired,
  emitToggleNCEngineersVisible: PropTypes.func.isRequired,
  emitSearchHighlightToggled: PropTypes.func.isRequired,
  emitSearchBiosToggled: PropTypes.func.isRequired,
};

export default MainMenu;
