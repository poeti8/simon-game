// declare start and strict buttons 
var startBtn = document.getElementById('start');
var startLabel = document.getElementById('start-label');
var strictBtn = document.getElementById('strict');
var label = document.getElementById('label');

function initSimon(startBtn, startLabel, strictBtn, label) {
    // the whole simon game as a object
    function Plate(start, startLabel, strict, label) {
        this.startBtn = start;
        this.startLabel = startLabel;
        this.strictBtn = strict;
        this.label = label;
        this.one = document.getElementById('one');
        this.two = document.getElementById('two');
        this.three = document.getElementById('three');
        this.four = document.getElementById('four');
        this.buttons = [one, two, three, four];
        this.steps = [];
        this.userSteps = [];
        this.userTurn = false;
        this.level = 1;
    }
    var simon = new Plate(startBtn, startLabel, strictBtn, label);

    // a method to add new steps
    Plate.prototype.addSteps = function() {
        var newStep = Math.floor(Math.random() * 4);
        this.steps.push(newStep);
        return this;
    }

    // a method to show the steps
    Plate.prototype.showSteps = function() {
        var delayTime = 500;
        var that = this;
        for (var i = 0; i < that.steps.length; i++) {
            (function(item) {
              var delay = setTimeout(function(){
                that.buttons[(that.steps[item])].className = 'enabled';
                var sound = 'sound-' + that.buttons[(that.steps[item])].id;
                document.getElementById(sound).play();
                var clearDelay = setTimeout(function(){
                    that.buttons[0].className = '';
                    that.buttons[1].className = '';
                    that.buttons[2].className = '';
                    that.buttons[3].className = '';       
                }, 1000);
                if (item === that.steps.length - 1) {
                    that.userTurn = true;
                    that.userSteps = that.steps.slice(0);
                    that.level = that.level + 1;
                }
            }, delayTime);  
            })(i);
            delayTime += 1500;
        }
        return this;
    }

    // method when user selects a wrong button
    Plate.prototype.error = function() {
        var that = this;
        console.log(that.level);
        that.level = that.level - 1;
        console.log(that.level);
        that.label.innerHTML = 'Try Again';
        that.userSteps = that.steps.slice(0);
        console.log(this.steps);
        var tryagain = setTimeout(function(){
            that.strictBtn.className === 'enabled' ? 
                that.reset().addSteps().showSteps() : 
                    that.updateLabel().showSteps();
        }, 1000);
        return this;
    }

    // method for starting the next level
    Plate.prototype.nextLevel = function() {
        var that = this;
        if (this.level >= 21) {
            this.label.innerHTML = 'You Won!'; 
            this.userTurn = false;
            return this;
        } else if (this.level < 10 ) {
            this.label.innerHTML = 'Level 0' + (this.level);
        } else {
            this.label.innerHTML = 'Level ' + (this.level);
        }
        this.userTurn = false;
        this.addSteps();
        var delay = setTimeout(function(){
          that.showSteps();   
        }, 500)
        return this;
    }

    // method for starting the next level
    Plate.prototype.reset = function() {
        this.level = 1;
        this.label.innerHTML = 'Level 0' + '1';
        this.userTurn = false;
        this.steps = [];
        this.userSteps = [];
        return this;
    }

    // update label when an error occured in non-stricted mode
    Plate.prototype.updateLabel = function() {
        if (simon.level < 10 ) {
            simon.label.innerHTML = 'Level 0' + simon.level;
        } else {
            simon.label.innerHTML = 'Level ' + simon.level;
        }
        return this;
    }

    // start the game when the start button is clicked
    simon.startBtn.onclick = function(e) {
        var that = this;
        if (that.className === 'start') {
            that.className = 'restart'; 
            simon.startLabel.innerHTML = "restart";
            simon.reset().addSteps().showSteps(); 
        } else {
            that.className = 'start';
            var flashBtn = setTimeout(function(){
                that.className = 'restart';
            }, 100);
            console.log(simon.userTurn);
            if (simon.userTurn === true || simon.level >= 21) {
                console.log(simon.userTurn);
              simon.reset().addSteps().showSteps();  
            }
        }
        
    };

    // toggle the strict state
    simon.strictBtn.onclick = function(e) {
        var that = this;
        that.className === 'enabled' ? 
            this.className = 'disabled' : this.className = 'enabled';
    }

    // user turn
    simon.buttons.forEach(function(item) {  
        item.onclick = function(e) {
            var that = this;
            if (simon.userTurn === true) {
                that.className = 'enabled';
                simon.userTurn = false;
                var sound = 'sound-' + that.id;
                document.getElementById(sound).play();

                if (simon.buttons.indexOf(that) === simon.userSteps[0]) {
                    simon.userSteps.shift();
                    var duration = setTimeout(function(){
                        that.className = '';
                        simon.userTurn = true;
                        if (simon.userSteps.length < 1) {
                            console.log('yeah');
                            simon.nextLevel();
                        }
                    }, 200);
                } else {
                    simon.error();
                    var duration = setTimeout(function(){
                        that.className = '';
                    }, 1000);
                }

            } 
        }; 
    });
}

initSimon(startBtn, startLabel, strictBtn, label);
