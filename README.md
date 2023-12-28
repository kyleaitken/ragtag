# RAG TAG

## Overview

Retrieval Augmented Generation (RAG) tool that allows you to upload a text or pdf document and then query GPT 3.5 about those documents. Requires a valid openai API key.

## Prerequisites

- Python 3.10
- Conda (for installing Python dependencies)
- Node.js (for installing Node dependencies)

## Setup Instructions

### Python Dependencies

1. **Install Conda:**

Follow the instructions on the [Conda website](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) to install Conda.

2. **Create and activate Conda Environment:**

```bash
conda create --name your_environment_name python=3.10
conda activate your_environment_name

3. **Install Python Dependencies:**
conda install -c pytorch spacy pymongo numpy
conda install -c pytorch faiss-cpu=1.7.4 mkl=2021 blas=1.0=mkl

### Node dependencies

install Node.JS and run npm install

### Usage

1. Launch the server with node app.js
2. Navigate to localhost:3000/ 
3. Provide a valid openai API key in the form
4. Upload a pdf or text (.txt) document
5. Ask questions about the document
