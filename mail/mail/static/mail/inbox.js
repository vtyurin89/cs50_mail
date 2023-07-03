document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Active nav link
  const navLinks = document.querySelectorAll('nav a').forEach(link => {
  if (link.id == 'compose') {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
  })

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
        location.reload();
        }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Active nav link
  const navLinks = document.querySelectorAll('nav a').forEach(link => {
  if (link.id == mailbox) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
  })


  //show emails list
    const route = `/emails/${mailbox}`
    fetch(route)
    .then(response => response.json())
    .then(emails => {

    emails.forEach((element) => {
    const oneMail = document.createElement('div');
    if (mailbox == 'sent') {
        oneMail.innerHTML = `<div class="d-flex bg-light justify-content-between border p-1 rounded" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
        <div>${element.recipients}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
    } else {
        if (element.read) {
            oneMail.innerHTML = `<div class="d-flex bg-light justify-content-between border p-1 rounded" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
            <div>${element.sender}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
        } else {
        oneMail.innerHTML = `<div class="d-flex bg-secondary text-white justify-content-between border p-1 rounded" onclick="load_letter(${element.id})" onmouseover="this.style.cursor='pointer';">
        <div>${element.sender}</div><div>${element.subject}</div><div>${element.timestamp}</div><div>`;
        }
    }
    document.querySelector('#emails-view').append(oneMail);
    });
    });
}


function load_letter(element_id) {

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-content').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    //load email
    const myMail = document.getElementById('my-mail').innerHTML;
    const route = `/emails/${element_id}`
    fetch(route)
    .then(response => response.json())
    .then(email => {
    // Print email
        document.querySelector('#email-content').innerHTML = `
            <div class="d-flex justify-content-between">
            <h3 class="mb-0" id="email-header">${email.subject}</h3>
            <div>
            <button class="btn btn-sm btn-outline-primary" id="button-archive" href="#">Archive</button>
            <button class="btn btn-sm btn-outline-primary" id="button-unarchive" href="#">Unarchive</button>
            <button class="btn btn-sm btn-outline-primary" id="button-reply" href="#">Reply</button>
            </div>
        </div>
         <div class="d-flex flex-start mt-3">
              <div class=""><span class="img-placeholder"></span></div>
              <div class="ml-3 w-100">
                <h6 class="fw-bold mb-1" id="email-sender">${email.sender}</h6>
                <span class="text-secondary mb-1 mr-1">To:</span><span class="text-secondary mb-1" id="email-recipients">${email.recipients}</span>
                <p class="text-secondary mb-1 mr-1" id="email-timestamp">${email.timestamp}</p>
                <hr>
                <p class="mb-0" id="email-body" style="white-space: pre-wrap">${email.body}
                </p>
              </div>
            </div>
    `

        //mark email as read
    if (!email.read) {
        fetch(route, {
        method: 'PUT',
        body: JSON.stringify({
        read: true
  })
})
    }

    //button visibility and reply
    if (email.sender !== myMail) {
        document.querySelector('#button-reply').style.display = 'inline-block';
        document.querySelector('#button-reply').addEventListener('click', function() {

            compose_email();
            console.log(email);
            document.querySelector('#compose-recipients').value = `${email.sender}`;
              document.querySelector('#compose-body').value = `

---------------------------------------------
On ${email.timestamp} ${email.sender} wrote:
${email.body}
`;
        if (email.subject.startsWith('Re:')) {
        document.querySelector('#compose-subject').value = `${email.subject}`;
        } else {
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        }
        document.querySelector('#compose-body').focus();
        document.querySelector('#compose-body').setSelectionRange(0,0);
        });
    if (email.archived) {
    document.querySelector('#button-archive').style.display = 'none';
    document.querySelector('#button-unarchive').style.display = 'inline-block';
    document.querySelector('#button-unarchive').addEventListener('click', () => unarchive_letter(element_id));
    } else {
        document.querySelector('#button-unarchive').style.display = 'none';
        document.querySelector('#button-archive').style.display = 'inline-block';
        document.querySelector('#button-archive').addEventListener('click', () => archive_letter(element_id));
    }
    } else {
        document.querySelector('#button-archive').style.display = 'none';
        document.querySelector('#button-unarchive').style.display = 'none';
        document.querySelector('#button-reply').style.display = 'none';
    }
});
}


    //archive letter
function archive_letter(element_id) {
    const arc_route = `/emails/${element_id}`;
    fetch(arc_route, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
    })

    load_mailbox('inbox');
    location.reload();
}


function unarchive_letter(element_id) {
    const arc_route = `/emails/${element_id}`;
    fetch(arc_route, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
    })

    load_mailbox('inbox');
    location.reload();
}
