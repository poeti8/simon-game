// declare start and strict buttons 
const startBtn = document.getElementById('start');
const startLabel = document.getElementById('start-label');
const strictBtn = document.getElementById('strict');
const label = document.getElementById('label');

function initSimon(startBtn, startLabel, strictBtn, label) {
    
    // the whole simon game as an object
    class Plate {
        constructor(start, startLabel, strict, label) {
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
        
        // a method to add new steps
        addSteps() {
            let newStep = Math.floor(Math.random() * 4);
            this.steps.push(newStep);
            return this; 
        }
        
        // a method to show the steps
        showSteps() {
            let delayTime = 500;
            const that = this;
            for (let i = 0; i < that.steps.length; i++) {
              let delay = setTimeout(function(){
                that.buttons[(that.steps[i])].className = 'enabled';
                let sound = `sound-${that.buttons[(that.steps[i])].id}`;
                document.getElementById(sound).play();
                let clearDelay = setTimeout(function(){
                    that.buttons[0].className = '';
                    that.buttons[1].className = '';
                    that.buttons[2].className = '';
                    that.buttons[3].className = '';       
                }, 1000);
                if (i === that.steps.length - 1) {
                    that.userTurn = true;
                    that.userSteps = that.steps.slice(0);
                    that.level = that.level + 1;
                }
            }, delayTime);  
            delayTime += 1500;
            }
            return this;           
        }
        
        // method when user selects a wrong button
        error() {
            this.level = this.level - 1;
            this.label.innerHTML = 'Try Again';
            this.userSteps = this.steps.slice(0);
            let tryagain = setTimeout(() => {
                this.strictBtn.className === 'enabled' ? 
                this.reset().addSteps().showSteps() : 
                this.updateLabel().showSteps();
            }, 1000);
            return this;           
        }
        
        // method for starting the next level
        nextLevel() {
            if (this.level >= 21) {
                this.label.innerHTML = 'You Won!'; 
                this.userTurn = false;
                return this;
            } else if (this.level < 10 ) {
                this.label.innerHTML = `Level 0${this.level}`;
            } else {
                this.label.innerHTML = `Level ${this.level}`;
            }
            this.userTurn = false;
            this.addSteps();
            let delay = setTimeout(() => {
              this.showSteps();   
            }, 500)
            return this;           
        }
        
        // reset the parameters
        reset() {
            this.level = 1;
            this.label.innerHTML = 'Level 0' + '1';
            this.userTurn = false;
            this.steps = [];
            this.userSteps = [];
            return this;  
        }
        
        // update label when an error occured in non-stricted mode
        updateLabel() {
            if (simon.level < 10 ) {
                simon.label.innerHTML = `Level 0${simon.level}`;
            } else {
                simon.label.innerHTML = `Level ${simon.level}`;
            }
            return this;
        }
    }
    
    // create simon object
    const simon = new Plate(startBtn, startLabel, strictBtn, label);

    // start the game when the start button is clicked
    simon.startBtn.onclick = function(e) {
        if (this.className === 'start') {
            this.className = 'restart'; 
            simon.startLabel.innerHTML = "restart";
            simon.reset().addSteps().showSteps(); 
        } else {
            this.className = 'start';
            let flashBtn = setTimeout(() => {
                this.className = 'restart';
            }, 100);
            (simon.userTurn);
            if (simon.userTurn === true || simon.level >= 21) {
              simon.reset().addSteps().showSteps();  
            }
        }
        
    };

    // toggle the strict state
    simon.strictBtn.onclick = function(e) {
        this.className === 'enabled' ? 
            this.className = 'disabled' : this.className = 'enabled';
    }

    // user turn
    simon.buttons.forEach(function(item) {  
        item.onclick = function(e) {
            if (simon.userTurn === true) {
                this.className = 'enabled';
                simon.userTurn = false;
                let sound = `sound-${this.id}`;
                document.getElementById(sound).play();

                if (simon.buttons.indexOf(this) === simon.userSteps[0]) {
                    simon.userSteps.shift();
                    let duration = setTimeout(() => {
                        this.className = '';
                        simon.userTurn = true;
                        if (simon.userSteps.length < 1) {
                            simon.nextLevel();
                        }
                    }, 200);
                } else {
                    simon.error();
                    let duration = setTimeout(() =>{
                        this.className = '';
                    }, 1000);
                }

            } 
        }; 
    });
}

initSimon(startBtn, startLabel, strictBtn, label);
