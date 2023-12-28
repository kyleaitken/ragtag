from pymongo import MongoClient
import sys
import faiss
import json
import numpy as np

# Check if a vector is provided as a command-line argument
if len(sys.argv) < 2:
    print("Usage: python script.py <vector>")
    sys.exit(1)

# Extract the vector from the command-line argument
vector_arg_index = sys.argv.index('--vector')
vector_json = sys.argv[vector_arg_index + 1]
vector_dict = json.loads(vector_json)
query_vector = np.array(vector_dict['vector']).reshape(1, -1).astype('float32')

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['mydatabase']
collection = db['embeddings']

# Retrieve vectors from MongoDB
projection = {'_id': 0, 'vector': 1, 'text': 1}

cursor = collection.find({}, projection)
documents = list(cursor)
if len(documents) == 0:
    print('No documents found.')
    sys.exit()

# Extract vectors and text from documents
vectors_from_mongo = [doc['vector'] for doc in documents]
texts_from_mongo = [doc['text'] for doc in documents]

# Convert vectors to a NumPy array
vectors_np = np.array(vectors_from_mongo).astype('float32')

# Initialize Faiss index
index = faiss.IndexFlatL2(vectors_np.shape[1])  # L2 distance for simplicity

# Add vectors to Faiss index
index.add(vectors_np)

# Perform a similarity search using Faiss
distances, indices = index.search(query_vector, k=5)

# Display corresponding text values
nearest_text_values = [texts_from_mongo[i] for i in indices.flatten()]
print(nearest_text_values)

# Close the MongoDB connection
client.close()