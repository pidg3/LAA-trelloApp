var onAuthorize = function() {
    console.log("Login successful");
    updateLoggedIn();
    $("#output").empty();
    
    Trello.members.get("me", function(member){
        $("#fullName").text(member.fullName);
        
        var $cards = $("<div>") 
            .text("Loading Cards...")
            .appendTo("#output");

        // Output a list of all cards assigned to
            $cards.empty();
            $.each(cards, function(ix, card) {
                $("<a>")
                .attr({href: card.url, target: "trello"})
                .addClass("card")
                .text(card.name)
                .appendTo($cards);
            });  
        });

};

var updateLoggedIn = function() {
    var isLoggedIn = Trello.authorized();
    $("#loggedout").toggle(!isLoggedIn);
    $("#loggedin").toggle(isLoggedIn);        
};
    
var logout = function() {
    Trello.deauthorize();
    updateLoggedIn();
};
                          
Trello.authorize({
    type: "redirect",
      name: "LAA TV - Trello Viewer",
      scope: {
        read: true,
        write: false },
    success: onAuthorize,
    error: console.log("Login Failed")
});

$("#connectLink")
.click(function(){
    Trello.authorize({
        type: "popup",
        success: onAuthorize
    })
});
    
$("#disconnect").click(logout);

// test functions

Trello.get("members/me/cards", function(cards) {
    console.log(cards);
});