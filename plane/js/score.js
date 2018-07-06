function Score() {
    this.score = 0;
}

Score.prototype = {
    constructor: Score,
    add: function() {
        this.score++;
        this.setScore();
    },
    setScore: function() {
        var scores = document.getElementsByClassName('score');
        for (var i = 0; i < scores.length; i++) {
            scores[i].innerText = this.score;
        }
    },
    reset: function() {
        this.score = 0;
        this.setScore();
    },
    init: function() {
        this.setScore();
    }
}