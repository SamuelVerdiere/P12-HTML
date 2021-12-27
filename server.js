/*This connects to Heroku Database and perform operations with Salesforce Database via queries. */
//1. setup applications & modules
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const pg = require('pg');
const { finished } = require('stream');

const application = express();
application.use(express.urlencoded({ extended: true }));
//the application will use json type requests
application.use(express.json());
application.use(express.static('public'));
application.use(bodyparser.json());
application.set('port', port);
const uri = 'postgres://mbwtvqowzgfgnl:f30cee11c627b0858cc0e1de8814c1c4daaa092ba5bb485e359ab39422c8f094@ec2-52-213-119-221.eu-west-1.compute.amazonaws.com:5432/dejeaa4nhtu6sd';

//2. connect to the PostGres/Heroku database
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || uri, ssl: {rejectUnauthorized: false }});

    //manage error during connecxion to postgres database
client.connect(error => {
        if (error) {
            console.error('There was a connection error, please see: ', error.stack)} 
        else {
            console.log('Connection Success')}})
//3. Create requests
/* get contact from Salesforce, byt associating HTTP verb GET to a function.
*we map the / path sent in GET request to the function. The function receives request
*and response objects as parameters. */
application.post('/api/getContact', (request, response) => {
        const query = {
            text: 'SELECT * FROM salesforce.Contact where password__c=$1 AND email=$2',
            values: [request.body.email, request.body.password]
        }
        client.query(query)
        .then((data) => {
            console.log('this are the data rows for mails: ' + data.rows[0].mail);
            var contacts = data.rows[0];
             var getemailbdd = data.rows[0].find(email);
            //var getemailquery = 
            // var pass = data.rows[1].password;
            // var typedmail = request.body.email;
            // var typedpass = request.body.password;
            //if(findmail === typedmail) {
            // if(request.body.password == contacts.password && request.body.email == contacts.email) {
            var contactTable = '<table class="tableContact" id="tableConto" border=1>'+
            '<thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Password</th></tr>'+
            '</thead>'+
            '<tbody>';
            contacts.forEach(contact => {
                console.log('request body password: '+email);
                console.log('contracts password: ' + pass);
                contactTable = contactTable+'<tr><td>contactname</td><td>'+contact.email+'</td><td>contact.phone+</td><td>'+contact[0].password+'</td></tr>';              
            });
            contactTable = contactTable+'</tbody></table>';
            response.send({html: contactTable});
        
        // } else {
        //     alert('Couldn\'t find your informations in the database.');
       // }
    });
});

/* create a contact after checking if it already exists
* return sfid if the contact already exists. */
application.post('/contacts', (request, response) => {
    try {
        //Set variables for body request
        var mail = request.body.email;
        var lastname = request.body.lastname;
        var firstname = request.body.firstname;
        var password = request.body.password;
        //Create query with parameters & prommise to create contact
        var createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email=$1', [mail])
        .then((contact) => {
            if (contact !== undefined) {
                if (cont.rowCount === 0) {
                    console.log('before inserting');
                    createContact = client.query('INSERT INTO salesforce.Contact (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [firstname, lastname,email, password])
                    .then((contact) => {response.json(contact.rows[0].id); });
                } else {
                    console.log('else inserting');
                    createContact = client.query('SELECT sfid, id FROM salesforce.Contact WHERE email = $1', [mail])
                    .then((contact) => {
                        response.json(contact.rows[0].sfid); });}
            } else {
                response.json(createContact.rows[0]); }
        })} catch (error) {
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
application.get('/contracts', (request, response) => {
    try {
        client.query('SELECT * FROM salesforce.contract')
        .then((data) => {
            console.log(data.rows);
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
            response.send({html: contractTable});
        });
    } catch (error) {
        console.error(error.message);
    }});

//create a new contract
application.post('/contract', (request, response) => {
    try {
        var accountName = request.body.name;
        var status = request.body.status;
        var startdate = request.body.date;
        var endTerm = request.body.contractTerm;
        var accountId = '';
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName])
        .then((Accounts) => {
            accountId = Accounts.rows[0].sfid;
            client.query('INSERT INTO salesforce.Contract (accountId, status, startDate, contractTerm) VALUES ($1, $2, $3, $4) RETURNING id',
            [accountId, status, startdate, endTerm])
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
        client.query('SELECT sfid FROM salesforce.account WHERE name = $1', [accountName])
        .then((accounts) => {
            accountSfid = accounts.rows[0].sfid;
            client.query('UPDATE salesforce.Contract SET contractTerm = $1, startDate = $2, status = $3 WHERE accountId = $4 AND id = $5', 
            [endTerm, startdate, status, accountSfid, id])
        .then((data) => {
            response.json(data);
        });});} catch (error) {
        console.error(error.message);
    }});

// get products
application.get('/products', (request, response) => {
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
            response.send({html: productTable});
        });
    } catch (error) {
        console.error(error.message);
    }});

const server = application.listen(port, () => {
    const port = server.address().port;
    console.log(`listening to the port ${ port }`);
});