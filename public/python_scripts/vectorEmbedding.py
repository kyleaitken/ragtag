import spacy
import sys
import faiss
from pymongo import MongoClient

print('in vector Embedding script')

def generate_vector_embedding(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)

    client = MongoClient('mongodb://localhost:27017/')
    db = client['mydatabase']
    collection = db['embeddings']

    for sentence in doc.sents:
        vector = sentence.vector.tolist()
        document = {'text': sentence.text, 'vector': vector}
        result = collection.insert_one(document)
    
    client.close()

generate_vector_embedding(sys.argv[1])







