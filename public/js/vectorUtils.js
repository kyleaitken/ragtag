const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function processAndStoreVector(text) {
    const pythonScriptPath = '/Users/kyleaitken/testDB/public/python_scripts/vectorEmbedding.py';
    const pythonCommand = `python3.10 "${pythonScriptPath}" "${text}"`;

    exec(pythonCommand, (error, stdout, stderr) => {
        console.log('stdout', stdout);
        if (error) {
          console.error('Error executing vectorEmbedding script:', error);
          return;
        }
    
        if (stderr) {
          console.error('Python script returned an error:', stderr);
          return;
        }
    });
}

async function getUserPromptVector(text) {  
    const pythonScriptPath = '/Users/kyleaitken/testDB/public/python_scripts/promptVector.py';
    const pythonCommand = `python3.10 "${pythonScriptPath}" "${text}"`;
  
    try {
      const { stdout, stderr } = await exec(pythonCommand);
  
      if (stderr) {
        console.error('Python script returned an error:', stderr);
        return null;
      }
  
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Error executing Python script:', error);
      return null;
    }
}


async function getSimilarVectors(vector) {  
    const pythonScriptPath = '/Users/kyleaitken/testDB/public/python_scripts/vectorSearch.py';
    const escapedVectorString = vector.replace(/"/g, '\\"'); 
    const pythonCommand = `python3.10 "${pythonScriptPath}" --vector "${escapedVectorString}"`;
  
    try {
      const { stdout, stderr } = await exec(pythonCommand);
  
      if (stderr) {
        console.error('Python script returned an error:', stderr);
        return null;
      }
  
      return stdout;

    } catch (error) {
      console.error('Error executing Python script:', error);
      return null;
    }
}


module.exports = { processAndStoreVector, getUserPromptVector, getSimilarVectors };
