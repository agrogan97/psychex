class MyGame extends Game {
    constructor(){
        super()
        this.roundIndex = 0;
        this.data.rounds = {};

        // Define some game settings we might want, like the deck to show and the preset draws
        this.gameSettings = {
            deck: [1, 2, 3, 4, 5, 6, 7, 8],
            draws: [4, 1, 6, 7, 3],
            cumulativeScore: 0
        }
    }

    start(){
        if (this.roundIndex != 0){
            // this.nextRound();
            content.deck.reset();
            content.wheel.img.setRotate(0);
            content.wheel.rotationAngle = 0;
        }
        // Shuffle the deck and draw 2 cards, then spin the wheel
        this.drawnCard = this.gameSettings.draws[this.roundIndex]
        this.randCard = _.sample(this.gameSettings.deck.filter(i => i != this.drawnCard));
        // Randomly pick if the target card will be first or second (which equates to blue or red)
        let drawnCardPos = _.sample([0, 1]);
        let pair = (drawnCardPos == 0 ? [this.drawnCard, this.randCard] : [this.randCard, this.drawnCard]);
        console.log(pair)
        content.drawCardBtn.toggleClickable();
        content.deck.multiShuffleAndDraw(6, pair)
            .then(() => {

                // Inform the player they can hold down the spin button to spin the wheel - update instruction text
                // TODO bug here can't insert newline into text?
                content.instructions.text = "Hold space to spin and release to stop."

                content.wheel.target = (drawnCardPos == 0 ? "blue" : "red");
                content.wheel.spinningAllowed = true;
                content.wheel.expectingSpin = true;
                setTimeout(() => {
                    this.handleSpin();
                }, 1000);
                

            })
            .catch(() => {console.log("Error ")})
    }

    handleSpin(){
        // content.wheel.spin()
        // query if the wheel is still spinning
        console.log(`Wheel spinning? ${content.wheel.isSpinning}`)
        let spinningInterval = setInterval(() => {
            if (!content.wheel.isSpinning && !content.wheel.expectingSpin){
                try {
                    content.deck.drawnCards.filter(i => i.value != this.drawnCard)[0].toggleDisplay();    
                } catch (error) {
                    // Catch in case we draw 2 of the same
                    content.deck.drawnCards[0].toggleDisplay();
                }
                this.data.rounds[this.roundIndex] = {
                    drew: this.drawnCard,
                    randCard: this.randCard,
                    feedback: ''
                }
                // Add new score to cumulative score
                this.gameSettings.cumulativeScore += this.drawnCard;
                // Update chart data - NB: cumulative score
                addChartData(this.gameSettings.cumulativeScore, this.roundIndex+1) // score, label
                clearInterval(spinningInterval);

                // Increase round score
                this.roundIndex += 1;
                if (this.roundIndex == 5){
                    this.endGame();
                } else {
                    content.drawCardBtn.toggleClickable();
                    content.instructions.text = "Click Draw to draw another card." 
                }
                
            }
        }, 1000)
        
    }

    endGame(){
        content.instructions.text = `Final score: ${this.gameSettings.cumulativeScore}`;
        content.drawCardBtn.text.text = "Done!";
    }

    nextRound(){
        content.deck.reset();
        // setTimeout(() => {
        //     this.start();
        // }, 500)
    }
}