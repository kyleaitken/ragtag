import spacy
import sys
import json

def generate_prompt_vector(text):
    try:
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        vector = doc.vector
        vector = doc.vector.tolist()  # Convert NumPy array to list for easy JSON serialization
        print(json.dumps({"vector": vector}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

generate_prompt_vector(sys.argv[1])