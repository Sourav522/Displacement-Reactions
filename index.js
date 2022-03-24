function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let elementsHolder = document.getElementById('elementsHolder');
let nextButton = document.getElementById('nextButton');
let submitButton = document.getElementById('submitButton');
let submitInstructions = document.getElementById('submitInstructions');
submitInstructions.style.display = "none"; // keep it invisible

// let checkboxCopyRef = [];
// simulation data
testTubeImages = ['/GIFs/Set1/StartPics/s1g1Start.jpg', '/GIFs/Set1/StartPics/s1g2Start.jpg', '/GIFs/Set1/StartPics/s1g3Start.jpg'];
stripImages = ['mgStrip.png', 'leadStrip.png', 'copperStrip.png'];
stripTextCaption = ["Mg", "Pb", "Cu"];
setVideosArray = [0];
setVideosArray[1] = ['./GIFs/Set1/s1g1.gif', './GIFs/Set1/s1g2.gif', './GIFs/Set1/s1g3.gif'];
setVideosArray[2] = ['./GIFs/Set2/s2g1.gif', './GIFs/Set2/s2g2.gif', './GIFs/Set2/s2g3.gif'];
setVideosArray[3] = ['./GIFs/Set3/s3g1.gif', './GIFs/Set3/s3g2.gif', './GIFs/Set3/s3g3.gif'];

setNotificationArray = [0];
setNotificationArray[1] = ['No change', 'Pb is deposited!', 'Cu is deposited!'];
setNotificationArray[2] = ['No change', 'No change', 'Cu is deposited!'];
setNotificationArray[3] = ['No change', 'No change', 'No change'];

primaryNotificationData = ['0', 'Click on the Mg strips to place them into respective test tubes and observe the reactions', 'Click on the Pb strips to place them into respective test tubes and observe the reactions', 'Click on the Cu strips to place them into respective test tubes and observe the reactions'];

//CSS variables
let testTubeLeft = 17;
let testTubeGap = 21;
let StripLeft = 0;
let reactionNotifLeft = 31.5;
let globalTestTubeNumberCheckedValue = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
let correctTicks = [[-1, 1, 1], [-1, -1, 1], [-1, -1, -1]];
let isStripClicked = 0;
class Set {
    constructor(setNumber) {
        // test tubes
        let i = 0;
        let j = 0;
        let k = 0;
        let labSet = this;
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

        }
        for (i = setNumber - 1; i < 3; i++) {
            // strips_captions
            this.stripText[i] = document.createElement('DIV');
            elementsHolder.appendChild(this.stripText[i]);
            this.stripText[i].classList.add('stripCaption');
            this.stripText[i].style.left = '17%';
            this.stripText[i].style.top = 27 + i * 19 + "%";
            this.stripText[i].innerHTML = stripTextCaption[i];
            this.stripText[i].style.zIndex = (5 + i).toString();
            if (i == 1) { this.stripText[i].style.color = "#999999"; } //colouring font
            else if (i == 2) { this.stripText[i].style.color = "#ffc7a1bb"; }

            // strips
            this.strips[i] = document.createElement('IMG');
            elementsHolder.appendChild(this.strips[i]);
            this.strips[i].classList.add('strips');
            this.strips[i].src = './assets/' + stripImages[i];
            this.strips[i].style.left = '7%';
            this.strips[i].style.top = 20 + i * 19 + "%";
            this.strips[i].style.zIndex = (5 + i).toString();
            if (i == setNumber - 1) { //animating only one strip
                this.strips[i].classList.add("classOscillation");
            }
        }
        // strip clicked function
        this.strips[setNumber - 1].onclick = function () {
            this.style.display = 'none';
            for (j = 0; j < 3; j++) {
                if (this == labSet.strips[j]) {
                    labSet.stripText[j].style.display = "none";
                }
                labSet.testTubes[j].src = `./assets/GIFs/Set${setNumber}/StartPics/s${setNumber}g${j + 1}Start.jpg`;
                labSet.playReactionAnimation(j);
                isStripClicked = 1;
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
            await sleep(5000); //5000
            this.testTubeNotification(testTubeNumber);
        }
        // to show the checkbox after reaction
        this.testTubeNotification = async function (testTubeNumber) {
            //creating a checkbox
            this.notificationElement[testTubeNumber] = document.createElement('input');
            this.notificationElement[testTubeNumber].type = "checkbox";
            //Assigning ids for accesss outside the class
            this.notificationElement[testTubeNumber].id = "checkbox" + (testTubeNumber).toString();
            elementsHolder.appendChild(this.notificationElement[testTubeNumber]);
            this.notificationElement[testTubeNumber].classList.add('testTubeNotification', 'alignTextCenter');
            this.notificationElement[testTubeNumber].style.left = (reactionNotifLeft + (testTubeNumber * testTubeGap + 1)) + '%';
            // console.log(testTubeNumber)
            this.notificationElement[testTubeNumber].innerHTML = setNotificationArray[setNumber][testTubeNumber];
            this.notificationElement[testTubeNumber].style.zIndex = ([testTubeNumber] + 1).toString();
            this.notificationElement[testTubeNumber].classList.add("classPopupAnimTranslated");
            await sleep(500);
            this.notificationElement[testTubeNumber].classList.remove("classPopupAnimTranslated");

            // submit button visible with pop up animations
            submitButton.style.zIndex = "10";
            submitButton.style.display = 'flex';
            submitButton.classList.add("classPopupAnim");
            await sleep(500);
            submitButton.classList.remove("classPopupAnim");
            submitButton.classList.add("classOscillation");

            //Checkbox clicked function
            this.notificationElement[testTubeNumber].onclick = function () {
                // console.log(testTubeNumber);
                //put click and unclick logic here
                globalTestTubeNumberCheckedValue[setNumber - 1][testTubeNumber] *= -1;
            }

            // check & update set status
            this.setStatus[testTubeNumber] = true;
            if (this.setStatus[0] == true && this.setStatus[1] == true && this.setStatus[2] == true) {

                submitInstructions.style.display = "flex";
                submitInstructions.classList.add("classPopupAnimTranslated");
                await sleep(500);
                submitInstructions.classList.remove("classPopupAnimTranslated");
                await sleep(5001);
                submitInstructions.classList.add("classPopupAnimTranslatedVanish");
                await sleep(500);
                submitInstructions.classList.remove("classPopupAnimTranslatedVanish");
                submitInstructions.style.display = "none";

                //Enable clicking of the checkbox elements
                // for (let loopVar = 0; loopVar <= 2; loopVar++) {
                //     document.getElementById("checkbox" + (loopVar).toString()).style.pointerEvents = "auto";
                // }

            }
        }



        // primary notification box
        this.mainNotification = async function (setNumber) {
            // set number 
            // this.setNumberDiv = document.createElement('DIV');
            // elementsHolder.appendChild(this.setNumberDiv);
            // this.setNumberDiv.classList.add('setNumberDiv', 'alignTextCenter');
            // this.setNumberDiv.innerHTML = 'Set ' + setNumber;
            // this.setNumberDiv.style.zIndex = "11";
            // this.setNumberDiv.classList.add("classPopupAnim");
            // await sleep(500);
            // this.setNumberDiv.classList.remove("classPopupAnim");
            // main notification 
            this.mainNotificationElement = document.createElement('DIV');
            elementsHolder.appendChild(this.mainNotificationElement);
            this.mainNotificationElement.classList.add('mainNotification', 'alignTextCenter');
            this.mainNotificationElement.innerHTML = primaryNotificationData[setNumber];
            this.mainNotificationElement.style.zIndex = "10";
            this.mainNotificationElement.classList.add("classPopupAnimTranslated");
            await sleep(500);
            this.mainNotificationElement.classList.remove("classPopupAnimTranslated");
            // await sleep(6000); //6000
            while (isStripClicked == 0) { //hide main notif element when the strip is clicked!
                //wait for 6 seconds and remove
                await sleep(300);
            }
            this.mainNotificationElement.classList.add("classPopupAnimTranslatedVanish");
            await sleep(500);
            this.mainNotificationElement.classList.remove("classPopupAnimTranslatedVanish");
            this.mainNotificationElement.style.display = "none";
            this.mainNotificationElement.remove();
            isStripClicked = 0;
        }
        this.mainNotification(setNumber);
    }
}

class finalPage {
    constructor() {
        // this.finalNotification = document.createElement('DIV');
        // elementsHolder.appendChild(this.finalNotification);
        // this.finalNotification.classList.add('finalNotification', 'alignTextCenter');
        // this.finalNotification.innerHTML = 'We have learnt that Mg is the most reactive and then comes Pb and the least reactive among the three metals is Cu.<br><br> A more reactive metal will replace a less reactive metal from its ionic salt solution.';
        // this.finalNotification.classList.add("classPopupAnimTranslated");

        // this.playAgainButton = document.createElement('DIV');
        // elementsHolder.appendChild(this.playAgainButton);
        // this.playAgainButton.classList.add('endButtons', 'alignTextCenter');
        // this.playAgainButton.style.left = '35%';
        // this.playAgainButton.innerHTML = 'PLAY AGAIN';
        // this.playAgainButton.classList.add("classPopupAnimTranslated");
        // let elementTarget = this;
        // this.playAgainButton.onclick = function () {
        //     elementTarget.playAgainButton.classList.remove("classPopupAnimTranslated");
        //     elementTarget.playAgainButton.classList.remove("classPopupAnimTranslated");
        //     elementTarget.finalNotification.classList.remove("classPopupAnimTranslated");
        //     location.reload(true);
        // }

        this.finishButton = document.createElement('DIV');
        elementsHolder.appendChild(this.finishButton);
        this.finishButton.classList.add('endButtons', 'alignTextCenter');
        this.finishButton.style.left = '50%';
        this.finishButton.style.bottom = '40%';
        this.finishButton.innerHTML = 'FINISH';
        this.finishButton.classList.add("classPopupAnimTranslated");
        // this.finishButton.classList.add("classOscillationDelayed");
        this.finishButton.onclick = function () {
            console.log('finish');
            dsBridge.call("byjus.sendExploreUIEvent", {

                tag: "finish",

                data: ""

            });
        }
    }
}




window.onload = function () {
    setState = 1;
    new Set(setState);
    // new finalPage();
    nextButton.style.display = 'none';
}
nextButton.onclick = async function () {
    nextButton.classList.remove("classOscillation");
    setState += 1;
    document.getElementById('elementsHolder').remove();
    elementsHolder = document.createElement('DIV');
    document.getElementsByClassName('first-div')[0].appendChild(elementsHolder);
    elementsHolder.setAttribute('id', 'elementsHolder');
    nextButton.style.display = 'none';

    //hide submit instructions
    submitInstructions.classList.add("classPopupAnimTranslatedVanish");
    await sleep(500);
    submitInstructions.classList.remove("classPopupAnimTranslatedVanish");
    submitInstructions.style.display = "none";

    if (setState <= 3) {
        new Set(setState);
    }
    // let a = new set(setstate); // this doesnt create new object set. can be used to acces the inner varialbes and dom elements.
    //a.test.checkbox[0].style
    else {
        // new finalPage();
        console.log('finish');
            dsBridge.call("byjus.sendExploreUIEvent", {

                tag: "finish",

                data: ""

            });
    }
    // for (let loopVar = 0; loopVar <= 2; loopVar++) {
    //     document.getElementById("checkbox" + (loopVar).toString()).remove();
    // }
}

submitButton.onclick = function () {
    submitButton.style.display = 'none';
    nextButton.style.display = 'flex';
    nextButton.style.zIndex = '15';
    nextButton.classList.add("classOscillation");
    //make notifications glow
    // let checker = [0, 0, 0];
    // checker = globalTestTubeNumberCheckedValue[setState - 1];
    // console.table(globalTestTubeNumberCheckedValue);
    // console.table(correctTicks);
    // console.table()

    for (let loopVar = 0; loopVar <= 2; loopVar++) {
        if (correctTicks[setState - 1][loopVar] == globalTestTubeNumberCheckedValue[setState - 1][loopVar]) {
            //make green
            document.getElementById("checkbox" + (loopVar).toString()).style.setProperty("-webkit-filter", "drop-shadow(0 0 .2rem greenyellow)");
            document.getElementById("checkbox" + (loopVar).toString()).style.accentColor = "greenyellow";
        }
        else {
            document.getElementById("checkbox" + (loopVar).toString()).style.setProperty("-webkit-filter", "drop-shadow(0 0 .2rem crimson)");
            document.getElementById("checkbox" + (loopVar).toString()).style.accentColor = "crimson";
        }
        //disable clicking
        document.getElementById("checkbox" + (loopVar).toString()).style.pointerEvents = "none";

    }

    // document.getElementById("checkbox1").style.setProperty("-webkit-filter", "drop-shadow(0 0 .1rem red)");

    // document.getElementById("checkbox1").style.backgroundColour = 'red';
    // document.getElementById("checkbox0").style.accentColor = "green";
    // document.getElementById("checkbox1").checked = true;
}



document.getElementById('crossButton').onclick = function () {
    console.log('close');
    dsBridge.call("byjus.sendExploreUIEvent", {

        tag: "close",

        data: ""

    });
}



