var Osero = []  //black:true,white:false,none:null
var CanSetOsero = false
const MESS_BLACK = "Black turn"
const MESS_WHITE = "White turn"
var Player = ""
var canvas = []
var OseroSetAudio = new Audio();
OseroSetAudio.src = "./mp3/Osero.mp3"

for(i=1;i<=64;i++){
    canvas.push(document.getElementById("can"+i))
}

window.addEventListener('DOMContentLoaded', (event) => {

    //Load JQuery
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.src = "./js/jquery-3.6.0.min.js";
    document.body.appendChild(script);

    ResetOsero()
});


//select Option
$('.option dd').hide();
$('.option dt').on('click',function(){
    $(this).next().slideToggle();    
});

function SelectPlayer(){
    var Player1 = document.getElementById("Player1").value
    var Player2 = document.getElementById("Player2").value 
    console.log("------")

    if(Player1=="CPU"){
        document.getElementById("Player1img").src = document.getElementById("Player1img").src.replace("boy","robo")
    }else{
        document.getElementById("Player1img").src = document.getElementById("Player1img").src.replace("robo","boy")        
    }
    if(Player2=="CPU"){
        document.getElementById("Player2img").src = document.getElementById("Player2img").src.replace("girl","robo")
    }else{
        document.getElementById("Player2img").src = document.getElementById("Player2img").src.replace("robo","girl")        
    }

}

function StartOsero(){
    CanSetOsero = true
    Player = "Player1"
    document.getElementById('PlayerScreen').style.display = "inline";
    document.querySelector('dd ul:nth-child(1)').style.display = "none";  
    document.querySelector('dd ul:nth-child(2)').style.display = "none";  
    document.getElementById('messageStyle').style.display = "inline";
    document.getElementById('message').innerHTML = MESS_BLACK
    document.getElementById("StartButton").disabled = true
    PlayerInfo()
}
function ResetOsero(){

    //Osero List Clear
    Osero.splice(0)
    for (i=0;i<8;i++){
         Osero.push([null,null,null,null,null,null,null,null])
    }

    //Initial Set
    DrawOsero("can28","black",false)
    Osero[3][3] = true
    DrawOsero("can29","white",false)
    Osero[3][4] = false
    DrawOsero("can36","white",false)
    Osero[4][3] = false
    DrawOsero("can37","black",false)
    Osero[4][4] = true

    for(i=0;i<64;i++){
        if(i==27||i==28||i==35||i==36){
            continue;
        }
        var ctx = canvas[i].getContext("2d") 
        ctx.clearRect(0, 0, 100, 100);
    }

    CanSetOsero = false
    document.getElementById('PlayerScreen').style.display = "none";
    document.querySelector('dd ul:nth-child(1)').style.display = "inline";
    document.querySelector('dd ul:nth-child(2)').style.display = "inline";
    document.getElementById('message').innerHTML = "";
    document.getElementById('messageStyle').style.display = "none";
    document.getElementById("StartButton").disabled = false
    document.getElementById("Player1img").src = "../Osero/image/boy_init.png"        
    document.getElementById("Player2img").src = "../Osero/image/girl_init.png"
    document.getElementById("Player1").value = "Player"
    document.getElementById("Player2").values = "Player"

}
function PlayerInfo(){
    var Player1 = document.getElementById("Player1").value
    var Player2 = document.getElementById("Player2").value 

    alert("Game Starts!\n\nPlayer1 : "+Player1+"\nPlayer2 : "+Player2)
}

/**
 * Get PlayerColer 
 * @return String color
 * */
function GetColor(){
    var color = ""
    if(Player =="Player2"){
        color = "white"
    }else{
        color = "black"
    }
    return color;
}

/**
 * Put Osero 
 * @param id
 * @param Player
 * */
function SetOsero(id,Player){
    if(CheckExecOsero(id,GetColor(),false)){
        return true
    }
    return false
}

/**
 * Check a Canvas You can select
 * */
function PreCheck(){
    var isAvailable = false;
    for(var i=1;i<64;i++){
        if(CheckExecOsero("can"+i,GetColor(),true)){
            isAvailable = true;
            break;
        }
    }

    if(isAvailable==false){
        //NextPlayer can not set Osero
        var LastPlayer = Player
        ChangeTurnInfo()
        for(var i=1;i<64;i++){
            if(CheckExecOsero("can"+i,GetColor(),true)){
                isAvailable = true;
                break;
            }
        }
        if(isAvailable==false){
            //end process
            sleep(100);    
            EndProcess();
            return;
            
        }else{
            alert("Status:"+ LastPlayer+" pass! \n\n"+Player+" turn!")
        }
    }

    CanSetOsero = true;
    
}

/**
 * Mouse Over the Osero
 * */
 function MouseOverOsero(){
  if(CanSetOsero){
    if (CheckExecOsero(event.target.id,GetColor(),true)){
        DrawOsero(event.target.id,GetColor(),false)
    }
  }
}
/**
 * Mouse Out the Osero
 * */
 function MouseOutOsero(){
    var canvasIndex = event.target.id.replace("can","")

    var ctx = canvas[canvasIndex-1].getContext("2d") 

    var num = Number(canvasIndex)
    var y = Math.ceil(num/8) - 1 
    var x = (num-1) % 8
    if(Osero[y][x] == null){
        ctx.clearRect(0, 0, 100, 100);
    }
}

/**
 * Put Osero (Click a paticular canvas)
 * */
function PutOsero(){
    if (CanSetOsero){
        CanSetOsero = false;
        if(SetOsero(event.target.id,Player)){
            ChangeTurnInfo()
        }
        PreCheck()
    }
}

/**
 * Change Turn Information
 * */
function ChangeTurnInfo(){
    if(Player == "Player2"){
        Player = "Player1" 
        document.getElementById('message').innerHTML = MESS_BLACK                   
    }else{
        Player = "Player2"     
        document.getElementById('message').innerHTML = MESS_WHITE
    }
}

/**
 * Draw Canvas(Osero)
 * @param id
 * @param color
 * @param isTransparent
 * */
function DrawOsero(id,color,isTransparent){
    var ctx = canvas[id.replace("can","")-1].getContext("2d")
    ctx.beginPath();
    
    if(isTransparent){
        ctx.globalAlpha = 0.01;
    }
    ctx.arc(25, 25, 25, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill() ;
    ctx.stroke();
}

/**
 * Check Or Execute Osero
 * @param id
 * @param color
 * @param isCheckOnly //True:Check Only,False Check and Execute
 * */ 
function CheckExecOsero(id,color,isCheckOnly){
    var isSet = false
    var num = Number(id.replace("can",""))
    var y = Math.ceil(num/8) -1 
    var x = (num-1) % 8

    if(Osero[y][x]!= null)
        return false
    else{

        var count = 0
        var i =0
        var isBlack
        if(color=="black"){
            isBlack =true
        }else{
            isBlack =false
        }

        //upper side check
        for(i=1;i<=y;i++){
            if(Osero[y-i][x]==isBlack||Osero[y-i][x]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=y
            &&Osero[y-i][x]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y-j][x] = isBlack
                    DrawOsero("can"+(num-j*8),color,false)
                    OseroSetAudio.play();       
                    sleep(100);           
                }
            }
            isSet = true
        }
        count = 0
   
        //bottom side check
        for(i=1;i<=7-y;i++){
            if(Osero[y+i][x]==isBlack||Osero[y+i][x]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            && i<=7-y
            &&Osero[y+i][x]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y+j][x] = isBlack
                    DrawOsero("can"+(num+j*8),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
                }
            }
            isSet = true
        }
        count = 0
   
        //left side check
        for(i=1;i<=x;i++){
            if(Osero[y][x-i]==isBlack||Osero[y][x-i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=x
            &&Osero[y][x-i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y][x-j] = isBlack
                    DrawOsero("can"+(num-j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
                }
            }
            isSet = true
        }
        count = 0

        //right side check
        for(i=1;i<=7-x;i++){
            if(Osero[y][x+i]==isBlack||Osero[y][x+i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=7-x
            &&Osero[y][x+i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y][x+j] = isBlack
                    DrawOsero("can"+(num+j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
    
                }
            }
            isSet = true
        }
        count = 0

        //upper right side check
        for(i=1;i<=y;i++){
            if(Osero[y-i][x+i]==isBlack||Osero[y-i][x+i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=y
            &&Osero[y-i][x+i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y-j][x+j] = isBlack
                    DrawOsero("can"+(num-7*j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       

                }
            }
            isSet = true
        }    
        count = 0
            
        //upper left side chieck
        for(i=1;i<=y;i++){
            if(Osero[y-i][x-i]==isBlack||Osero[y-i][x-i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=y
            &&Osero[y-i][x-i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y-j][x-j] = isBlack
                    DrawOsero("can"+(num-9*j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
                }
            }
            isSet = true
        }
        count = 0
        
        //bottom left side check
        for(i=1;i<=7-y;i++){
            if(Osero[y+i][x-i]==isBlack||Osero[y+i][x-i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=7-y
            &&Osero[y+i][x-i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y+j][x-j] = isBlack
                    DrawOsero("can"+(num+7*j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
                }
            }
            isSet = true
        }
        count = 0

        //bottom right side check
        for(i=1;i<=7-y;i++){
            if(Osero[y+i][x+i]==isBlack||Osero[y+i][x+i]==null)
                break;
            else
                count++;        
        }
        if(count!=0
            &&i<=7-y
            &&Osero[y+i][x+i]==isBlack){
            for(var j=0;j<=count;j++){
                if(!isCheckOnly){
                    Osero[y+j][x+j] = isBlack
                    DrawOsero("can"+(num+9*j),color,false)
                    OseroSetAudio.play();
                    sleep(100);       
                }
            }
            isSet = true
        }
        count = 0

    //final decision
    if(isSet)
        return true
    else
        return false   
        
    }
}
function sleep(waitSec) {
    var InitialSec = new Date();
    
    while (new Date() - InitialSec < waitSec);
}
function EndProcess(){

    document.getElementById('message').innerHTML = "End Game"
    var blackCount = 0;
    var whiteCount = 0;

    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            if(Osero[i][j]==null){
                continue;
            }else if(Osero[i][j]==true){
                blackCount++;
            }else{
                whiteCount++;
            }
        }
    }
    if(blackCount==whiteCount){
        document.getElementById("Player1img").src = document.getElementById("Player1img").src.replace("init","win")        
        document.getElementById("Player2img").src = document.getElementById("Player2img").src.replace("init","win")            
    }else if(blackCount > whiteCount){
        document.getElementById("Player1img").src = document.getElementById("Player1img").src.replace("init","win")        
        document.getElementById("Player2img").src = document.getElementById("Player2img").src.replace("init","lose")            
    }else{
        document.getElementById("Player1img").src = document.getElementById("Player1img").src.replace("init","lose")        
        document.getElementById("Player2img").src = document.getElementById("Player2img").src.replace("init","win")            
    }
    
    sleep(100); 

    alert("End Game\n\nBlack:"+blackCount+"  White:"+whiteCount);
    CanSetOsero = false;
    
}
