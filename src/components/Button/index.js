import React, { Component } from "react";
import PropTypes from "prop-types";

class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;
    return (
      <button
        onClick={onClick}
        className={className}
        children={children}
        type="button"
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

Button.defaultProps = {
  className: ""
};

export default Button;
