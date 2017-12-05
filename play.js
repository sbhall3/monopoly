function rollDice() {
    return rollDie() + rollDie();
}

function rollDie() {
    return Math.floor(Math.random() * 7) + 1;
}

function updateBalance(player, amount) {
    player.balance += amount;
}

function movePiece(player, direction, destination) {
    if (direction > 0 && destination != "jail" && destination < player.currentpos) {
        // Moving forward to or past Go, but not going to jail
        updateBalance(player, +200);
    }
    player.currentpos = destination;
    checkForSale();
}

function drawCard(player, deck) {
    var card = deck.shift();
    // console.log(card.title);
    card.act(player);
    deck.push(card);
}

function shuffle(deck) {
    // Fisher-Yates shuffle
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor((i + 1) * Math.random());
        var swap = deck[i];
        deck[i] = deck[j];
        deck[j] = swap;
    }
}

//////////////////////// CARD TYPES ////////////////////////

function AbsMoveCard(title, destination) {
    this.title = title;
    this.destination = destination;
}

AbsMoveCard.prototype.act = function(player) {
    // All logic about current position, bonus for passing Go, and checking
    // for property sale should be included in movePiece().
    movePiece(player, +1, this.destination);
};

function RelMoveCard(title, distance) {
    this.title = title;
    this.distance = distance;
}

RelMoveCard.prototype.act = function(player) {
    // All logic about current position, bonus for passing Go, and checking
    // for property sale should be included in movePiece().
    movePiece(player, this.distance, (player.currentpos + 40 + this.distance) % 40);
}

function MoneyCard(title, amount) {
    this.title = title;
    this.amount = amount;
}

MoneyCard.prototype.act = function(player) {
    updateBalance(player, this.amount);
}

function AssessmentCard(title, perHouse, perHotel) {
    this.title = title;
    this.perHouse = perHouse;
    this.perHotel = perHotel;
}

AssessmentCard.prototype.act = function(player) {
    updateBalance(player, player.houseCount * this.perHouse +
                          player.hotelCount * this.perHotel);
}

/////////////////////////// CARDS ///////////////////////////

var chanceCards = [
    // "Go" should be position 0 rather than 40
    new AbsMoveCard("Advance to go", 0),
    new AbsMoveCard("Advance to London", 39),
    new AbsMoveCard("Your ass is going to jail", "jail"),
    new AbsMoveCard("Advance to Rome", 24),
    new AbsMoveCard("Advance to Charles de Gaulle", 15),
    new AbsMoveCard("Advance to Amsterdam", 11),
    new RelMoveCard("Go back 3 spaces", -3),
    new MoneyCard("No drink and driving mate!", -20),
    new MoneyCard("Get out of Jail free card", -150),
    new MoneyCard("Pay school fees", -150),
    new MoneyCard("Speeding fine", -150),
    new MoneyCard("Bank pays you dividend", +40),
    new MoneyCard("You have won the competition", +200),
    new MoneyCard("Your building loan matures", +200),
    new AssessmentCard("You are assessed for street repairs $40 per house $115 per hotel", -40, -115),
    new AssessmentCard("House repairs $25 per house $100 per hotel", -25, -100),
];

var chestCards = [
    new AbsMoveCard("Advance to go", 0),
    new AbsMoveCard("Advance to Cairo", 1),
    new AbsMoveCard("Go to Jail", "jail"),
    new MoneyCard("Pay hospital fees", -100),
    new MoneyCard("Pay doctor fees", -50),
    new MoneyCard("Pay insurance premium", -50),
    new MoneyCard("Bank error. Collect $200", +200),
    new MoneyCard("Annuity matures. Collect $100", +100),
    new MoneyCard("You inherit $100", +100),
    new MoneyCard("From sale of stock you get $50", +50),
    new MoneyCard("Preference shares: $25", +25),
    new MoneyCard("You have won second prize in a beauty contest. Collect $10.", +10),
    new MoneyCard("It is your birthday. Collect $10.", +10),
    new MoneyCard("You win the lottery. Collect $10", +10),
];

shuffle(chanceCards);
shuffle(chestCards);
