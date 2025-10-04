import React, { useState } from 'react';

function CategoryManagement({ categories, setCategories }) {
  const [newCategory, setNewCategory] = useState({ name: '', color: '#000000' });
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const addCategory = () => {
    if (newCategory.name.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }
    
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories([...categories, { ...newCategory, id: newId }]);
    setNewCategory({ name: '', color: '#000000' });
  };

  const startEditing = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setNewCategory({ name: category.name, color: category.color });
  };

  const updateCategory = () => {
    if (newCategory.name.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }
    
    setCategories(
      categories.map(c => 
        c.id === currentCategory.id 
          ? { ...c, name: newCategory.name, color: newCategory.color } 
          : c
      )
    );
    
    setEditMode(false);
    setCurrentCategory(null);
    setNewCategory({ name: '', color: '#000000' });
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="categories-container">
      <h2>Category Management</h2>
      
      <div className="category-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Category name"
          />
        </div>
        
        <div className="form-group">
          <label>Color:</label>
          <input
            type="color"
            value={newCategory.color}
            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
          />
        </div>
        
        <button onClick={editMode ? updateCategory : addCategory}>
          {editMode ? 'Update Category' : 'Add Category'}
        </button>
        
        {editMode && (
          <button 
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              setCurrentCategory(null);
              setNewCategory({ name: '', color: '#000000' });
            }}
          >
            Cancel
          </button>
        )}
      </div>
      
      <div className="categories-list">
        <h3>Existing Categories</h3>
        
        {categories.length > 0 ? (
          <table className="categories-table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>
                    <div 
                      className="color-box" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </td>
                  <td>{category.name}</td>
                  <td>
                    <button className="edit-button" onClick={() => startEditing(category)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteCategory(category.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
}

export default CategoryManagement;
