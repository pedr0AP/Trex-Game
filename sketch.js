var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var morte;
var checkpoint;
var pulo;

var imggameOver;
var imgrestart;

var gameOver;
var restart;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao=0;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  pulo = loadSound("jump.mp3")
  checkpoint = loadSound("checkPoint.mp3")
  morte = loadSound("die.mp3")
  
  
  imggameOver = loadImage("gameOver-1.png");
  imgrestart = loadImage("restart.png");
  
}

function setup() {
// var mensagem="oi"
 
  
  createCanvas(600, 200);
    
  restart=createSprite(300,100,50,50);
  gameOver=createSprite(300,170,50,50);
  gameOver.scale= 0.5;
  restart.visible=false;  
  restart.addImage(imgrestart);
  gameOver.addImage(imggameOver);
  gameOver.visible=false;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();

  // console.log("Oi" + 5);
  
 // trex.debug=true
  trex.setCollider("circle", 0, 0, 40)
 
}

function draw() {
 // console.log(mensagem);
  
  background("white");
  text("Pontuação: "+ pontuacao, 500,50);
  
  if(estadoJogo === JOGAR){
    if (grupodeobstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR
      morte.play();
    } 
    
    if(pontuacao>0 && pontuacao%100 == 0){
      checkpoint.play();
    } 
    
    pontuacao = pontuacao + Math.round(frameRate()/60)   
    
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    
    //mover o solo
    solo.velocityX = -4;
       
    if(keyDown("space")&& trex.y >= 160) {
       trex.velocityY = -13;
       pulo.play();
       }
  
    trex.velocityY = trex.velocityY + 0.8
   
    if (solo.x < 0){
       solo.x = solo.width/2;
    }
  }
  
  else if(estadoJogo === ENCERRAR){
    //parar o solo
    solo.velocityX = 0;
  grupodeobstaculos.setVelocityXEach(0);
  grupodeobstaculos.setLifetimeEach(-1);
      
    grupodenuvens.setVelocityXEach(0);  
    grupodenuvens.setLifetimeEach(-1);
  
    restart.visible=true;
    gameOver.visible=true;
    
    trex.changeAnimation("collided", trex_colidiu);
  
    if(mousePressedOver(restart)){
      Reiniciar();
      pontuacao=0;
  }
}
 
    trex.collide(soloinvisivel);
     
    drawSprites();
}

function gerarObstaculos(){

  if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -(6+pontuacao / 5000);
       
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {

  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }

}

function Reiniciar(){
    estadoJogo = JOGAR;
    gameOver.visible=false;
   restart.visible=false;
    grupodeobstaculos.destroyEach();
    grupodenuvens.destroyEach();
    trex.changeAnimation("running");
      
}