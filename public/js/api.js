
async function getVectors() {
  const textInput = document.getElementById('textInput').value.trim();
  const outputTextElement = document.getElementById('outputText');
  outputTextElement.innerHTML += `<strong>You:</strong> ${textInput}<br><br>`;

  if (!textInput) {
    console.warn('Text input is empty.');
    return;
  }

  try {
      const response = await fetch('/get-vectors', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textInput }),
      });

      if (response.ok) {
        const result = await response.json();
        const modifiedText = `${textInput} Relevant info: ${JSON.stringify(result)}`;
        console.log('modified text', modifiedText);
        const generatedContent = await sendToGPT(modifiedText);
        if (generatedContent !== null) {
          outputTextElement.innerHTML += `<strong>ChatGPT:</strong> ${generatedContent}<br><br>`;
        } else {
          outputTextElement.innerHTML += `<strong>Error: Invalid openai API key used</strong><br><br>`;
        }
      } else {
      console.error('Error:', response.statusText);
      }
  } catch (error) {
      console.error('Error:', error.message);
  }
}

document.addEventListener('keyup', handleKeyPress);

function handleKeyPress(event) {
    if (event.keyCode === 13) {
      switch(document.activeElement.id) {
        case 'textInput':
          getVectors();
          break;
        case 'fileUpload':
          uploadFile(event);
          break;
        case 'apiKeyInput':
          console.log('here');
          storeAPIKey(event);
          break;
        default:
          return;
      }
      clearForms();
    }
}

function storeAPIKey(event) {
  event.preventDefault();

  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (apiKey.length === 0) {
    console.warn('empty api key');
    return;
  }

  localStorage.setItem('apiKey', apiKey);
}

function clearForms() {
  document.getElementById('apiKeyInput').value = '';
  document.getElementById('textInput').value = '';
}

  
// Attach the handleFormSubmission function to the form's submit event
document.getElementById('uploadForm').addEventListener('submit', uploadFile);


async function uploadFile(event) {
  event.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('fileInput', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  }
}

async function sendToGPT(text) {
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    console.warn('Please enter an openai API key');
    return;
  }

  const gptAPIEndpoint = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(gptAPIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: text },
        ],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const generatedContent = result.choices[0].message.content;
      return generatedContent;
    } else {
      console.error('Error:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error sending request to GPT:', error.message);
    return null;
  }
}