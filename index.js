//find resources here : https://node-postgres.com/api/client
/*This  index connects to Heroku Database and perform operations with Salesforce Database via queries. */
//1. setup applications & modules
const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const pg = require('pg');
const application = express();
application.use(express.urlencoded({ extended: true }));
//the application will use json type requests
application.use(express.json());
//2. connect to the PostGres/Heroku database
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || 'postgres://mbwtvqowzgfgnl:f30cee11c627b0858cc0e1de8814c1c4daaa092ba5bb485e359ab39422c8f094@ec2-52-213-119-221.eu-west-1.compute.amazonaws.com:5432/dejeaa4nhtu6sd', ssl: {rejectUnauthorized: false }});
//manage error in login
client.connect(error => {
        if (error) {
            console.error('Connection error', error.stack)} 
        else {
            console.log('Connected')}})
//3. Create requests
/* get all contacts from Salesforce, byt associating HTTP verb GET to a function.
*we map the / path sent in GET request to the function. The function receives request
*and response objects as parameters. */
application.get('/contact', (request, response) => {
    try {
        client.query('SELECT * FROM salesforce.contact').then((data) => {
            console.log(data.rows);
            response.json(data.rows);
        });
    } catch (error) {
        console.error(error.message);
}});
/* create a contact after checking if it already exists
* return sfid if the contact already exists. */
application.post('/contact', (request, response) => {
    try {
        //Set variables for body request
        var mail = request.body.email;
        var lastname = request.body.lastname;
        var firstname = request.body.firstname;
        var phone = request.body.phone;
        //Create query with parameters & prommise to create contact
        var createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email=$3', [mail])
        .then((contact) => {
            if (contact !== undefined) {
                if (cont.rowCount === 0) {
                    createContact = client.query('INSERT INTO salesforce.Contact (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4) RETURNING id', [firstname, lastname,email, phone])
                    .then((contact) => {response.json(contact.rows[0].id);
                }); } else {
                    createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email = $1', [mail])
                    .then((contact) => {
                        response.json(contact.rows[0].sfid);
                 });}} else {
                        response.json(createContact.rows[0]);
            }}); } catch (error) {
        console.error(error.message);
    }});
//get a contact with its ID. Query from SF, then get JSON response.
application.get('/contact/:id', (request, response) => {
    try {
        const { id } = request.params;
        client.query('SELECT * FROM salesforce.contact WHERE id = $1', [id])
        .then((contact) => {
            console.log(contact.rows[0]);
            response.json(contact.rows[0]);
        });} catch (error) {
        console.error(error.message);
    }});

//update a contact
application.put('/contact/:id', (request, response) => {
    try {
        const { id } = request.params;
        var firstname = request.body.firstname;
        var lastname = request.body.lastname;
        var email = request.body.email;
        var phone = request.body.phone;
        client.query('UPDATE salesforce.Contact SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE id = $5', [firstname, lastname, email, phone, id]).then((contact) => {
            console.log(contact);
            response.json(contact);
        });} catch (err) {
        console.error(err.message);
    }});

//deactivate a contact by setting custom field to false
application.patch('/contact/:id', (request, response) => {
    try {
        const { id } = request.params;
        client.query('UPDATE salesforce.Contact SET Status__c = false WHERE id = $1',
            [id]).then((contact) => {
                response.json(contact);
        });} catch (error) {
        console.error(error.message);
    }});

// get accounts
application.get('/account', (request, response) => {
    try {
        client.query('SELECT * FROM salesforce.account').then((accounts) => {
            console.log(accounts.rows);
            response.json(accounts.rows);
        });} catch (error) {
        console.error(error.message);
    }});

// get contracts
application.get('/contract', (request, response) => {
    try {
        client.query('SELECT * FROM salesforce.contract').then((contracts) => {
            console.log(contracts.rows);
            response.json(contracts.rows);
        });} catch (error) {
        console.error(error.message);
    }});

//create a new contract
apapplicationp.post('/contract', (request, response) => {
    try {
        var accountName = request.body.name;
        var status = request.body.status;
        var startdate = request.body.date;
        var endTerm = request.body.contractTerm;
        var accountId = '';
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName])
        .then((Accounts) => {
            accountId = Accounts.rows[0].sfid;
            client.query('INSERT INTO salesforce.Contract (accountId, status, startDate, contractTerm) VALUES ($1, $2, $3, $4) RETURNING id',[accountId, status, startdate, endTerm])
        .then((Accounts) => {
            response.json(Accounts.rows[0].id);
        })})} catch (error) {
        console.error(error.message);
    }});

//get a contract by its id
application.get('/contract/:id', (request, response) => {
    try {
        const { id } = request.params;
        client.query('SELECT * FROM salesforce.contract WHERE id = $1', [id])
        .then((contracts) => {
            console.log(contracts.rows[0]);
            response.json(contracts.rows[0]);
        });} catch (error) {
        console.error(error.message);
    }});

//update contract by id and sfid
application.put('/contract/:id', (request, response) => {
    try {
        const { id } = request.params;
        var accountName = request.body.name;
        var accountSfid = '';
        var endTerm = request.body.contractTerm;
        var startdate = request.body.date;
        var status = request.body.status;
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName]).then((accounts) => {
            accountSfid = accounts.rows[0].sfid;
            client.query('UPDATE salesforce.Contract SET contractTerm = $1, startDate = $2, status = $3 WHERE accountId = $4 AND id = $5', [endTerm, startdate, status, accountSfid, id])
            .then((data) => {
                response.json(data);
            });});} catch (error) {
        console.error(error.message);
    }});

application.listen(port, () => console.log(`listening to the port ${ port }`));