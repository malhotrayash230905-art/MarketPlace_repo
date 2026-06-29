import numpy as np
from sklearn.neighbors import NearestNeighbors

# Mock database of user-item interactions
# In reality, this would be generated from the Activity collection in MongoDB
# Rows: Users, Columns: Products, Values: Interaction weight (e.g., views)
mock_user_item_matrix = np.array([
    [5, 0, 3, 0, 1], # User A
    [4, 0, 0, 2, 0], # User B
    [0, 3, 0, 5, 0], # User C
    [0, 0, 4, 0, 4], # User D
])

# Mock product IDs corresponding to the columns
product_ids = ["prod_1", "prod_2", "prod_3", "prod_4", "prod_5"]

# Train the KNN model
# We use cosine similarity to find nearest neighbors
knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
knn_model.fit(mock_user_item_matrix)

def get_recommendations(user_id):
    """
    Returns recommended product IDs for a given user.
    Since we don't have real MongoDB ObjectIDs here, we use a mock mapping.
    """
    # For testing, we map any user_id string to a random row index 0-3
    user_idx = hash(user_id) % mock_user_item_matrix.shape[0]
    
    user_vector = mock_user_item_matrix[user_idx].reshape(1, -1)
    
    # Find the 2 nearest neighbors
    distances, indices = knn_model.kneighbors(user_vector, n_neighbors=2)
    
    # Exclude the user themselves (index 0 in the result)
    similar_user_idx = indices.flatten()[1]
    
    # Find items the similar user liked but the target user hasn't seen
    similar_user_vector = mock_user_item_matrix[similar_user_idx]
    
    recommendations = []
    for i in range(len(similar_user_vector)):
        # If similar user interacted with it, but target user hasn't
        if similar_user_vector[i] > 0 and user_vector[0][i] == 0:
            recommendations.append(product_ids[i])
            
    # Fallback to random popular items if no direct collaborative recommendations
    if not recommendations:
        recommendations = [product_ids[0], product_ids[2]]
        
    return recommendations
