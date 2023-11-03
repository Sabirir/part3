const express=require('express')
const app=express()
const morgan=require('morgan')
const cors=require('cors')

app.use(express.json())
app.use(cors())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
morgan('tiny','immediate')
// const requestLogger=(req,res,next)=>{
//   console.log('Method:',req.method)
//   console.log('Path:',req.path)
//   console.log('Body:',req.body)
//   console.log('---')
//   next()
// }
// morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('host', function(req, res) {
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :host'))
// app.use(morgan('combined',{immediate: function (req,res){ return res.path}}))
app.get('https://sabrideploys.onrender.com/notes',(request,response)=>{
  response.json(notes)
})
app.get('/api/persons',(request,response)=>{
  response.json(persons)
})
app.get('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
  const person=persons.find(person=> person.id ===id)
  if(person){
    response.send(person)
  }
  else {
    response.status(404).end('<h1>No such person</h1>')
  }
})
// notes
app.get('/api/notes/:id',(request,response)=>{
  const id=Number(request.params.id)
  const note=notes.find(person=> person.id ===id)
  if(note){
    response.send(note)
  }
  else {
    response.status(404).end('<h1>No such note</h1>')
  }
})

// delete record
app.delete('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
  const person=persons.filter(person => person.id !== id)
  response.json(person)
  response.status(204).end(`person ${id} has been deleted`)
})
// delete note
app.delete('/api/note/:id',(request,response)=>{
  const id=Number(request.params.id)
  const note=notes.filter(person => person.id !== id)
  response.json(note)
  response.status(204).end(`note ${id} has been deleted`)
})


// ADD person
app.post('/api/persons',(request,response)=>{
 
  const body= request.body
   if(!body.name && !body.number){
    return response.status(400).end('missing credentianls')
   }
   
const person={
  id:generateId(),
  name:body.name,
  number:body.number
}
const bodyName=body.name

if(persons.find(n=>n.name===bodyName)){
  return response.status(400).json({
    "error": `the name ${bodyName} already exists`
  })
 }
 else{
  persons=persons.concat(person)
    
    response.json(person)
 }
  
})
// generate id
const generateId=()=>{
  const maxId= persons.length >0
  ? Math.max(...persons.map(n=>n.id))
  : 0
  return maxId +1
}
//info
app.get('/info',(request,response)=>{
  const date=new Date()
  response.send(`
 <p> Phonebook has info for ${persons.length} people</p>  <br/>
  ${request.body.Date} ${date.toTimeString()}
 `)
})

// Middleware
const unknownEndpoints=(request,response)=>{
  response.status(404).send({error:'unknown endpoint'})
}
app.use(unknownEndpoints)

  const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
