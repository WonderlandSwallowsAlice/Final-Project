var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});
//Creates new tasks and makes sure it is not empty
router.post('/create', function (req, res, next) {
  const { task } = req.body;

  if (!task || task.trim() === '') {
    return res.status(400).send('Task cannot be blank');
  }

  try {
    req.db.query('INSERT INTO todos (task, completed) VALUES (?, 0);', [task.trim()], (err, results) => {
      if (err) {
        console.error('Error adding todo:', err);
        return res.status(500).send('Error adding todo');
      }
      console.log('Todo added successfully:', results);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

//Edits a task description 
router.post('/edit', function (req, res, next) {
  const { id, task } = req.body;

  if (!task || task.trim() === '') {
    return res.status(400).send('Task cannot be blank');
  }

  try {
    req.db.query('UPDATE todos SET task = ? WHERE id = ?;', [task.trim(), id], (err, results) => {
      if (err) {
        console.error('Error editing todo:', err);
        return res.status(500).send('Error editing todo');
      }
      console.log('Todo edited successfully:', results);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error editing todo:', error);
    res.status(500).send('Error editing todo');
  }
});

//Changes tasks completeness status
router.post('/toggle', function (req, res, next) {
  const { id, completed } = req.body;
  // completed comes in as "0" or "1" (current state), so we flip it
  const newState = completed === '1' ? 0 : 1;

  try {
    req.db.query('UPDATE todos SET completed = ? WHERE id = ?;', [newState, id], (err, results) => {
      if (err) {
        console.error('Error toggling todo:', err);
        return res.status(500).send('Error toggling todo');
      }
      console.log('Todo toggled successfully:', results);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).send('Error toggling todo');
  }
});

//Deletes the task
router.post('/delete', function (req, res, next) {
  const { id } = req.body;
  try {
    req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Error deleting todo');
      }
      console.log('Todo deleted successfully:', results);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo');
  }
});

module.exports = router;