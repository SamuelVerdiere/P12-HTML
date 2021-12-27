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
loginId.style.display = 'block';
loginMdp.style.display= 'block';
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

/* Login part */
//intial page setting
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
    else if (loginId.value !== '' && loginMdp.value !== '') {
    //if inputs are ok, allow connection and display elements...
        getContacts();
        if (loggedContact === true) {
            let date = new Date(Date.now()+ 60000);
            date = date.toUTCString();
            displayElementsOnConfirm();
            sessionStorage.setItem(loginId.value, loginMdp.value);
            document.querySelector
            document.cookie = 'login='+loginId.value+';expires='+date+';secure';
            document.cookie = 'password='+loginMdp.value+';expires='+date+';secure';
            getContracts();
            getProducts();
        }
        } else {
            alert('Could not connect you. Please retry again later.');
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
        console.log('Registration complete');
    }
})


//helpers

function getContacts() {
    console.log($('#loginMdp').val());
    console.log($('#loginId').val());
    $.ajax({  //setup the query
        url:'/api/getContact',
        method:'GET',
        contentType:'application/json',
            data: JSON.stringify({ 
            password: $('#loginMdp').val(),
            email: $('#loginId').val()
         }),  //if success, execute code:
        success: function(result) {
            //allow connection
            loggedContact = true;
            //in the contactTable Id, we place the result as HTML: it is the table from index.js & response key
            $('#contactTable').html(result.html); 
         },
        error: function() {
            //prevent connexion and display error
            loggedContact = false;
           alert('Unable to query Contacts. Please contact the Administrator.');
        }
    })
}

function getContracts() {
    $.ajax({
        url:'/contracts',
        method:'GET',
        contentType:'application/json',
        //data: JSON.stringify(), //on paramètre la requete
        success: function(result) {
            $('#contractTable').html(result.html);
        },    //si succes on exécute une fonction sur le résultat
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
        data: JSON.stringify(), //on paramètre la requete
        success: function(result) {
            $('#productTable').html(result.html);
        },    //si succes on exécute une fonction sur le résultat
        error: function() {
            alert('Unable to query Products. Please contact the Administrator.');
        }
    })
}

function registerContact() {
    console.log($('#registerFName').val());
    console.log($('#registerLName').val());
    console.log($('#registerMail').val());
    console.log($('#registerPassword').val());
    $.ajax({
        url:'/contacts',
        method:'POST',
        contentType:'application/json',
        data: JSON.stringify({
            firstname: $('#registerFName').val(),
            lastname: $('#registerLName').val(),
            email: $('#registerMail').val(),
            password: $('#registerPassword').val()
        }), //on paramètre la requete
        success: function() {
            alert('Registration complete, you can now login with your mail and password.');
            console.log('this is it.');
        },    //si succes on exécute une fonction sur le résultat
        error: function() {
            alert('Could not complete registration. Please try again later.');
            console.log('no, it\'s not');
        }
    })
}


//request:
/*
function getContacts() {
    $.ajax({
        url:'',
        method:'',
        contentType:'application/json',
        data: JSON.stringify(), //on paramètre la requete
        success: function(result) {},    //si succes on exécute une fonction sur le résultat
                error: function() {}
    })
}
*/

// function loginRequest() {
//     let data = new FormData();
//     data.append('name', loginId.value);
//     data.append('pasword', loginMdp.value);
        
//     fetch('url', {
//     method: 'GET',
//     body: data
//     })
//     .then(data => data.text())
//     .then((users) => findUser(users))
// }

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
//obtenir valeur des champs de modif
btnCreateCtc.addEventListener('click', function() { 
inputContact.style.display = 'block';
})

btnSaveCtc.addEventListener('click', function() { //get the list of contacts from DATABASe = same logic
//entrer les champs de modifs dans le tableau
   contactTable.appendchild("<tr><td>"+hello+"</td><td>"+Email+"</td><td>"+Phone+"</td></tr>");
//puis POST les modifs dans sf
})

/* CONTRACTS */
const inputContract = document.querySelector('.containsInpute');
const btnCreateCtr = document.querySelector('.createContracte');
const btnSaveCtr = document.querySelector('.SaveContracte');
inputContract.style.display = 'none';