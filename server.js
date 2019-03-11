const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Issue = require('./models/issue');


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
console.log('Mongoose OK');
});



router.route('/issues').get((req,res) => {
    Issue.find((err, Issues) => {
        if (err)
            console.log(err);
        else
            res.json(Issues);        
    });
});


router.route('/issues/:id').get((req,res) => {
    Issue.findById(req.params.id, (err, Issue) =>{
        if (err)
            console.log(err);
        else
            res.json(Issue);
    });
});

router.route('/issues/add').post((req,res) => {
    let Issue = new Issue(req.body);
    Issue.save()
        .then(Issue => {
            res.status(200).json({'Issue': 'Added OK'});
       })
       .catch(err => {
           res.status(400).json('Failed');
       });
});

router.route('/issues/update/:id').post((req,res) => {
    Issue.findById(req.params.id, (err, issue) =>{
        if (!issue)
            return next(new Error('Could not load document'));
        else
        {
            Issue.title = req.body.title;
            Issue.responsible = req.body.responsible;
            Issue.description = req.body.description;
            Issue.severity = req.body.severity;
            Issue.status = req.body.status;

            Issue.save().then(Issue => {
                res.json('Update Done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/issues/delete/:id').get((req,res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err,Issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed');
    });     
});



app.use('/',router);


app.listen(4000, () => console.log('Express server running on port 4000'));
