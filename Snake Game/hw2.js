
(function(){
    'use strict';

    const canvas= document.getElementById("theCanvas");
    const context = canvas.getContext('2d');

    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

      
   
      
         
     

    window.pcs.messageBox.show(
        "Ready to Play?",
        true,
        ["Lets Go!"],
        playGame
    );

   

    class GameElement{
      constructor(image, x, y, size, speed){
        this.image = image;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        //this.direction = direction;
      }
      draw(){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
      }
      changeDirection(direction){

        switch (direction) {
          case 'ArrowLeft':
            this.x -= this.size/this.speed;
            break;
          case 'ArrowRight':
            this.x += this.size/this.speed;
            break;
          case 'ArrowUp':
            this.y -= this.size/this.speed;
            break;
          case 'ArrowDown':
            this.y += this.size/this.speed;
            break;
      }
      }
    }

    class SnakeBody extends GameElement{
      changeDirection(direction){

        switch (direction) {
          case 'ArrowLeft':
            this.x -= this.size/this.speed;
      
            break;
          case 'ArrowRight':
            this.x += this.size/this.speed;
            break;
          case 'ArrowUp':
            this.y -= this.size/this.speed;
            break;
          case 'ArrowDown':
            this.y += this.size/this.speed;
            break;
        }
      }
    }

    function playGame(){
      const snake = new Image();
      snake.src = 'images/snakehead.png';
      const tail = new Image();
      tail.src = 'images/body.png';
      const apple = new Image();
      apple.src = 'images/apple.png';
      const crunch = new Audio();
      crunch.src = "https://www.myinstants.com/media/sounds/munch-sound-effect.mp3";
      const winner = new Audio();
      winner.src = "https://www.myinstants.com/media/sounds/final-fantasy-v-music-victory-fanfare.mp3";
      const gameOver = new Audio();
      gameOver.src = "https://www.myinstants.com/media/sounds/10-mario-died.mp3";

    
      snake.addEventListener('load',()=>{
        const SNAKE_SIZE = 32;
        let speed = 4;
        let direction = 'ArrowRight';
        let score = 0;
       
        let appleElement = new GameElement(apple,getRandomCoordinate(canvas.width-16), getRandomCoordinate(canvas.height-16), SNAKE_SIZE );
        let snakeElement = new GameElement(snake, SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE, speed);
        let tails = [];
        snakeElement.draw();

        let interval = setInterval(()=>{
            context.clearRect(0,0, canvas.width, canvas.height);
            snakeElement.changeDirection(direction);
            snakeElement.draw();
            tails.forEach((tail)=>{
                tail.changeDirection(direction);
                tail.draw();
            });
            
            appleElement.draw();
            context.font = 'bold 48px serif';
            context.fillText(score, canvas.width-100, 50);

            eatApple();
            detectEdge(snakeElement.x, snakeElement.y);         
        }, 75);
        
        
     
      
        function eatApple(){
          
                let dX = Math.abs(snakeElement.x - appleElement.x);
                let dY = Math.abs(snakeElement.y -appleElement.y);
            
          
                if(dX < 30 && dY < 30){
                    appleElement.x = getRandomCoordinate(canvas.width-16);
                    appleElement.y = getRandomCoordinate(canvas.height - 16);
                    console.log("hit");
                    score++;
                    crunch.play();
                   
                    let coordinates = getPosition(tails.length-1);

                    tails.push(new SnakeBody(tail, snakeElement.x +coordinates[0], snakeElement.y +coordinates[1], snakeElement.size, snakeElement.speed));
                    
                }

                if(score=== 5){
                    changeSpeed(3);
                }
                if(score === 10){
                   changeSpeed(2.75);
                }
                if(score === 20){
                    changeSpeed(2.5);
                }
           
        }

        function detectEdge(x, y){
            if(x === 0 || x === (canvas.width-snakeElement.size/2) || y === 0 || y === (canvas.height- snakeElement.size/2)){
              gameOver.play();
              clearInterval(interval);
              interval=0;
              console.log(x, y);
               
               let highScore = localStorage.getItem('highScore') || 0;
               let message2='';
               let messageString = `Game Over!`;
               if(score > highScore){
                   localStorage.setItem('highScore', score);
                   message2 = (`<br><br>New High Score!! Your score is ${score}`);
               }
               else{
                message2 = (`<br><br>Your score is ${score}<br><br>High score is ${highScore}!`);
               }
               window.pcs.messageBox.show(messageString.concat(message2), true, ['Play Again'], playGame);
            }
        }
        document.addEventListener('keydown', e => {
          direction = e.key;
          snakeElement.changeDirection(direction);
          tails.forEach(tail =>{
            tail.changeDirection(direction);
          });
         
        });

          function getRandomCoordinate(x){
            let xCor = Math.floor(Math.random() * x);
            if(xCor % SNAKE_SIZE !== 0){
                getRandomCoordinate(x);
            } 
            return xCor;
          }

          function changeSpeed(speed){
            snakeElement.speed= speed;
            tails.forEach(tail=>{tail.speed = speed;});
          }

          function getPosition(index){
            let x;
            let y;
            switch (direction) {
              case 'ArrowLeft':
                x = snakeElement.size * (index+1);
                y = 0;
                break;
              case 'ArrowRight':
                x = snakeElement.size*-(index+1);
                y = 0;
                break;
              case 'ArrowUp':
                y = snakeElement.size*(index+1);
                x = 0;
                break;
              case 'ArrowDown':
                y = snakeElement.size*-(index+1);
                x = 0;
                break;
          }
          return [x, y];
        }
     });
    }
 
}());