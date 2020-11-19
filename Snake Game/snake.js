
(function(){
    'use strict';

    const canvas= document.getElementById("theCanvas");
    const context = canvas.getContext('2d');
    const SNAKE_SIZE = 64;

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
      testDirection(key, direction){
        switch (key) {
          case 'ArrowUp':
              if(direction !=='ArrowDown'){
                direction = key;
              }
              break;
          case 'ArrowDown':
            if(direction !=='ArrowUp'){
                direction = key;
              }
              break;
          case 'ArrowLeft':
            if(direction !=='ArrowRight'){
                direction = key;
              }
              break;
          case 'ArrowRight':
            if(direction !=='ArrowLeft'){
                direction = key;
              }
              break;
        }
        return direction;
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
      const gameOverAudio = new Audio();
      gameOverAudio.src = "https://www.myinstants.com/media/sounds/10-mario-died.mp3";

    
      snake.addEventListener('load',()=>{
        //const SNAKE_SIZE = 64;
        let speed = 4;
        let direction = 'ArrowRight';
        let score = 0;
       
        let appleElement = new GameElement(apple,getRandomCoordinate(canvas.width-16), getRandomCoordinate(canvas.height-16), SNAKE_SIZE );
        let snakeElement = new GameElement(snake, SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE, speed);
        let tails = [];
        
        snakeElement.draw();

        let interval = setInterval(()=>{
            context.clearRect(0,0, canvas.width, canvas.height);
            let oldSnakeX = snakeElement.x;
            let oldSnakeY = snakeElement.y;
            snakeElement.changeDirection(direction);
            
            tails.forEach((tail, index)=>{
             if(index === tails.length-1){
               tails.pop(tail);
               tails.unshift(tail);
               tail.x = oldSnakeX;
               tail.y = oldSnakeY;
             }
              //tail.changeDirection(direction);
              tail.draw();
            });
            snakeElement.draw();
            
            appleElement.draw();
            context.font = 'bold 48px serif';
            context.fillText(score, canvas.width-100, 50);

            eatApple();
            detectEdge(snakeElement.x, snakeElement.y);     
            //detectBody();    
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
                   
                    let index =tails.length-1;
                    let coordinates = getPosition(index);

                    tails.push(new GameElement(tail, coordinates[0], coordinates[1], snakeElement.size, snakeElement.speed));
                    
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
            if(x < 0 || x > (canvas.width-snakeElement.size) || y < 0 || y > (canvas.height- snakeElement.size)){
              gameOver();
        }
      }
        function gameOver(){
          gameOverAudio.play();
              clearInterval(interval);
              interval=0;
                             
               let highScore = localStorage.getItem('highScore') || 0;
               let message2='';
               let messageString = `Game Over!`;
               if(score > highScore){
                   localStorage.setItem('highScore', score);
                   message2 = (`<br>New High Score!! Your score is ${score}`);
               }
               else{
                message2 = (`<br>Your score is ${score}<br>High score is ${highScore}!`);
               }
               window.pcs.messageBox.show(messageString.concat(message2), true, ['Play Again'], playGame);
        }
          
      //  function detectBody(){
      //   tails.forEach((tail)=>{
      //       let changeX = Math.abs(snakeElement.x - tail.x);
      //       let changeY = Math.abs(snakeElement.y -tail.y);
      //           if(changeX < 30 && changeY < 30){
                   
      //              gameOver();
                    
      //           }
          
      //   });
      //  }

        document.addEventListener('keydown', e => {
          direction = snakeElement.testDirection(e.key, direction);
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
            let originalX;
            let originalY;
            if(tails.length > 0){
              originalX = tails[index].x;
              originalY = tails[index].y;
            }
            else{ 
              originalX = snakeElement.x;
              originalY = snakeElement.y;

            }
            switch (direction) {
              case 'ArrowLeft':
                x = originalX +SNAKE_SIZE;
                y = 0;
                break;
              case 'ArrowRight':
                x = originalX -SNAKE_SIZE;
                y = 0;
                break;
              case 'ArrowUp':
                y = originalY +SNAKE_SIZE;
                x = 0;
                break;
              case 'ArrowDown':
                y = originalY -SNAKE_SIZE;
                x = 0;
                break;
          }
          return [x, y];
        }

     });
    }

}());