let blackjackGame = {
    'you' : {'scoreSpan': '#your-blackjack-result', 'div' : '#your-box', 'score' : 0}
  ,  'dealer' : {'scoreSpan': '#dealer-blackjack-result', 'div' : '#dealer-box', 'score' : 0}
    , 'card': ['2', '3' ,'4' ,'5' ,'6' ,'7' ,'8' ,'9' ,'10', 'K','J','Q','A'],
    'cardMap': {'2' : 2, '3': 3 ,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'K': 10,'J':10,'Q':10,'A': 11 }
    ,'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false,
}


let i = 1;
const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
const HITSOUND = new Audio('sounds/swish.m4a')
const  WINSOUND = new Audio('sounds/cash.mp3')
const LOSTSOUND = new Audio('sounds/aww.mp3')

const btnHit = document.querySelector("#blackjack-hit-btn");
let btnStand = document.querySelector("#blackjack-stand-btn");
let btnDeal = document.querySelector("#blackjack-deal-btn");

btnHit.addEventListener("click", blackjackHit);
btnDeal.addEventListener("click",blackjackDeal)

function blackjackHit()
{
    if(blackjackGame["isStand"] === false)
    {
        let card = randomcard();
        console.log(card)
        showcard(card,YOU)
        updateScore(card,YOU);
        showScore(YOU)
    }
    
}

function showcard( card,activePlayer)
{
    if(activePlayer['score'] <= 21)
    {
    let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`
    document.querySelector(activePlayer['div']).append(cardImage)
    HITSOUND.play()
    }
}

function blackjackDeal()
{
    if(blackjackGame['turnOver'] === true)
    {

        blackjackGame['isStand'] = false

        let winner = computeWinner();

        showResult(winner);

        let YourImages = document.querySelector("#your-box").querySelectorAll('img');
        let DealerImage = document.querySelector("#dealer-box").querySelectorAll('img')
        
        for(i=0; i < YourImages.length;i++)
        {
            YourImages[i].remove();
            // DealerImage[i].remove();
        }
    
        for(i=0; i < DealerImage.length;i++)
        {
        
        DealerImage[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").textContent = 0;
        
        document.querySelector("#your-blackjack-result").style.color = "white";
        document.querySelector("#dealer-blackjack-result").style.color = "white";

        document.querySelector('#blackjack-result').textContent = "Lets Plays"
        document.querySelector('#blackjack-result').style.color = "black"

        blackjackGame['turnOver'] = true;
    }
}



function randomcard()
{
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['card'][randomIndex]
}

function updateScore(card,activePlayer)
{
   
  //IF adding 11 keeps me below 21 ADD 11, otherwisem add 1
  

  
    activePlayer['score'] += blackjackGame["cardMap"][card];

}


function showScore(activePlayer)
{
    if(activePlayer['score'] > 21)
    {
    document.querySelector(activePlayer['scoreSpan']).innerHTML = "Bust !";
    document.querySelector(activePlayer['scoreSpan']).style.color = "red";

    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];

    }
}

btnStand.addEventListener("click",dealerLogin)

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve,ms))
}



async function dealerLogin()
{
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true)
    {
    let card = randomcard();
    showcard(card,DEALER)
    updateScore(card,DEALER)
    showScore(DEALER)
        await sleep(1000)
}

   
        blackjackGame['turnOver'] = true
        showResult(computeWinner())
        console.log(blackjackGame['turnOver'])
    
}

//compute winner and return who just win
//update win draws and losses

function computeWinner()
{
    let winner;

    if(YOU["score"] <= 21)
    {
        if(YOU["score"] > DEALER['score'] || (DEALER['score'] > 21))
        {
            winner = YOU
            blackjackGame['wins'] ++;
            document.querySelector('#wins').textContent = blackjackGame['wins']
            console.log("you win")
        }
        else if (YOU['score'] < DEALER["score"] || YOU["score"] > 21)
        {
            winner = DEALER
            document.querySelector('#losses').textContent = blackjackGame['losses']
            blackjackGame['losses'] ++;
            console.log("you lost")

        }
        else if (YOU["score"] === DEALER["score"])
        {
            document.querySelector('#Draws').textContent = blackjackGame['draws']

            blackjackGame['draws'] ++;
            console.log("draw")

        }
    }
    //when your button get bust
    else if(YOU["score"] > 21 && DEALER['score'] <= 21)
    {
        document.querySelector('#losses').textContent = blackjackGame['losses']
        blackjackGame['losses'] ++;
        console.log("you lost")
    }
    else if(YOU["score"] > 21 && DEALER['score'] > 21)
    {
        document.querySelector('#Draws').textContent = blackjackGame['draws']
        console.log("You DREw")
        blackjackGame['draws'] ++;
    }
    console.log(blackjackGame)

    return winner;
}

function showResult(Winner)
{
    let message, messageColor;

    if(blackjackGame['turnOver'] === true )
    {

    

    if(Winner === YOU)
    {
        message = "You Won"
        messageColor = "green"
        WINSOUND.play()
    }
    else if(Winner === DEALER)
    {
        message = "You Lost"
        messageColor = "red"
        LOSTSOUND.play()
    }
    else
    {
        message = "Draw"
        messageColor = "black"
    }

    document.querySelector("#blackjack-result").textContent = message
    document.querySelector("#blackjack-result").style.color = messageColor

}
}