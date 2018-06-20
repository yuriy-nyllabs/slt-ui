import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '../styles/withStyles';
export const styles = theme => ({
  root: {
    marginRight: theme.spacing.unit * 2,
    color: theme.palette.action.active,
    flexShrink: 0
  }
});
/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */

function ListItemIcon(props) {
  const {
    children,
    classes,
    className: classNameProp
  } = props,
        other = _objectWithoutProperties(props, ["children", "classes", "className"]);

  return React.cloneElement(children, _objectSpread({
    className: classNames(classes.root, classNameProp, children.props.className)
  }, other));
}

ListItemIcon.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The content of the component, normally `Icon`, `SvgIcon`,
   * or a `@material-ui/icons` SVG icon element.
   */
  children: PropTypes.element.isRequired,

  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,

  /**
   * @ignore
   */
  className: PropTypes.string
} : {};
export default withStyles(styles, {
  name: 'MuiListItemIcon'
})(ListItemIcon);