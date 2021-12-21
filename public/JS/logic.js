//top page part
const bod       = document.querySelector('body');
const pagetitle = document.querySelector('.pageTitle');
const pseudo    = document.querySelector('.nickname');
const hautPage  = document.querySelector('.top');
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
const createCtc = document.createElement('button');
const createCtr = document.createElement('button');
createCtc.innerHTML = 'Create Contact';
createCtr.innerHTML = 'Create Contract';
createCtc.className = 'createContact';
createCtr.className = 'createContract';
var contactTable = document.getElementById('contacto');
var contractTable = document.getElementById('contracta');

/* Login part */
//intial page setting
pseudo.style.display = 'none';
btnoff.style.display = 'none';
tableaux.style.display = 'none';

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
    //if not, display elements And...
    registerpart.style.display = 'none';
    btnlog.style.display = 'none';
    loginId.style.display = 'none';
    loginMdp.style.display = 'none';
    btnoff.style.display = 'block';
    pseudo.style.display = 'inline';
    pseudo.append(formcancel);
    formcancel.appendChild(btnoff);
    tableaux.style.display = 'block';
    //allow connection And...
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
    btnlog.style.display = 'inline';
    loginId.style.display = 'block';
    loginMdp.style.display = 'block';
    btnoff.style.display = 'none';
    pseudo.style.display = 'none';
})

//hide nickname before connection
//connect on clic 
// btnlog.click(function() {
//     //send form with username+password to login.salesforce.com
//     btnlog.css('display', 'none');
//     sectionlogin.css('display', 'block');
//     //if login success
//     hautPage.append(sectionlogin);
//     sectionlogin.append(loginform);
//     pseudo.css('display', 'inline');
// })

// btnoff.click(function() {
//     sectionlogin.css('display', 'none');
//     pseudo.css('display', 'none');
//     btnlog.css('display', 'inline');
//     //send query to disconnect from Salesforce
// })

/* Table part */
titreContact.appendChild(createCtc);
titreContract.appendChild(createCtr);

//get data; here in an object for example
createCtc.addEventListener('click', function() { //get the list of contacts from DATABASe = same logic
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
   // contactTable.appendchild("<tr><td>"+contactes.Name+"</td><td>"+contactes.Email+"</td><td>"+contactes.Phone+"</td></tr>");
}
})

createCtr.addEventListener('click', function () {
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
})

//faire les requêtes AJAX:
// 1. pour la connection / login / logout
// 2. pour afficher les données des tableaux
// 3. modif tableaux pour modifier les données + requête AJAX
// 4. supprimer une colonne de tableau + requête AJAX
