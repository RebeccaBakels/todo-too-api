
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
    if(!req.params.userId || !req.params.taskId ) {
        res.status(400).send('Invalid request')
    }
    dbAuth()
    db.collection('tasks').where('userId', '==', req.params.userId).get()
    .then(collection => {
        const taskList = collection.docs.map(doc => {
            let task = doc.data()
            task.id = doc.id
            return task
        })
        res.status(200).send(taskList)
    })
    .catch(err => res.status(500).send('get task failed:', err))
}


exports.postTask = (req, res) => {
    if(!req.body || !req.body.item || !req.body.userId || !req.params.userId) {
        res.status(400).send('Invalid Request')
    }
    dbAuth()
    const newTask = {
        item: req.body.item,
        done: false,
        userId: req.body.userId
    }
    db.collection('tasks').add(newTask)
    .then(() => {
        this.getTasks(req, res)
    
    })
    .catch(err => res.status(500).send('post failed:', err))
}


exports.patchTask = (req, res) => {
    if(!req.body || !req.params.userId || !req.params.taskId){
    res.status(400).send('Invalid Request')  
    }
    dbAuth()
    db.collection('tasks').doc(req.params.taskId).update()
    .then(() => {
        this.getTasks(req, res)
    })
    .catch(err => res.status(500).send('update failed:', err))
}


exports.deleteTask = (req, res) => {
    dbAuth()
    res.status(200).send('deleteTask')
}