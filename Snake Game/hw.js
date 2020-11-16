
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

    function playGame(){
        const snake = new Image();
        snake.src = 'images/snakehead.png';
        const snakeBody = new Image();
        snakeBody.src = 'images/body.png';
        const apple = new Image();
        apple.src = 'images/apple.png';
        const crunch = new Audio();
        crunch.src = "https://www.myinstants.com/media/sounds/munch-sound-effect.mp3";
        const winner = new Audio();
        winner.src = "https://www.myinstants.com/media/sounds/final-fantasy-v-music-victory-fanfare.mp3";
        const gameOver = new Audio();
        gameOver.src = "https://www.myinstants.com/media/sounds/10-mario-died.mp3";

        console.log("game called");
        snake.addEventListener('load',()=>{
        const SNAKE_SIZE = 32;
        let speed = 4;
        let direction = 'ArrowRight';
        let x = SNAKE_SIZE;
        let y= SNAKE_SIZE;
        let score = 0;
        let images = [snake];
        
        let deltaX;
        let deltaY;

        let appleX = getRandomCoordinate(canvas.width-16);
        let appleY = getRandomCoordinate(canvas.height -16);
      

        let interval = setInterval(()=>{
            context.clearRect(0,0, canvas.width, canvas.height);
            context.drawImage(snake, x, y, SNAKE_SIZE, SNAKE_SIZE);
            images.forEach((image, index)=>{
                context.drawImage(image, x + (deltaX * index+1), y+(deltaY * index +1), SNAKE_SIZE, SNAKE_SIZE);
            });
            
            context.drawImage(apple, appleX, appleY, SNAKE_SIZE, SNAKE_SIZE);

            context.font = 'bold 48px serif';
            context.fillText(score, canvas.width-100, 50);
          
            // let turnX;
            // let turnY;

            switch (direction) {
                case 'ArrowLeft':
                  x -= SNAKE_SIZE/speed;
                  x -= SNAKE_SIZE/speed;
                  deltaX = SNAKE_SIZE *1;
                  deltaY = 0;
                  break;
                case 'ArrowRight':
                  x += SNAKE_SIZE/speed;
                  deltaX = SNAKE_SIZE*-1;
                  deltaY = 0;
                  break;
                case 'ArrowUp':
                  y -= SNAKE_SIZE/speed;
                  deltaY = SNAKE_SIZE*1;
                  deltaX = 0;
                  break;
                case 'ArrowDown':
                  y += SNAKE_SIZE/speed;
                  deltaY = SNAKE_SIZE*-1;
                  deltaX = 0;
                  break;
            }
           // console.log(x,y);
            eatApple();
            detectEdge(x, y);         
            //console.log(x, y);
        }, 75);
        
        

      
        function eatApple(){
          
                let dX = Math.abs(x - appleX);
                let dY = Math.abs(y -appleY);
            
          
                if(dX < 30 && dY < 30){
                    appleX = getRandomCoordinate(canvas.width-16);
                    appleY = getRandomCoordinate(canvas.height - 16);
                    console.log("hit");
                    score++;
                    crunch.play();
                    images.push(snakeBody);
                }

              

                if(score=== 5){
                    speed= 3;
                    console.log('faster');
                }
                if(score === 10){
                    speed= 2.75;
                }
                if(score === 20){
                    speed= 2.5;
                }
           
        }

        function detectEdge(x, y){
            if(x === 0 || x === (canvas.width) || y === 0 || y === (canvas.height)){
                gameOver.play();
               clearInterval(interval);
              // console.log(canvas.width-16, canvas.width, x);
               interval=0;
               //modal game over, score, high score - store in local storage
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
            //console.log(e);
            switch (e.key) {
              case 'ArrowUp':
                  if(direction !=='ArrowDown'){
                    direction = e.key;
                  }
                  break;
              case 'ArrowDown':
                if(direction !=='ArrowUp'){
                    direction = e.key;
                  }
                  break;
              case 'ArrowLeft':
                if(direction !=='ArrowRight'){
                    direction = e.key;
                  }
                  break;
              case 'ArrowRight':
                if(direction !=='ArrowLeft'){
                    direction = e.key;
                  }
                  break;
            }
          });

          function getRandomCoordinate(x){
            let xCor = Math.floor(Math.random() * x);
            if(xCor % SNAKE_SIZE !== 0){
                //console.log(xCor,xCor % SNAKE_SIZE);
                getRandomCoordinate(x);
            } 
            return xCor;
          }

         
     });
    }
}());