import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
// import the useDispatch and useSelector hooks from react-redux to handle store actions and state
import { useDispatch, useSelector } from 'react-redux';

import { QUERY_CATEGORIES } from '../../graphql/queries';
// import the category actions from the redux store
import { categoryActions } from '../../store/category.slice';

import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  // initialize the dispatch and the categories state variables from the redux store
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      // dispatch the updateCategories action with the data from the idbPromise
      dispatch(
        categoryActions.updateCategories({
          categories: categoryData.categories,
        })
      );
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(savedCategories => {
        // dispatch the updateCategories action with the data from the idbPromise
        dispatch(
          categoryActions.updateCategories({
            categories: savedCategories,
          })
        );
      });
    }
    // add dispatch to the dependency array so that state changees call useEffect again
  }, [categoryData, loading, dispatch]);

  const handleClick = categoryId => {
    // dispatch the updateCurrentCategory action when a category button is clicked
    dispatch(
      categoryActions.updateCurrentCategory({
        currentCategory: categoryId,
      })
    );
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          type="button"
          key={item._id}
          onClick={() => handleClick(item._id)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
