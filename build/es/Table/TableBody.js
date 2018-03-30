import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '../styles/withStyles';

const styles = {
  root: {
    display: 'table-row-group'
  }
};

class TableBody extends React.Component {
  getChildContext() {
    // eslint-disable-line class-methods-use-this
    return {
      table: {
        body: true
      }
    };
  }

  render() {
    const _props = this.props,
          { classes, className: classNameProp, component: Component } = _props,
          other = _objectWithoutProperties(_props, ['classes', 'className', 'component']);

    return React.createElement(Component, _extends({ className: classNames(classes.root, classNameProp) }, other));
  }
}

TableBody.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The content of the component, normally `TableRow`.
   */
  children: PropTypes.node.isRequired,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
} : {};

TableBody.defaultProps = {
  component: 'tbody'
};

TableBody.childContextTypes = {
  table: PropTypes.object
};

export default withStyles(styles, { name: 'MuiTableBody' })(TableBody);