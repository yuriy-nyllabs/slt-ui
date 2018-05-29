import data from '../data';

const productComparisonReducer = (state = {}, action) => {
  let selection = state.selection.slice() || [];

  switch (action.type) {
    case 'REMOVE_ALL':
      return {
        ...state,
        selection: [],
      };
    case 'REMOVE_PRODUCT':
      for (let i = selection.length - 1; i >= 0; i--) {
        if (selection[i].id == action.productID) {
          selection.splice(i, 1);
          break;
        }
      }

      return {
        ...state,
        selection,
      };

    case 'TOGGLE_PRODUCT':
      if (action.checked) {
        selection.push(data[action.productID]);
      } else {
        for (let i = selection.length - 1; i >= 0; i--) {
          if (selection[i].id == action.productID) {
            selection.splice(i, 1);
            break;
          }
        }
      }

      return {
        ...state,
        selection,
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        selection: action.selection.slice(),
      };

    default:
      return {
        selection,
        ...state,
      };
  }
};

export default productComparisonReducer;
