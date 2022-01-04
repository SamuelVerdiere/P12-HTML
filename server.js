/*This connects to Heroku Database and perform operations with Salesforce Database via queries. */
//1. setup applications & modules
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const pg = require('pg');
const { finished } = require('stream');
const { query } = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
//the application will use json type requests
app.use(express.json());
app.use(express.static('public'));
app.use(bodyparser.json());
app.set('port', port);
const uri = 'postgres://cevesmurimhaju:4b91787ad4da7cd84771f8aaf154ecf19128a00ee40cb4180c8a45e9db84e8b0@ec2-54-74-95-84.eu-west-1.compute.amazonaws.com:5432/dfi6nf71nvla16';

//2. connect to the PostGres/Heroku database
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || uri, ssl: {rejectUnauthorized: false }});

    //manage error during connecxion to postgres database
client.connect(error => {
        if (error) {
            console.error('There was a connection error, please see: ', error.stack)} 
        else {
            console.log('Connection Success')}})
//3. Create routes and queries
/* get contact from Salesforce, byt associating HTTP verb GET to a function.
*we map the / path sent in GET request to the function. The function receives request
*and response objects as parameters. */
app.post('/api/getContact', (req, res) => {
    var lemail = req.body.email;
    var lepass = req.body.password;
    console.log('from js mail : '+ lemail);
    console.log('from js pass : ' + lepass);
    try {
        client.query('SELECT * FROM salesforce.Contact where password__c=$1 AND email=$2', 
        [lepass, lemail])
        .then((data) => {
            var contacts = data.rows[0];
            res.json(contacts); 
    });
        } catch (error) {
            console.log(error);
        } 
    });

/* create a contact after checking if it already exists
* return sfid if the contact already exists. */
app.post('/api/contacts', (req, res) => {
    try {
        //Set variables for body request
        var email = req.body.email;
        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        var password = req.body.password;
        //Create query with parameters & prommise to create contact
        var createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email=$1', [email])
        .then((contact) => {
            //console.log('this is the contact : '+ JSON.stringify(contact));
            if (contact !== undefined) {
                if (contact.rowCount === 0) {
                    createContact = client.query('INSERT INTO salesforce.Contact (firstname, lastname, email, password__c, externalmail__c) VALUES ($1, $2, $3, $4, $3) RETURNING id', [firstname, lastname,email, password])
                    .then((contact) => {res.json(contact.rows[0].id); });
                } else {
                    createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email = $1', [email])
                    .then((contact) => {
                        res.json(contact.rows[0]); });}
            } else {
                res.json(createContact.rows[0]); }
        })} catch (error) {
        console.error(error.message);
}});
//get a contact with its ID. Query from SF, then get JSON response.
app.get('/contact/id', (req, res) => {
    try {
        const { id } = req.params;
        client.query('SELECT * FROM salesforce.contact WHERE id = $1', [id])
        .then((contact) => {
            res.json(contact.rows[0]);
        });} catch (error) {
        console.error(error.message);
    }});

//get a contact with its ID. Query from SF, then get JSON response.
app.get('/contact/:id', (req, res) => {
    try {
        const { id } = req.params;
        client.query('SELECT * FROM salesforce.contact WHERE id = $1', [id])
        .then((contact) => {
            res.json(contact.rows[0]);
        });} catch (error) {
        console.error(error.message);
    }});

//update a contact
app.patch('/contact/:sfid', (req, res) => {
    var sfid = req.params.sfid;
    console.log('BEFORE QUERY SFID: ' +  sfid);
    try {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var phone = req.body.phone;
        var password = req.body.password;
        client.query('UPDATE salesforce.contact SET firstname = $1, lastname= $2, email = $3, phone = $4, password__c = $5 WHERE sfid = $6 RETURNING sfid', 
        [firstname, lastname, email, phone, password, sfid])
        .then((contact) => {
            res.json(contact);
        });} catch (err) {
        console.error(err.message);
    }});

//deactivate a contact by setting custom field to false
app.patch('/contact/:id', (req, res) => {
    try {
        const { id } = req.params;
        client.query('UPDATE salesforce.Contact SET Status__c = false WHERE id = $1',
            [id]).then((contact) => {
                res.json(contact);
        });} catch (error) {
        console.error(error.message);
    }});

// get accounts
app.get('/account', (req, res) => {
    try {
        client.query('SELECT * FROM salesforce.account').then((accounts) => {
            res.json(accounts.rows);
        });} catch (error) {
        console.error(error.message);
    }});

// get contracts
app.get('/contracts', (req, res) => {
    try {
        client.query('SELECT * FROM salesforce.contract')
        .then((data) => {
            var contracts = data.rows;
            var contractTable = '<table class="tableContract" border=1>'+
            '<thead><tr><th>Contract Number</th><th>Status</th><th>Start Date</th><th>Term (months)</th></tr>'+
            '</thead>'+
            '<tbody>';
            contracts.forEach(contract => {
                var mydate = contract.startdate;
                var shortDate = mydate.toLocaleDateString('en-US');
                contractTable = contractTable+'<tr><td>'+contract.contractnumber+'</td><td>'+contract.status+'</td><td>'+shortDate+'</td><td>'+contract.contractterm+'</td></tr>';              
            });
            contractTable = contractTable+'</tbody></table>';
            res.send({html: contractTable});
        });
    } catch (error) {
        console.error(error.message);
    }});

//create a new contract
app.post('/contract', (req, res) => {
    try {
        var accountName = req.body.name;
        var status = req.body.status;
        var startdate = req.body.date;
        var endTerm = req.body.contractTerm;
        var accountId = '';
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName])
        .then((Accounts) => {
            accountId = Accounts.rows[0].sfid;
            client.query('INSERT INTO salesforce.Contract (accountId, status, startDate, contractTerm) VALUES ($1, $2, $3, $4) RETURNING id',
            [accountId, status, startdate, endTerm])
        .then((Accounts) => {
            res.json(Accounts.rows[0].id);
        })})} catch (error) {
        console.error(error.message);
    }});

//get a contract by its id
app.get('/contract/:id', (req, res) => {
    try {
        const { id } = req.params.id;
        client.query('SELECT * FROM salesforce.contract WHERE id = $1', [id])
        .then((contracts) => {
            res.json(contracts.rows[0]);
        });} catch (error) {
        console.error(error.message);
    }});

//update contract by id and sfid
app.put('/contract/:id', (req, res) => {
    try {
        const { id } = req.params.id;
        var accountName = req.body.name;
        var accountSfid = '';
        var endTerm = req.body.contractTerm;
        var startdate = req.body.date;
        var status = req.body.status;
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName])
        .then((accounts) => {
            accountSfid = accounts.rows[0].sfid;
            client.query('UPDATE salesforce.Contract SET contractTerm = $1, startDate = $2, status = $3 WHERE accountId = $4 AND id = $5', 
            [endTerm, startdate, status, accountSfid, id])
        .then((data) => {
            res.json(data);
        });});} catch (error) {
        console.error(error.message);
    }});

//get products
app.get('/products', (req, res) => {
    try {
        client.query('SELECT * FROM salesforce.product2')
        .then((data) => {
            console.log(data.rows);
            var products = data.rows;
            var productTable = '<table class="tableProduct" border=1>'+
            '<thead><tr><th>Product Name</th><th>Product Code</th><th>Product Description</th></tr>'+
            '</thead>'+
            '<tbody>';
            products.forEach(product => {
                productTable = productTable+'<tr><td>'+product.name+'</td><td>'+product.productcode+'</td><td>'+product.description+'</td></tr>';              
            });
            productTable = productTable+'</tbody></table>';
            res.send({html: productTable});
        });
    } catch (error) {
        console.error(error.message);
    }});

const server = app.listen(port, () => {
    const port = server.address().port;
    console.log(`listening to the port ${ port }`);
});