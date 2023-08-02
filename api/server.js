const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
// app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// Port Connection

const PORT = 8000

app.listen(PORT,() => console.log(`Server is running on ${PORT}`))

// DB Connection

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to DB'))
  .catch((err) => {console.error(err)
});

// Server

const Todo = require('./models/Todo')

app.get('/todos', async (req,res) =>{
  const todos = await Todo.find();
  
  res.json(todos);
})

// New 

app.post('/todo/new', (req,res) => {
  const todo = new Todo ({
    text: req.body.text
  })
  todo.save()
  
  res.json(todo)
})

// Delete

app.delete('/todo/delete/:id', async (req, res) =>{
  const result = await Todo.findByIdAndDelete(req.params.id);
  
  res.json(result)
})

//  Complete

app.get('/todo/complete/:id', async (req, res) =>{
  const todo = await Todo.findById(req.params.id);
  
  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
})

// Edit

app.put('/todo/update/:id', async (req, res) => {
    try{
      const todoId = req.params.id;
      const newText = req.body.text;

      const updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        {text: newText},
        {new: true}
      );

      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(updatedTodo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });



