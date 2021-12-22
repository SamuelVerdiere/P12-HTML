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

/* Login part */
//intial page setting
btnoff.style.display = 'none';
tableaux.style.display = 'none';
var inputlog  = loginId.value; 
var inputpswd = loginMdp.value;

//on click on "login" button :
formlogin.addEventListener('submit', (e) => { 
    e.preventDefault();
    //if inputs are incorrectly filled:
    if(loginId.value === '') {
        alert('Please fill Id & Password fields.');
    }
    if(loginMdp.value === '') {
        alert('Please fill Id & Password fields.');
    } else if (loginId.value !== '' && loginMdp.value !== '') {
    //if inputs are ok, allow connection and display elements...
        let date = new Date(Date.now()+ 60000);
        date = date.toUTCString();
        displayElementsOnConfirm();
        sessionStorage.setItem(loginId.value, loginMdp.value);
        document.cookie = 'login='+loginId.value+';expires='+date+';secure';
        document.cookie = 'password='+loginMdp.value+';expires='+date+';secure';
        getContacts();
    } 

    // $.ajax({
    //     url: 'path/to/server-side/script.php', /*url*/
    //     data: '', /* post data e.g name=christian&hobbie=loving */
    //     type: '', /* POST|GET */
    //     complete: function(d) {
    //         var data= d.responseTXT;
    //         /* Here you can use the data as you like */
    //         $('#elementid').html(data);
    //     }
    // });
    //show Tables
})

//on click on log out button, get back to initial page:
formcancel.addEventListener('cancel', (e) => {
    e.preventDefault();
    document.cookie = 'login=; expires=; secure';
    document.cookie = 'password=; expires=; secure';

    sessionStorage.clear();
    hideElementsOnCancel();
})

//helpers

function getContacts() {
    $.ajax({
        url:'/contacts',
        method:'GET',
        contentType:'application/json',
        data: JSON.stringify({ 
            email: $('#loginId').val(),
            password: $('#loginMdp').val()
        }), //on paramètre la requete
        success: function(result) {
            $('#contactTable').html(result.html);   //dans l'id contactTable le div; on place le result = le tableau du index.js & la clé du response

         },    //si succes on exécute une fonction sur le résultat
        error: function() {}
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
    subtitleTop.innerHTML = 'Welcome to your personal interface,' +loginId.value+'. You are now logged in.'
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

btnCreateCtc.addEventListener('click', function() { 
inputContact.style.display = 'block';
})

btnSaveCtc.addEventListener('click', function() { //get the list of contacts from DATABASe = same logic
var contactes = [
    {Name:'Testing 2', Email:'Mail Test2', Phone:'222-555-6'},
    {Name:'Testing 3', Email:'Mail Test3', Phone:'222-555-7'},
    {Name:'Testing 4', Email:'Mail Test4', Phone:'222-555-9'}
];
//on click on create button, add 1 row & 3 cells per element of the object
contactes.forEach(createRow);
function createRow(contactes) {
    var row = contactTable.insertRow(-1);
    var cell = row.insertCell(0);
    cell.innerHTML = contactes.Name;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = contactes.Email;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = contactes.Phone;
    inputContact.style.display = 'none';
   contactTable.appendchild("<tr><td>"+hello+"</td><td>"+Email+"</td><td>"+Phone+"</td></tr>");
}
})

/* CONTRACTS */
const inputContract = document.querySelector('.containsInpute');
const btnCreateCtr = document.querySelector('.createContracte');
const btnSaveCtr = document.querySelector('.SaveContracte');
inputContract.style.display = 'none';

btnCreateCtr.addEventListener('click', function () {
inputContract.style.display = 'block';
})

btnSaveCtr.addEventListener('click', function() {
    var contracts = [
        {Account:'GenePoint', Status:'Draft', StartDate:'16/12/2021', ContractTerm:'6'},
        {Account:'Edge Communications', Status:'Activated', StartDate:'10/12/2021', ContractTerm:'12'},
        {Account:'Dickenson plc', Status:'Draft', StartDate:'21/1/2022', ContractTerm:'10'},
        {Account:'Pyramid Construction inc.', Status:'Activated', StartDate:'18/12/2021', ContractTerm:'9'}
    ];

    contracts.forEach(createRows);
    function createRows(contracts) {
        var row = contractTable.insertRow(-1);
        var cell = row.insertCell(0);
        cell.innerHTML = contracts.Account;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = contracts.Status;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = contracts.StartDate;
        var cell4 = row.insertCell(3);
        cell4.innerHTML = contracts.ContractTerm;
    }
    inputContract.style.display = 'none';
})

//faire les requêtes AJAX:
// 1. pour la connection / login / logout
// 2. pour afficher les données des tableaux
// 3. modif tableaux pour modifier les données + requête AJAX
// 4. supprimer une colonne de tableau + requête AJAX
