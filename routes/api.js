const express = require('express');
const route = express.Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');


// GET Route for retrieving the note
route.get('/notes', (req, res) => {
  console.info(`${req.method} request received for note`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting feedback
route.post('/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit note`);

  // Destructuring assignment for the items in req.body
  const { title, text} = req.body;

  // If all the required properties are present
  if (req.body) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

route.delete('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;
       
    readFromFile('./db/db.json').then((rawData) => {
        let data = JSON.parse(rawData);
        let index = 0;
        for (; index < data.length; index++) {
            const element = data[index];
            console.log(element);
            if (element.id == noteId) {
                break;
            }
        }
        data.splice(index, 1)
        writeToFile('./db/db.json', data);
        res.json(`Note ${noteId} deleted`);
     })
 });

module.exports = route;