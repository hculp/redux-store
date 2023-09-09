import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_CATEGORIES } from '../../graphql/queries';

import { useCategoriesContext } from '../../context/CategoriesContext';

import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const { categories, updateCategories, updateCurrentCategory } = useCategoriesContext();

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      updateCategories(categoryData.categories);
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get')
        .then(savedCategories => updateCategories(savedCategories));
    }
  }, [categoryData, loading]);

  const handleClick = categoryId => updateCurrentCategory(categoryId);

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
