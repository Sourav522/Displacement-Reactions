function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var elementsHolder = document.getElementById('elementsHolder');
var nextButton = document.getElementById('nextButton');

// simulation data
testTubeImages = ['/GIFs/Set1/StartPics/s1g1Start.jpg', '/GIFs/Set1/StartPics/s1g2Start.jpg', '/GIFs/Set1/StartPics/s1g3Start.jpg'];
stripImages = ['mgStrip.png', 'mgStrip.png', 'mgStrip.png'];
stripText = ["Mg", "Mg", "Mg"];
setVideosArray = [0];
setVideosArray[1] = ['./GIFs/Set1/s1g1.gif', './GIFs/Set1/s1g2.gif', './GIFs/Set1/s1g3.gif'];
setVideosArray[2] = ['./GIFs/Set2/s2g1.gif', './GIFs/Set2/s2g2.gif', './GIFs/Set2/s2g3.gif'];
setVideosArray[3] = ['./GIFs/Set3/s3g1.gif', './GIFs/Set3/s3g2.gif', './GIFs/Set3/s3g3.gif'];

setNotificationArray = [0];
setNotificationArray[1] = ['No change', 'Change observed!', 'Change observed!'];
setNotificationArray[2] = ['No change', 'No change', 'Change observed!'];
setNotificationArray[3] = ['No change', 'No change', 'No change'];

primaryNotificationData = ['0', 'Place strips into respective test tubes and observe the reactions', 'Place strips into respective test tubes again and observe', 'Place strips into respective test tubes again and observe'];

//CSS variables
let testTubeLeft = 10;
let testTubeGap = 25;
let StripLeft = 15;
let reactionNotifLeft = 25;

class Set {
    constructor(setNumber) {
        // test tubes
        var i = 0;
        var j = 0;
        var k = 0;
        var labSet = this;
        this.setNumber = setNumber;
        this.testTubes = [];
        this.strips = [];
        this.stripText = [];
        this.reactionVideoElement = [0, 1, 2];
        this.notificationElement = [0, 1, 2];
        this.setStatus = [false, false, false];
        for (i = 0; i < 3; i++) {
            // testTubes
            this.testTubes[i] = document.createElement('IMG');
            elementsHolder.appendChild(this.testTubes[i]);
            this.testTubes[i].classList.add('testTube');
            this.testTubes[i].src = `./assets/GIFs/Set${setNumber}/StartPics/s${setNumber}g${i + 1}Start.jpg`;
            this.testTubes[i].style.left = (testTubeLeft + (i * testTubeGap)) + '%';

            // strips_captions
            this.stripText[i] = document.createElement('DIV');
            elementsHolder.appendChild(this.stripText[i]);
            this.stripText[i].classList.add('stripCaption');
            this.stripText[i].style.left = (StripLeft + (i * testTubeGap)) + '%';
            this.stripText[i].innerHTML = stripText[i];

            // strips
            this.strips[i] = document.createElement('IMG');
            elementsHolder.appendChild(this.strips[i]);
            this.strips[i].classList.add('strips');
            this.strips[i].src = './assets/' + stripImages[i];
            this.strips[i].style.left = (StripLeft + (i * testTubeGap)) + '%';
            this.strips[i].style.zIndex = (5 + i).toString();

            // strip clicked function
            this.strips[i].onclick = function () {
                this.style.display = 'none';
                for (j = 0; j < 3; j++) {
                    if (this == labSet.strips[j]) {
                        labSet.stripText[j].style.display = "none";
                        console.log(labSet.stripText[j]);
                        labSet.testTubes[j].src = `./assets/GIFs/Set${setNumber}/StartPics/s${setNumber}g${j + 1}Start.jpg`;
                        labSet.playReactionAnimation(j);
                    }
                }

            }
        }

        // to run the reaction video/animation
        this.playReactionAnimation = async function (testTubeNumber) {
            await sleep(1000);
            if (setVideosArray[setNumber][testTubeNumber] != '') {
                this.reactionVideoElement[testTubeNumber] = document.createElement('IMG');
                elementsHolder.appendChild(this.reactionVideoElement[testTubeNumber]);
                this.reactionVideoElement[testTubeNumber].classList.add('testTube');
                this.reactionVideoElement[testTubeNumber].style.zIndex = (testTubeNumber).toString();
                this.reactionVideoElement[testTubeNumber].src = './assets/' + setVideosArray[setNumber][testTubeNumber];
                this.reactionVideoElement[testTubeNumber].style.left = (testTubeLeft + (testTubeNumber * testTubeGap)) + '%';
            }
            await sleep(100);
            this.testTubeNotification(testTubeNumber);
        }
        // to show the notification after reaction
        this.testTubeNotification = async function (testTubeNumber) {
            this.notificationElement[testTubeNumber] = document.createElement('DIV');
            elementsHolder.appendChild(this.notificationElement[testTubeNumber]);
            this.notificationElement[testTubeNumber].classList.add('testTubeNotification', 'alignTextCenter');
            this.notificationElement[testTubeNumber].style.left = (reactionNotifLeft + (testTubeNumber * testTubeGap)) + '%';
            this.notificationElement[testTubeNumber].innerHTML = setNotificationArray[setNumber][testTubeNumber];
            this.notificationElement[testTubeNumber].style.zIndex = ([testTubeNumber] + 1).toString();
            this.notificationElement[testTubeNumber].classList.add("classPopupAnimTranslated");
            await sleep(500);
            this.notificationElement[testTubeNumber].classList.remove("classPopupAnimTranslated");
            // check & update set status
            this.setStatus[testTubeNumber] = true;
            if (this.setStatus[0] == true && this.setStatus[1] == true && this.setStatus[2] == true) {
                nextButton.style.zIndex = "10";
                nextButton.style.display = 'flex';
                nextButton.classList.add("classPopupAnim");
                await sleep(500);
                nextButton.classList.remove("classPopupAnim");
            }
        }

        // primary notification box
        this.mainNotification = async function (setNumber) {
            // set number 
            this.setNumberDiv = document.createElement('DIV');
            elementsHolder.appendChild(this.setNumberDiv);
            this.setNumberDiv.classList.add('setNumberDiv', 'alignTextCenter');
            this.setNumberDiv.innerHTML = 'Set ' + setNumber;
            this.setNumberDiv.classList.add("classPopupAnim");
            await sleep(500);
            this.setNumberDiv.classList.remove("classPopupAnim");
            // main notification 
            this.mainNotificationElement = document.createElement('DIV');
            elementsHolder.appendChild(this.mainNotificationElement);
            this.mainNotificationElement.classList.add('mainNotification', 'alignTextCenter');
            this.mainNotificationElement.innerHTML = primaryNotificationData[setNumber];
            this.mainNotificationElement.style.zIndex = "10";
            this.mainNotificationElement.classList.add("classPopupAnimTranslated");
            await sleep(500);
            this.mainNotificationElement.classList.remove("classPopupAnimTranslated");
            await sleep(3000);
            this.mainNotificationElement.classList.add("classPopupAnimTranslatedVanish");
            await sleep(500);
            this.mainNotificationElement.classList.remove("classPopupAnimTranslatedVanish");
            this.mainNotificationElement.style.display = "none";

            this.mainNotificationElement.remove();
        }
        this.mainNotification(setNumber);
    }
}

class finalPage {
    constructor() {
        this.finalNotification = document.createElement('DIV');
        elementsHolder.appendChild(this.finalNotification);
        this.finalNotification.classList.add('finalNotification', 'alignTextCenter');
        this.finalNotification.innerHTML = 'We have learnt that Mg is the most reactive and then comes Pb and the least reactive among the three metals is Cu. A more reactive metal will replace a less reactive metal from its ionic salt solution';
        this.finalNotification.classList.add("classPopupAnimTranslated");

        this.playAgainButton = document.createElement('DIV');
        elementsHolder.appendChild(this.playAgainButton);
        this.playAgainButton.classList.add('endButtons', 'alignTextCenter');
        this.playAgainButton.style.left = '35%';
        this.playAgainButton.innerHTML = 'Play again';
        this.playAgainButton.classList.add("classPopupAnimTranslated");
        this.playAgainButton.onclick = function () {
            this.playAgainButton.classList.remove("classPopupAnimTranslated");
            this.playAgainButton.classList.remove("classPopupAnimTranslated");
            this.finalNotification.classList.remove("classPopupAnimTranslated");
            location.reload();
        }

        this.finishButton = document.createElement('DIV');
        elementsHolder.appendChild(this.finishButton);
        this.finishButton.classList.add('endButtons', 'alignTextCenter');
        this.finishButton.style.left = '65%';
        this.finishButton.innerHTML = 'Finish';
        this.finishButton.classList.add("classPopupAnimTranslated");
        this.finishButton.onclick = function () {
            // add ds bridge
        }
    }
}




window.onload = function () {
    setState = 1;
    new Set(setState);
    // new finalPage();
    nextButton.style.display = 'none';
}
nextButton.onclick = function () {
    setState += 1;
    document.getElementById('elementsHolder').remove();
    elementsHolder = document.createElement('DIV');
    document.getElementsByClassName('first-div')[0].appendChild(elementsHolder);
    elementsHolder.setAttribute('id', 'elementsHolder');
    nextButton.style.display = 'none';
    if (setState <= 3) {
        new Set(setState);
    }
    else {
        new finalPage();
    }
}



