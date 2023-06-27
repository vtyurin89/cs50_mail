document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

//  document.querySelector('#compose-send').addEventListener('click', send_email);

    // send
      document.querySelector('#compose-form').onsubmit = () => {
      const composeRecipients = document.querySelector('#compose-recipients').value;
      const composeSubject = document.querySelector('#compose-subject').value;
      const composeBody = document.querySelector('#compose-body').value;

        fetch('/emails', {
          method: 'POST',
          body: JSON.stringify({
              recipients: composeRecipients,
              subject: composeSubject,
              body: composeBody,
          })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
        load_mailbox('sent');
}

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //show emails list
    const route = `/emails/${mailbox}`
    fetch(route)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

    emails.forEach((element) => {
    const oneMail = document.createElement('div');
    if (mailbox == 'sent') {
        oneMail.innerHTML = `<div class="d-flex justify-content-between border p-1" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
        <div>${element.recipients}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
    } else {
        if (element.read) {
            oneMail.innerHTML = `<div class="d-flex bg-light justify-content-between border p-1" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
            <div>${element.sender}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
        } else {
        oneMail.innerHTML = `<div class="d-flex bg-secondary text-white justify-content-between border p-1" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
        <div>${element.sender}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
        }
    }
    document.querySelector('#emails-view').append(oneMail);
    });
    });
}

function load_letter(element_id) {
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-view').innerHTML = "";

    //load email
    const route = `/emails/${element_id}`
    fetch(route)
    .then(response => response.json())
    .then(email => {
    // Print email
    console.log(email);
    const oneMail = document.createElement('div');
    oneMail.innerHTML = `${email.subject}`

    document.querySelector('#emails-view').append(oneMail);
});
}