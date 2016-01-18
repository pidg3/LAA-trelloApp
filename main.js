var displayedBoards = []; // used to hold board with 'Trello-API' label

var updateLoggedIn = function() { // tells Trello logged in
    var isLoggedIn = Trello.authorized();
    $('#loggedout').toggle(!isLoggedIn);
    $('#loggedin').toggle(isLoggedIn);
}; 

// TODO - clear all data when log out without having to refresh page (to use KnockoutJS for better bindings?)

$('#connectLink').click(function() {
    Trello.authorize({
    type: 'popup',
      name: 'LAA TV - Trello Viewer',
      scope: {
        read: true,
        write: false }, // does not allow to edit any Trello data
    success: onAuthorize, // triggers main function
    error: console.log('Login Failed') // TODO - this triggers with every login, must be an error with login
    })
});

$('#disconnect').click(function() {
    Trello.deauthorize();
    updateLoggedIn();
    });

var onAuthorize = function() {

    console.log('Login Successful');
    updateLoggedIn();
    $('#output').empty();

    Trello.members.get('me', function(member){ // add full name
        $('#fullName').append(member.fullName);
    });
    
    Trello.members.get('me/boards', function(boards){ // add board list, where contain 'Trello-API' label text (doesn't matter whether actually used)

        for (var i = 0; i < boards.length; i++) { // iterate over *all* boards TODO - remove archived boards

            for (var label in boards[i].labelNames) { // labelNames is part of API call - JSON object e.g. red : "Trello-API"

                if (boards[i].labelNames[label] === 'Trello-API') { // if has 'Trello-API label set up'
                    $('#board-list').append(boards[i].name + ': ' + label + ' label<br>'); // ...display board name with label colour
                    displayedBoards.push(boards[i]); // ...and push object data to array for use later
                }
            }
        }

        // TODO - refactor everything below
        // issue is delays in retrieving HTTP GET data via API - might 
        // need to think about performance with this. Webhooks?

        for (var i = 0; i < displayedBoards.length; i++) { // add board headings (could be included below)
            $('#main-list').append('<div id="board-' + i + '"><h2>' + displayedBoards[i].name + '</h2></div>'); 
        }

        var listCounter = 0; // TODO - take out workaround. Needed due to delays in API retrieval

        for (var i = 0; i < displayedBoards.length; i++) {

            Trello.boards.get(displayedBoards[i].id + '?lists=open', function(board){ // get boards including lists (of cards)
                for (var j = 0; j < board.lists.length; j++) {
                    $('#board-' + listCounter).append('<h3>' + board.lists[j].name + '</h3>'); // append under correct board title
                }

                console.log(listCounter);
                listCounter++;

            });
        }
    });

};

