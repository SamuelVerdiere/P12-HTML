//top page part
const bod       = document.querySelector('body');
const pagetitle = document.querySelector('.pageTitle');
const pseudo    = document.querySelector('.nickname');
const hautPage  = document.querySelector('.top');
const subtitleTop  = document.querySelector('.subtitle');
//table part
const tableaux      = document.querySelector('.tables');
const titreContact  = document.querySelector('.contactTitle');
const titreContract = document.querySelector('.contractTitle');
//btns and forms/inputs
const formlogin  = document.querySelector('.formlogine');
const formcancel = document.querySelector('.formcancele');
const loginId    = document.querySelector('.loginIde');
const loginMdp   = document.querySelector('.loginMdpe');
const btnlog     = document.querySelector('.logine');
const btnoff     = document.querySelector('.logout');
const registerpart=document.querySelector('.partRegister');
//btn create inside tables
const createCtc = document.createElement('createContacte');
const createCtr = document.querySelector('createContracte');
var contactTable = document.getElementById('contacto');
var contractTable = document.getElementById('contracta');
//register
const formRegister = document.querySelector('.registerUser');
var inputFname = document.querySelector('.registerFNamee');
var inputLname = document.querySelector('.registerLNamee');
var inputMailr = document.querySelector('.registerMaile');
var inputPassword = document.querySelector('.registerPassworde');
//update
var updateFName = document.getElementById('#ContactFName');
var updateLName = document.getElementById('#ContactLName');
var updateMail = document.getElementById('#ContactMaile');
var updatePass = document.getElementById('#ContactPassw');
var updatePhone = document.getElementById('#ContactPhone');
/* Login part */
//intial page setting
loginId.style.display = 'block';
loginMdp.style.display= 'block';
btnoff.style.display = 'none';
tableaux.style.display = 'none';
var inputlog  = loginId.value; 
var inputpswd = loginMdp.value;
var loggedContact = false;
//Event Listeners

//on click on "login" button :
formlogin.addEventListener('submit', (e) => { 
    e.preventDefault();
    //if inputs are incorrectly filled:
    if(loginId.value === '' || loginMdp.value === '') {
        alert('Please fill Id & Password fields.');
    }
    else {
    //if inputs are ok, allow connection and display elements...
        getContacts();
        if (loggedContact === true) {
            displayElementsOnConfirm();
            getContracts();
            getProducts();
        } else {
            alert('Could not connect you. Please retry again later.');
        }
    
    }
})

//on click on log out button, get back to initial page:
formcancel.addEventListener('cancel', (e) => {
    e.preventDefault();
    document.cookie = 'login=; expires=; secure';
    document.cookie = 'password=; expires=; secure';

    sessionStorage.clear();
    hideElementsOnCancel();
    loggedContact = false;
})

//on click on register button, save contact in SF:
formRegister.addEventListener('submit', (e) => {
    //all inputs must be filled
    if(inputFname.value === '' || inputLname.value === '') {
        alert('Please fill First & Last name fields.');
    } if (inputMailr.value === '' || inputPassword === '') {
        alert('Please fill Mail & Password fields.');
    } else if (inputFname.value !== '' && inputLname !== '' 
              && inputMailr !== '' && inputPassword !=='') {
        registerContact();
    }
})

//helpers
var LoggedcontactId;
var contactFirstName;
var contactLastName;
var contactEmail;
var contactPassword;
var contactPhone;
function getContacts() {
    $.ajax({  //setup the query
        url:'/api/getContact',
        method:'POST',
        contentType:'application/json',
            data: JSON.stringify({ 
            password: $('#loginMdp').val(),
            email: $('#loginId').val()
         }),  //if success, execute code:
        success: function(contact) {
            //allow connection
            loggedContact = true;
            $('#namefromServ').text(contact.name);
            $('#emailfromServ').text(contact.email);
            $('#phonefromServ').text(contact.phone);
            $('#passfromServ').text(contact.password__c);
            LoggedcontactId = contact.sfid;
            contactFirstName = contact.firstname;
            contactLastName = contact.lastname;
            contactEmail = contact.email;
            contactPassword = contact.password__c;
            contactPhone = contact.phone;
         },
        error: function(error) {
            //prevent connexion and display error
            loggedContact = false;
            console.log(error);
           alert('Unable to query Contacts. Please contact the Administrator.');
        }
    })
}

function getContracts() {
    $.ajax({
        url:'/contracts',
        method:'GET',
        contentType:'application/json',
        success: function(result) {
            $('#contractTable').html(result.html);
        },
        error: function() {
            alert('Unable to query Contracts. Please contact the Administrator.');
        }
    })
}

function getProducts() {
    $.ajax({
        url:'/products',
        method:'GET',
        contentType:'application/json',
        data: JSON.stringify(),
        success: function(result) {
            $('#productTable').html(result.html);
        },
        error: function() {
            alert('Unable to query Products. Please contact the Administrator.');
        }
    })
}

function registerContact() {
    $.ajax({
        url:'/api/contacts',
        method:'POST',
        contentType:'application/json',
        data: JSON.stringify({
            firstname: $('#registerFName').val(),
            lastname: $('#registerLName').val(),
            email: $('#registerMail').val(),
            password: $('#registerPassword').val()
        }),
        success: function(result) {
            console.log('Registration complete, '+result.firstname+' '+result.lastname+ ',' +result.externalmail__c+' you can now login with your mail and password.');
        },
        error: function() {
            alert('Could not complete registration. Please try again later.');
        }
    })
}

function displayElementsOnConfirm() {
    registerpart.style.display = 'none';
    btnlog.style.display = 'none';
    loginId.style.display = 'none';
    loginMdp.style.display = 'none';
    btnoff.style.display = 'block';
    formcancel.appendChild(btnoff);
    tableaux.style.display = 'block';
    subtitleTop.innerHTML = 'Welcome to your personal interface, ' +loginId.value+'. You are now logged in.'
}

function hideElementsOnCancel() {
    btnlog.style.display = 'inline';
    loginId.style.display = 'block';
    loginMdp.style.display = 'block';
    btnoff.style.display = 'none';
    pseudo.style.display = 'none';
}

/* Table part */

/* CONTACTS */
//get data; here in an object for example
const inputContact = document.querySelector('.containsInput');
const btnCreateCtc = document.querySelector('.createContacte');
const btnSaveCtc = document.querySelector('.SaveContacte');
inputContact.style.display = 'none';
//get value from edit fields input
btnCreateCtc.addEventListener('click', function() { 
inputContact.style.display = 'block';
    $('#ContactFName').val(contactFirstName);
    $('#ContactLName').val(contactLastName);
    $('#ContactMaile').val(contactEmail);
    $('#ContactPassw').val(contactPassword);
    $('#ContactPhone').val(contactPhone);
})

btnSaveCtc.addEventListener('click', function() {
//send edited fields to server and hide inputs fields
    updateContact()
    inputContact.style.display = 'none';
})

/* CONTRACTS */
const inputContract = document.querySelector('.containsInpute');
const btnCreateCtr = document.querySelector('.createContracte');
const btnSaveCtr = document.querySelector('.SaveContracte');
inputContract.style.display = 'none';

//helper ajax
function updateContact() {
    $.ajax({
        url:'/contact' + '/' + LoggedcontactId,
        method:'PATCH',
        contentType:'application/json',
        data:JSON.stringify({
          //  id: LoggedcontactId,
            firstname: $('#ContactFName').val(),
            lastname: $('#ContactLName').val(),
            email: $('#ContactMaile').val(),
            phone: $('#ContactPhone').val(),
            password: $('#ContactPassw').val()
        }),
        success: function(result) {
            alert('Congratulations, your informations were updated.');
        },
        error: function() {
            alert('Could not complete updating your data. Please try again later.');
        }
    })
}