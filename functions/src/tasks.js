
const admin = require("firebase-admin")

const serviceAccount = require("../credentials.json")

let db
//db.collection('tasks')

function dbAuth(){
    if(!admin.apps.length){
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    db = admin.firestore()
}
}


exports.getTasks = (req, res) => {
    dbAuth()
    db.collection('tasks').get()
    .then(collection => {
        const taskList = collection.docs.map(doc => {
            let task = doc.data()
            task.id = doc.id
            return task
        })
        res.status(200).send(taskList)
    })
    .catch(err => res.status(500).send(err))
}


exports.postTask = (req, res) => {
    if(!req.body || !req.body.item || !req.body.userId) {
        res.status(400).send('Invalid Request')
    }
    dbAuth()
    const newTask = {
        item: req.body.item,
        done: false,
        userId: req.body.userId
    }
    db.collection('task').add(newTask)
    .then(() => {
        this.getTasks(req, res)
    
    })
    .catch(err => res.status(500).send(err))
}


exports.patchTask = (req, res) => {
    dbAuth()
    res.status(200).send('patchTask')
}


exports.deleteTask = (req, res) => {
    dbAuth()
    res.status(200).send('deleteTask')
}