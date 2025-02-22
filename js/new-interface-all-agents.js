/*
game.js

    Author      :   Sheer Karny, Mark Steyvers
    University  :   University of California, Irvine
    Lab         :   Modeling and Decision-Making Lab (MADLAB)


Game Page JS file (metadata and functionality).

This file should contain all variables and functions needed for
the game.
*/

$("#full-game-container").attr("hidden", false);
$("#survey-workload-container").attr("hidden", true);
$("#survey-full-container").attr("hidden", true);
$("#complete-page-content-container").attr("hidden", true);
$("#ai-comparison-container").attr("hidden", true);

// //****************************************** FIREBASE FUNCTIONALITY **********************************************//

// Importing functions and variables from the FirebasePsych library
import { writeRealtimeDatabase,writeURLParameters,readRealtimeDatabase,
    blockRandomization,finalizeBlockRandomization,
    initializeRealtimeDatabase,initializeSecondRealtimeDatabase } from "./firebasepsych1.1.js";

// Your web app's Firebase configuration

const firebaseConfig_db1 = {
    apiKey: "AIzaSyDpNbTTWgCBNJfdi19Dj1juiZfOtlf_TVU",
    authDomain: "communication-8053d.firebaseapp.com",
    projectId: "communication-8053d",
    storageBucket: "communication-8053d.appspot.com",
    messagingSenderId: "537238050134",
    appId: "1:537238050134:web:60e80acf66956649ceb2f7"
};


// const firebaseConfig_db1 = {
//     apiKey: YOUR_API_KEY,
//     authDomain: YOUR_AUTH_DOMAIN,
//     projectId: YOUR_PROJECT_ID,
//     storageBucket: YOUR_STORAGE_BUCKET,
//     messagingSenderId: YOUR_MESSAGE_SENDER_ID,
//     appId: YOUR_API_KEY
// };
  
// Get the reference to the two databases using the configuration files
const [ db1 , firebaseUserId1 ] = await initializeRealtimeDatabase( firebaseConfig_db1 );

// console.log("Firebase UserId=" + firebaseUserId);


// Import the concaveman function from Skypack CDN
import concaveman from 'https://cdn.skypack.dev/concaveman';

// Verify that concaveman is loaded correctly
console.log("concaveman loaded:", typeof concaveman); // Should log "function"


function getDebugParams(){
    const urlParams = new URLSearchParams(window.location.search);
    let debugBoolean = Boolean(urlParams.get('debug'));
    // console.log(debugBoolean);
    return debugBoolean;
}

function getCollabTypeParams(){
    const urlParams = new URLSearchParams(window.location.search);
    let collabType = parseInt(urlParams.get('collab'), 10);

    // console.log("collabType: ", collabType);

    if (isNaN(collabType)){
        collabType = 1
    }
    
    return collabType
}

var DEBUG  = getDebugParams();      // Always start coding in DEBUG mode
var COLLAB = getCollabTypeParams(); // 0=ignorant; 1=omit; 2=divide; 3=delay

// console.log("collab: ", COLLAB);

let studyId = 'placeHolder';

if (DEBUG){
   studyId    = "full-run-Feb6-debug";
} else {
    studyId   = "full-run-Feb6";
}

// WRITE PROLIFIC PARTICIPANT DATA TO DB1
let pathnow = studyId + '/participantData/' + firebaseUserId1 + '/participantInfo';
writeURLParameters(db1, pathnow);

// database write function
function writeGameDatabase(){
    // Connecting to the sister database
    // let pathUID1 = studyId + '/participantData/' + firebaseUserId2 + '/keyUID';
    // let pathUID2 = studyId + '/participantData/' + firebaseUserId1 + '/keyUID';
    // writeRealtimeDatabase(db2, pathUID1, firebaseUserId1);
    // writeRealtimeDatabase(db1, pathUID2, firebaseUserId2);

    if (DEBUG) console.log("Writing to database from block", currentBlock, "round", currentRound);

    let path12  = studyId + '/participantData/' + firebaseUserId1 + '/condition' + '/blockCondition';
    let path13  = studyId + '/participantData/' + firebaseUserId1 + '/condition' + '/seedCondition';
    let path24  = studyId + '/participantData/' + firebaseUserId1 + '/condition' + '/teamingCondition';
    let path25 = studyId + '/participantData/' + firebaseUserId1 + '/condition' + '/teamingOrder';

    // console.log("Writing to database");
    let path1   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/spawnData';
    let path2   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/caughtTargets';
    let path3   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/eventStream'; 
    let path4   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/playerClicks';
    let path5   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/playerLocation';
    let path6   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/settings';
    let path7   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/roundTime';
    let path11  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/playerScore';
 
    // let path14  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIClicks_Adjusted';
    let path8   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIcaughtTargets';
    let path9   = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIClicks';
    let path10  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/aiScore';
    let path17  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIeventStream';

    let path18  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIcaughtTargets_offline';
    let path19  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIClicks_offline';
    let path20 = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/aiScore_offline';
    // let path20  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIClicks_Adjusted_offline';
    // let path21  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIplayerLocation_offline';
    // let path22  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIplayerLocation';
    let path23  = studyId + '/participantData/' + firebaseUserId1 + '/block' + currentBlock + '/round' + currentRound + '/AIeventStream_offline';


    writeRealtimeDatabase(db1, path1, spawnData);
    writeRealtimeDatabase(db1, path2, caughtTargets);
    writeRealtimeDatabase(db1, path3, eventStream); 
    writeRealtimeDatabase(db1, path4, playerClicks);
    writeRealtimeDatabase(db1, path5, playerLocation);
    writeRealtimeDatabase(db1, path6, roundSettings);
    writeRealtimeDatabase(db1, path7, roundTime);
    writeRealtimeDatabase(db1, path8, AIcaughtTargets);
    writeRealtimeDatabase(db1, path9, aiClicks);
    writeRealtimeDatabase(db1, path10, aiScore);
    writeRealtimeDatabase(db1, path11, score);
    writeRealtimeDatabase(db1, path12, currentCondition);
    writeRealtimeDatabase(db1, path13, curSeeds);
    // writeRealtimeDatabase(db1, path14, aiClicks_adjusted);
    // writeRealtimeDatabase(db1, path15, drtResponses);
    // writeRealtimeDatabase(db1, path16, drtFalseAlarm);
    writeRealtimeDatabase(db1, path17, AIeventStream);
    writeRealtimeDatabase(db1, path18, AIcaughtTargets_offline);
    writeRealtimeDatabase(db1, path19, aiClicks_offline);
    writeRealtimeDatabase(db1, path20, aiScore_offline);
    // writeRealtimeDatabase(db1, path21, AIplayerLocation_offline);
    // writeRealtimeDatabase(db1, path22, AIplayerLocation);
    writeRealtimeDatabase(db1, path23, AIeventStream_offline);
    writeRealtimeDatabase(db1, path24, currentTeamingCondition);
    writeRealtimeDatabase(db1, path25, agentOrder);
}

//************************************************ ENVIRONMENT INITIALIZATION ********************************************//
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreCanvas = document.getElementById('scoreCanvas');
const scoreCtx = scoreCanvas.getContext('2d');
const world = { width: 800, height: 800 };
const center = { x: canvas.width / 2, y: canvas.height / 2 };
let observableRadius = 390; // Radius for positioning objects

let roundSettings = {};

// *********************************************** EXPERIMENTAL PARAMETERS ***********************************************// 

// NOTE: AI MODE FOR EXPERIMENT 1 SHOULD BE === 0 (NO ASSISTANCE)
// NOTE: Start with default parameters --> make changes that are critical between rounds (to remove duplication)

// change game to complete based on 2 minutes of frame counts at 60 fps

function getDifficultySettingsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let settings = {
        AIMode: parseInt(urlParams.get('maxTargets'), 10) || 1,                             // MS4: 0=no assistance; 1=always on; 2=adaptive
        AIDisplayMode: parseInt(urlParams.get('maxTargets'), 10) || 1,                      // MS4: 0=show movement path; 1=show where to click; 2=show which targets to intercept 
        AIMaxDisplayLength: parseInt(urlParams.get('maxTargets'), 10) || 3,                 // MS4: can be used to truncate the AI path length shown
        visualizeAIPlayer: parseInt(urlParams.get('maxTargets'), 10) || 0,                  // MS5: 0:default; 1=visualize AI player running in background
        AIStabilityThreshold: parseFloat(urlParams.get('AIStabilityThreshold')) || 1.2,     // MS7: minimum proportional improvement before recommendation changes 
        alpha: parseFloat(urlParams.get('alpha')) || 0.9,                                   // MS8: discounting parameter for AI planner
        AIadviceThresholdHigh: parseFloat(urlParams.get('AIadviceThresholdHigh')) || 0.7,   // MS6: threshold on value to give AI advice in adaptive AI setting
        AIadviceAngleThreshold: parseFloat(urlParams.get('AIadviceThresholdHigh')) || 20,   // MS6: angle tolerance for accepting move in adaptive AI setting
        AIthresholdnumframesaftercaughttarget: parseInt(urlParams.get('visualizeAIPlayer'), 10) || 30, // MS6: for adaptive AI, how many frames to wait with advice after player catches target 
        maxTargets: parseInt(urlParams.get('maxTargets'), 10) || 8,                         // MS2: added this parameter to limit total number of targets
        spawnProbability: parseFloat(urlParams.get('spawnProbability')) || 1.0,
        spawnInterval: parseInt(urlParams.get('spawnInterval'), 10) || 10,
        // numSpawnLocations: parseInt(urlParams.get('numSpawnLocations'), 10) || 10,
        valueSkew: parseFloat(urlParams.get('valueSkew')) || 1,
        valueLow: parseFloat(urlParams.get('valueLow')) ||0,
        valueHigh: parseFloat(urlParams.get('valueHigh')) || 1,
        playerSpeed: parseFloat(urlParams.get('playerSpeed'),10) || 1.5,
        speedLow: parseFloat(urlParams.get('speedLow'),10) || 0.75, // lowest end of object speed distribution
        speedHigh: parseFloat(urlParams.get('speedHigh'),10) || 2.5, // highest end of object speed distribution
        randSeed: parseInt(urlParams.get('randSeed'), 10) || 12345
    };
    return settings;
}

let settings = {
    maxSeconds: 180,                    // maximum number of seconds per round --> 3 minutes (consider doing 2.5 minutes)
    AIMode:0,                           // MS4: 0=no assistance; 1=always on; 2=adaptive
    AICollab: 0,                        // MS4: 0=ignorant; 1=intentional; 2=cognitive model
    alpha: 0.9,                         // MS8: discounting parameter for AI planner
    AIDisplayMode: 1,                   // MS4: 0=show movement path; 1=show where to click; 2=show which targets to intercept
    AIMaxDisplayLength: 3,              // MS4: can be used to truncate the AI path length shown
    visualizeAIPlayer: 1,               // MS5: 0:default; 1=visualize AI player running in background
    visualizeAIPlayerOffline: 1,        // MS5: 0:default; 1=visualize AI player running in background
    AIStabilityThreshold: 1.2,          // MS7: minimum proportional improvement before recommendation changes
    AIadviceThresholdHigh: 0.7,         // MS6: threshold on value to give AI advice in adaptive AI setting
    AIadviceAngleThreshold: 30,         // MS6: angle tolerance for accepting move in adaptive AI setting
    AIframeDelay: 30,                   // Delaying advice so that it doesn't overwhelm the player
    spawnProbability:  1.0,
    spawnInterval: 10,
    valueSkew: 2,
    valueLow: 0,
    valueHigh:  1,
    playerSpeed: 3,
    maxTargets: 2,
    speedLow:  1.5,             // lowest end of object speed distribution
    speedHigh: 2.99,               // highest end of object speed distribution
};


let AICollab1;
let AICollab2;
// let collab1, collab2;   
let collabPlayer1 = 0;
let collabPlayer2 = 1;

let agent1Name;
let agent2Name;

let agentOrder = [];

// let agentNames = {
//     0: "Ignorant",
//     1: "Omit",
//     2: "Divide",
//     3: "Delay",
//     4: "Bottom-Feeder"
// }

// amt of information (low/high) refers to the amount of targets marked by the AI concurrently
// amt of abstraction (low/high) refers to the whether or not the divide line + shaded region is drawn

let agentNames = {
    0: "Low-low", // low information, no abstraction
    1: "Low-High", // low information,  abstraction
    2: "High-low", // high information, no abstraction
    3: "High-high" // high information,  abstraction
}

// Rename this to teamingSettings after having enabled the ability to turn on/off the abstraction
let teamingSettings = {
    1: {AICollab1 : 0,  // low information, no abstraction
        AICollab2 : 1}, // low information, abstraction

    2: {AICollab1 : 0,  // low information, no abstraction
        AICollab2 : 2}, // high information, no abstraction

    3: {AICollab1 : 0,  // low information, no abstraction
        AICollab2 : 3}, // high information, abstraction

    4: {AICollab1 : 1,  // high information, no abstraction
        AICollab2 : 2}, // high information,  abstraction

    5: {AICollab1 : 1,  // high information, no abstraction
        AICollab2 : 3}, // high information, abstraction

    6: {AICollab1 : 2,  // high information, no abstraction
        AICollab2 : 3}, // high information, abstraction
}

let difficultySettings_communication = {
    // 5 targets first
    1: {0: {1: {AICollab: collabPlayer1,     // Pair A
                maxTargets: 15},  
            2: {AICollab: collabPlayer2,
                maxTargets: 15}},
        1: {1: {AICollab: collabPlayer1,     // Pair A
                maxTargets: 15},
            2: {AICollab: collabPlayer2,
                maxTargets: 15}}},

    2: {0: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 15},  
            2: {AICollab: collabPlayer1,
                maxTargets: 15}},
        1: {1: {AICollab: collabPlayer1,    // Pair A
                maxTargets: 15},
            2: {AICollab: collabPlayer2,
                maxTargets: 15}}},
    
    3: {0: {1: {AICollab:collabPlayer1,    // Pair A
                maxTargets: 15},
            2: {AICollab: collabPlayer2,
                maxTargets: 15}},
        1: {1: {AICollab: collabPlayer2,   // Pair B
                maxTargets: 15},
            2: {AICollab: collabPlayer1,
                maxTargets: 15}}},

    4: {0: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 15}, 
            2: {AICollab: collabPlayer1,
                maxTargets: 15}},
        1: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 15},
            2: {AICollab: collabPlayer1,
                maxTargets: 15}}},
};

// let teamingSettings = {
//     1: {AICollab1 : 0,          // ignorant
//         AICollab2 : 3},         // delay
        
//     2: {AICollab1 : 0,          // ignorant
//         AICollab2 : 1},         // omit

//     3: {AICollab1 : 0,          // ignorant
//         AICollab2 : 4},         // bottom-feeder

//     4: {AICollab1 : 0,          // ignorant
//         AICollab2 : 2},         // divide

//     5: {AICollab1 : 3,          // delay
//         AICollab2 : 1},         // omit

//     6: {AICollab1 : 3,          // delay
//         AICollab2 : 4},         // bottom-feeder

//     7: {AICollab1 : 3,          // delay
//         AICollab2 : 2},         // divide

//     8: {AICollab1 : 1,          // omit
//         AICollab2 : 4},         // bottom-feeder

//     9: {AICollab1 : 1,          // omit
//         AICollab2 : 2},         // divide

//     10:{AICollab1 : 4,          // bottom-feeder    
//         AICollab2 : 2}          // divide,
// };

let difficultySettings = {
    // 5 targets first
    1: {0: {1: {AICollab: collabPlayer1,     // Pair A
                maxTargets: 20},  
            2: {AICollab: collabPlayer2,
                maxTargets: 20}},
        1: {1: {AICollab: collabPlayer1,     // Pair A
                maxTargets: 20},
            2: {AICollab: collabPlayer2,
                maxTargets: 20}}},

    2: {0: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 20},  
            2: {AICollab: collabPlayer1,
                maxTargets: 20}},
        1: {1: {AICollab: collabPlayer1,    // Pair A
                maxTargets: 20},
            2: {AICollab: collabPlayer2,
                maxTargets: 20}}},
    
    3: {0: {1: {AICollab:collabPlayer1,    // Pair A
                maxTargets: 20},
            2: {AICollab: collabPlayer2,
                maxTargets: 20}},
        1: {1: {AICollab: collabPlayer2,   // Pair B
                maxTargets: 20},
            2: {AICollab: collabPlayer1,
                maxTargets: 20}}},

    4: {0: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 20}, 
            2: {AICollab: collabPlayer1,
                maxTargets: 20}},
        1: {1: {AICollab: collabPlayer2,    // Pair B
                maxTargets: 20},
            2: {AICollab: collabPlayer1,
                maxTargets: 20}}},
};

// function assigns the condition's agent types to the difficulty settings, can reuse this for communcation
function updateDifficultySettings() {
    let newDifficultySettings = JSON.parse(JSON.stringify(difficultySettings)); // Create a deep copy

    for (let condition in newDifficultySettings) {
        for (let block in newDifficultySettings[condition]) {
            for (let round in newDifficultySettings[condition][block]) {
                if (newDifficultySettings[condition][block][round].AICollab === 0) {
                    newDifficultySettings[condition][block][round].AICollab = teamingSettings[currentTeamingCondition].AICollab1;
                } else if (newDifficultySettings[condition][block][round].AICollab === 1) {
                    newDifficultySettings[condition][block][round].AICollab = teamingSettings[currentTeamingCondition].AICollab2;
                }
            }
        }
    }

    // console.log("Updated DifficultySettings:", newDifficultySettings);
    return newDifficultySettings;
}

async function updateAgentOrdering() {
    // this function should handle the ordering and naming of the agents
    // if you are in the first round of that block, you should assign the correct agent.

     // This is needed to handle coloring of the AI player and naming
     if (currentRound == 1){
        AIplayer.collabOrder = 1;
        agent1Name = agentNames[AIplayer.collabType];
        agentOrder.push(agent1Name);
    } else if (currentRound == 2){
        AIplayer.collabOrder = 2;
        agent2Name = agentNames[AIplayer.collabType];
        agentOrder.push(agent2Name);
    }
    // console.log("Agent 1 & 2 Names", agent1Name, agent2Name);
}


// **************************************************** COMMUNICATION ORDERING **************************************************** //  
// function assigns the condition's agent types to the difficulty setting

async function updateCommunicationOrdering() {
    // this function should handle the ordering and naming of the agents
    // if you are in the first round of that block, you should assign the correct agent.

     // This is needed to handle coloring of the AI player and naming
     if (currentRound == 1){
        AIplayer.collabOrder = 1;
        agent1Name = agentNames[AIplayer.collabType];
        agentOrder.push(agent1Name);
    } else if (currentRound == 2){
        AIplayer.collabOrder = 2;
        agent2Name = agentNames[AIplayer.collabType];
        agentOrder.push(agent2Name);
    }
    // console.log("Agent 1 & 2 Names", agent1Name, agent2Name);
}


// *********************************************** GAME INITIALIZATION ***********************************************//

// Block randomization variables -- placed here for ordering dependency
let currentRound = 1;
let currentBlock = 0;
let currentCondition = null;
let currentTeamingCondition = null;
let curSeeds = null;   
let noAssignment = true;

let maxRounds = 2;

// Timing variables
let gameStartTime, elapsedTime;
let isPaused            = false; // flag for pausing the game
let isGameRunning       = false;
let frameCountGame      = 0; // MS: number of updates of the scene
let deltaFrameCount     = 0; // To limit the size of the Event Stream object; 
const fps               = 30; // Desired logic updates per second

let maxFrames = null;
if (DEBUG){
    maxFrames         = 60 * fps;// settings.maxSeconds * fps;
} else{ // set it to whatever you want
    maxFrames         = settings.maxSeconds * fps; //120 * 60; // Two minutes in frames
}

const updateInterval    = 1000 / fps; // How many milliseconds per logic update
let firstRender         = 0;
let roundTime           = 0;

// Data collection variables
let objects         = [];
let spawnData       = [];
let caughtTargets   = [];
let missedTargets   = [];
let playerClicks    = [];
let playerLocation  = [];
let aiClicks        = [];
let aiClicks_offline = [];

// **** communication variables **** //
let hullPoints = [];
let drawingAngle;

// ****** PLAN DELAY VARIABLES ****** //

// Delay for the collaborative agent between plans
let planDelayCounter = 0;
let planDelay = false; 
let planDelayFrames = Math.floor(0.7 * 30); // 700 ms in frames (based on pilot data)

let avgResponseTime;
let clickTimes = [];

// ********************************* //

// const eventStreamSize = 720; // 2 minutes of 60 fps updates
// let eventStream = Array.from({ length: eventStreamSize }, () => ({}));// preallocate the array
let eventStream = [];
let AIeventStream = [];
let AIeventStream_offline = [];

// Variables for cursor
let cursorSize = 40;
let mouseX = 0, mouseY = 0;

// Varaiables for HTML elements
let totalScore = 0;
let score = 0;
let aiScore = 0;
let aiScore_offline = 0;
let numAIChanges = 0; // MS7 count of number of different targets pursued (measure of "neuroticism" or inverse "inertia")

// Player and View Initialization (related to one another)
const playerSize = 50;
const player = {
    // color:"red", 
    color: 'rgba(255, 0, 0, 0.5)',//'rgba(0, 0, 255, 0.5)',
    x: canvas.width/2 - 100, //center the x,y in the center of the player.
    y: canvas.height/2 ,
    dx: 0,
    dy: 0,
    moving:false,
    toCenter:false,
    shownAdvice:false, //MS6: flag to show advice
    targetX:canvas.width/2,
    targetY:canvas.height/2,
    targetObjID:0,
    velocity: 1.5,
    angle:0,
    speed: 1.5, 
    width:50, 
    height:50,
    score:0
};

let humanImg = new Image();
humanImg.src = './images/human-head-small.png'; // Path to your robot head image

const camera = {
    x: world.width / 2,
    y: world.height / 2,
    width: canvas.width,
    height: canvas.height
};

// MS: adding a random number generator
function lcg(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let current = seed;
  
    return function() {
      current = (a * current + c) % m;
      return current / m;
    };
}

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let randomGenerator;

// intial varaiables for moving average to delay clicks
let ema;
let period = 10;
let smoothingFactor = 2 / (1 + period);

// MS4: ********************************************** AI PLANNER ****************************************************//

//let sol; // MS7
let firstStep, bestSol, allSol; // MS7  Global variable that holds the solutions of the planner 
let firstStepOffline, bestSolOffline, allSolOffline; // MS7  Global variable that holds the solutions of the planner 
let firstStepCollab, bestSolCollab, allSolCollab; // MS7  Global variable that holds the solutions of the planner for the online collaborative AI

// let sol; // MS4: global variable that contains planned path for current frame

const AIplayerSize = 50;
const AIplayer = {
    color: 'rgba(0, 128, 0, 0.5)',//'rgba(255, 0, 0, 0.5)', 
    x: canvas.width/2 + 100, //center the x,y in the center of the player.
    y: canvas.height/2,
    moving:false,
    targetX:0,
    targetY:0,
    velocity: 1.5,
    angle:0,
    speed: 1.5, 
    width:50, 
    height:50,
    score:0,
    collabOrder: 0,
    collabType: 0,
};
let AIcaughtTargets = [];
let AIplayerLocation = [];

let robotHeadImg = new Image();
robotHeadImg.src = './images/simple-robot-250px.png'; // Path to your robot head image

let AIcaughtTargets_offline = [];
let AIplayerLocation_offline = [];

let numFramesPlayernotMoving = 0; // MS6
let numFramesAfterCaughtTarget = 0; // MS6

const AIplayer_offline = {
    color: 'rgba(128, 128, 128, 0.5)',//'rgba(255, 0, 0, 0.5)', // grey color for the offline player
    x: canvas.width/2 + 100, //center the x,y in the center of the player.
    y: canvas.height/2 ,
    moving:false,
    targetX:0,
    targetY:0,
    velocity: 1.5,
    angle:0,
    speed: 1.5, 
    width:50, 
    height:50,
    score:0
};

let visitedBlocks = 0;
let numSurveyCompleted = 0;
let AIComparisonComplete = false;
let prevSetting;
//**************************************************** BLOCK RANDOMIZATION ******************************************************//

async function initExperimentSettings() {

    const maxCompletionTimeMinutes = 60;

    const blockOrderCondition = 'blockOrderCondition'; // a string we use to represent the condition name
    const numConditions = 4; // number of conditions
    const numDraws = 1; // number of draws
    let assignedCondition;
    assignedCondition = await blockRandomization(db1, studyId, blockOrderCondition, numConditions, maxCompletionTimeMinutes, numDraws);
    currentCondition = assignedCondition[0] + 1;    
    console.log("Assigned Condition", assignedCondition);

    // if (DEBUG) assignedCondition = [10]; // 3 == ignorant and divide

    // if (DEBUG){ 
    //     currentCondition = COLLAB;
    // } else {
    //     currentCondition = assignedCondition[0]+1;
    // }

    const teamingBlockCondition = 'teamingCondition'; // a string we use to represent the condition name
    const numTeamingConditions = 6; // number of conditions
    let assignedTeamingCondition;

    if (DEBUG){
        assignedTeamingCondition = await blockRandomization(db1, studyId, teamingBlockCondition, numTeamingConditions, maxCompletionTimeMinutes, numDraws);
        // assignedTeamingCondition = [3]; 
    } 
    else {
        assignedTeamingCondition = await blockRandomization(db1, studyId, teamingBlockCondition, numTeamingConditions, maxCompletionTimeMinutes, numDraws);
    }

    // if (DEBUG) currentTeamingCondition = COLLAB; // 3 == ignorant and divide 

    currentTeamingCondition = assignedTeamingCondition[0] + 1;
    console.log("Current Teaming Condition", currentTeamingCondition);

    collabPlayer1 = teamingSettings[currentTeamingCondition].AICollab1;
    collabPlayer2 = teamingSettings[currentTeamingCondition].AICollab2;

    difficultySettings = updateDifficultySettings();

    if (DEBUG) console.log("Assigned AI Teams", collabPlayer1, collabPlayer2);

    var randomValues = [];
    for (var i = 0; i < 4; i++) {
        randomValues.push(generateRandomInt(1, 1000000));
    }

    noAssignment = false;

    curSeeds = randomValues;
    return [blockOrderCondition, teamingBlockCondition];
}


let blockOrderCondition, teamingBlockCondition;
let conditionsArray = [];
// Assign a condition to each new participant.
if (noAssignment){
    if (DEBUG){ // adjust value as needed for debugging; default is the same as the main experiment
        // blockOrderCondition = conditionsArray[0];
        // teamingBlockCondition = conditionsArray[1];

        await initExperimentSettings();

        console.log('assignedCondition:', currentCondition); // Add this line
        console.log('assignedTeamingCondition:', currentTeamingCondition); // Add this line 
        console.log('assignedSeed:', curSeeds); // Add this line
        // teamingBlockCondition
    } else {
        // havin the names for each condition is needed for block randomization
        await initExperimentSettings();

        blockOrderCondition = conditionsArray[0];
        teamingBlockCondition = conditionsArray[1];

        // console.log('assignedCondition:', currentCondition); // Add this line
        // console.log('assignedSeed:', curSeeds); // Add this line
    }
    startGame(currentRound, currentCondition, currentBlock, curSeeds, currentTeamingCondition); // Start the next round
    noAssignment = false;
}


// ****************************************************** UPDATE FUNCTIONS ********************************************************//


// Start Game function
async function startGame(round, condition, block, seeds) {

    currentRound = round; // Start at the specified round, or the current round

    let blockSetting = difficultySettings[condition][block];
    roundSettings = blockSetting[currentRound];
    
    // reassign default settings to the values grabbed from the current
    // settings.AIMode = roundSettings.AIMode;
    // settings.AIStabilityThreshold = roundSettings.AIStabilityThreshold;
    settings.AICollab = roundSettings.AICollab;
    AIplayer.collabType = roundSettings.AICollab;


    settings.maxTargets = roundSettings.maxTargets;

    // Debug setting for max targets
    // if (DEBUG) settings.maxTargets=8; // this was to get many targets for debuggin
   
    // Change to the next seed
    if (block == 0) {
        settings.randSeed = seeds[currentRound - 1];
        await updateAgentOrdering();
    } else if (block == 1 ) {
        settings.randSeed = seeds[currentRound + 1];
        if (currentRound == 2) await updateAgentOrdering();
    }

   
    if (currentRound == 1  && currentBlock == 0) AIplayer.color = 'rgba(0, 128, 0, 0.5)'; // green transparent
    if (currentRound == 2 && currentBlock == 0) AIplayer.color = 'rgba(128, 0, 128, 0.5)'; // purple transparent

    // if (settings.AICollab == 0  && settings.maxTargets == 15) AIplayer.color = 'rgba(128, 128, 128, 0.7)'; // iron transparent
    if (currentRound == 1  && currentBlock == 1) AIplayer.color = 'rgba(0, 0, 255, 0.5)'; // blue transparent
    if (currentRound == 2 && currentBlock == 1) AIplayer.color = 'rgba(184, 115, 51, 0.5)'; // copper transparent 

    if (DEBUG){
        //console.log("Default Settings AI Mode", settings.AIMode);
        console.log("Current Collab AI Mode", roundSettings.AICollab);
        console.log("Current Settings", roundSettings);
        console.log("Current Block", currentBlock);
        console.log("Current Round", currentRound);
        console.log("Current Max Targets", settings.maxTargets);
        console.log("Current Seeds: ", settings.randSeed);
    }
    // Initialize with a seed
    randomGenerator = lcg(settings.randSeed);
    // Start the exponential moving average with a fixed response time of 1/3 of a second -- 10 frames
    clickTimes.push(10);

    // Reset game canvas visibility
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.style.display = 'block';
    const scoreCanvas = document.getElementById('scoreCanvas');
    scoreCanvas.style.display = 'block';

    if (!isGameRunning) {
        setupCanvas();
        gameStartTime   = Date.now();
        frameCountGame  = 0;
        isGameRunning   = true;
        gameLoop();
    }
}

// End Game function
async function endGame() {
    isGameRunning = false;

    writeGameDatabase();

    if (currentRound < maxRounds) {//&& numSurveyCompleted < 3) {
        currentRound++;
        await runGameSequence("You've Completed a Round and earned " + totalScore + " points. Click OK to continue.");
        await resetGame();
        startGame(currentRound, currentCondition, currentBlock, curSeeds); // Start the next round
    } else if (currentRound >= maxRounds && blockInfo.completedBlock < 2) {// && numSurveyCompleted < 3) {

        // All rounds in the current block are completed
        blockInfo.completedBlock++;
        blockInfo.completedBlockOrder.push(currentBlock);
        console.log("Visited Blocks", visitedBlocks);
        currentRound = 1; // Reset the round counter
        currentBlock += 1; // Move to next block
       
        await runGameSequence("You've Completed a Block and earned " + totalScore + " points. Click OK to continue.");
        await resetGame();

        visitedBlocks++;

        if (visitedBlocks == 1) {
            // prevSetting = settings
            await loadFullSurvey();
            $("#survey-full-container").attr("hidden", false);
            // await loadAIComparison();
            // $("#ai-comparison-container").attr("hidden", false);
            $("#full-game-container").attr("hidden", true);
        }
    
        if (visitedBlocks < 2) {
            startGame(currentRound, currentCondition,currentBlock,curSeeds); // Start the next round
        } else{
            // console.log("End of Experiment");
            await loadFullSurvey();
            $("#survey-full-container").attr("hidden", false);
            // loadAIComparison();
            // $("#ai-comparison-container").attr("hidden", false);
            $("#full-game-container").attr("hidden", true);
            if (DEBUG) console.log("Agent order", agentOrder); 
        }
    }
}

async function resetGame(){
    objects                 = null;
    spawnData               = null;
    caughtTargets           = null;
    playerClicks            = null;
    playerLocation          = null;
    score                   = null;
    player.score            = null;

    aiScore                 = null;
    AIplayer.score          = null
    AIcaughtTargets         = null;
    AIplayerLocation        = null;
    // aiClicks_adjusted       = null;
    aiClicks                = null;
    aiClicks_offline        = null;

    aiScore_offline                 = null;
    AIplayer_offline.score          = null
    AIcaughtTargets_offline         = null;
    // AIplayerLocation_offline       = null;
    // aiClicks_adjusted_offline      = null;

    // then reassign the variables
    eventStream             = [];//Array.from({ length: eventStreamSize }, () => ({}));// preallocate the array
    objects                 = []; // Reset the objects array
    spawnData               = [];
    caughtTargets           = [];
    playerClicks            = [];
    playerLocation          = [];
    score                   = 0;   

    AIeventStream           = [];
    aiScore                 = 0;
    player.score            = 0;
    AIplayer.score          = 0
    totalScore              = 0;
    aiClicks                = [];
    aiClicks_offline        = [];
    AIcaughtTargets         = [];
    AIplayerLocation        = [];

    // AIeventStream_offline           = [];
    aiScore_offline                 = 0;
    AIplayer_offline.score          = 0
    // aiClicks_adjusted_offline       = [];
    AIcaughtTargets_offline         = [];
    // AIplayerLocation_offline        = [];
    
    player.x        = canvas.width/2 - 100 ;
    player.y        = canvas.height/2;
    player.targetX  = player.x;
    player.targetY  = player.y;
    AIplayer.x      = canvas.width/2 + 100;
    AIplayer.y      = canvas.height/2;
    AIplayer_offline.x = canvas.width/2 + 100; // MS5: Reset the player position
    AIplayer_offline.y = canvas.height/2;

    drawingAngle = 90;
    // splitGameHalf();
}

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    if (frameCountGame==0){
        firstRender = Date.now();
    }

    if (frameCountGame >= maxFrames) {
        endGame();
        // console.log("Game Over!", frameCountGame);
        return;
    }

    elapsedTime = Date.now() - gameStartTime;
    roundTime = Date.now() - firstRender;

    // console.log('Running game loop at frame count', frameCount);
    // console.log('Time since running:', now - gameStartTime);
    
    // Calculate time since last update
    var deltaTime = timestamp - lastUpdateTime;

    // Check if it's time for the next update
    if (deltaTime >= updateInterval) {
        lastUpdateTime = timestamp - (deltaTime % updateInterval);
        //console.log("Current Obj")
        updateObjects(settings);
         // Update game logic
        // console.log("Game Loop Settings:", settings);
    }
    render(); 

    // Schedule the next frame
    requestAnimationFrame(gameLoop); 
}

var lastUpdateTime = 0;
var isLightOn    = false;

// Render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawMask(ctx, player);
   
    ctx.save();
    drawWorldBoundary();                
    // draws the abstraction of the ai strategy
    if (settings.AICollab == 1 || settings.AICollab == 3) drawPlayerHalf(drawingAngle);         
    drawCenterMarker();                               // Draw the center marker
    drawPlayer();                                     
    if (settings.visualizeAIPlayer==1) drawAIPlayer();
    // if (settings.visualizeAIPlayerOffline==1) drawAIPlayerOffline();
    displayAIStatus();                                // Display which ai
    drawAISolution();                                 // Draw AI solution of type specified in settings
    drawObjects();

    // if (hullPoints.length > 3){
    //     // drawReferencePoints(hullPoints);
    //     drawConcaveHull(hullPoints);
    // } 
   
    ctx.restore();
    drawScore();                      
}

// Update game objects
function updateObjects(settings) {
    if (isPaused){
        // console.log("Game is paused");
        return;
    } 
    if (frameCountGame == 0) {
        // console.log("Starting Game");
        runGameSequence("This is Round " + currentRound + " of " + maxRounds + " of this Section. Click to Begin.");
    }
    if (deltaFrameCount == 10){
        deltaFrameCount = 0;
    }
    
    frameCountGame++;                           // MS: increment scene update count
    deltaFrameCount++;                          // Limit the amount of data pushes
    
    player.velocity = settings.playerSpeed;
 
    // Update player position if it is moving
    if (player.moving) {
        const deltaX = player.targetX - player.x;
        const deltaY = player.targetY - player.y;
        const distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distanceToTarget < player.velocity) {
            // Player has arrived at the target location
            player.x = player.targetX;
            player.y = player.targetY;
            player.moving = false;
        } else {

            numFramesPlayernotMoving = 0; // MS6
            player.angle = Math.atan2(deltaY, deltaX);

            // make global
            let playerDeltaX = player.velocity * Math.cos(player.angle)
            let playerDeltaY = player.velocity * Math.sin(player.angle)

            player.dx = playerDeltaX;
            player.dy = playerDeltaY;

            player.x +=  player.dx;
            player.y +=  player.dy;

            // console.log("Player Speed", player.velocity);

            playerLocation.push({frame: frameCountGame, x: player.x, y: player.y});
        }
    } else {
        numFramesPlayernotMoving++; // MS6
        player.dx = 0;
        player.dy = 0;
    }

    // Prevent player from moving off-screen
    player.x                = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y                = Math.max(player.height / 2, Math.min(canvas.height - player.height / 2, player.y));

    // MS5: Update AI player position if it is moving
    AIplayer.velocity       = settings.playerSpeed;
    AIplayer_offline.velocity = settings.playerSpeed;

    const deltaX            = AIplayer.targetX - AIplayer.x;
    const deltaY            = AIplayer.targetY - AIplayer.y;
    const distanceToTarget  = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distanceToTarget < AIplayer.velocity) {
        // AI Player has arrived at the target location
        AIplayer.x         = AIplayer.targetX;
        AIplayer.y         = AIplayer.targetY;
        AIplayer.moving    = false;
    } else if (!planDelay) {
        // Move player towards the target
        AIplayer.angle      = Math.atan2(deltaY, deltaX);
        AIplayer.x         += AIplayer.velocity * Math.cos(AIplayer.angle);
        AIplayer.y         += AIplayer.velocity * Math.sin(AIplayer.angle);
        AIplayer.moving     = true;
        AIplayerLocation.push({time: frameCountGame, x: AIplayer.x, y: AIplayer.y});
    }

    if (planDelay) planDelayCounter++;

    if (planDelayCounter >= planDelayFrames){
        planDelay = false;
        planDelayCounter = 0;
    }

    const deltaX_offline              = AIplayer_offline.targetX - AIplayer_offline.x;
    const deltaY_offline              = AIplayer_offline.targetY - AIplayer_offline.y;
    const distanceToTarget_offline    = Math.sqrt(deltaX_offline * deltaX_offline + deltaY_offline * deltaY_offline);

    if (distanceToTarget_offline < AIplayer_offline.velocity) {
        // AI Player has arrived at the target location
        AIplayer_offline.x         = AIplayer_offline.targetX;
        AIplayer_offline.y         = AIplayer_offline.targetY;
        AIplayer_offline.moving    = false;
    } else {
        // Move player towards the target
        AIplayer_offline.angle      = Math.atan2(deltaY_offline, deltaX_offline);
        AIplayer_offline.x         += AIplayer_offline.velocity * Math.cos(AIplayer_offline.angle);
        AIplayer_offline.y         += AIplayer_offline.velocity * Math.sin(AIplayer_offline.angle);
        AIplayer_offline.moving     = true;
        // AIplayerLocation.push({time: frameCountGame, x: AIplayer.x, y: AIplayer.y});
    }

    // MS: and inserted the following code
    if (frameCountGame % settings.spawnInterval === 0) {
        spawnObject(settings);    
    }

    let toRemove = [];
    let caughtAnything = false; // MS6
    objects.forEach((obj, index) => {
        if (obj.active) {
            // obj.x += obj.vx * obj.speed; // Update x position
            // obj.y += obj.vy * obj.speed; // Update y position

            obj.x += obj.dx; // Update x position with the magnitude vector
            obj.y += obj.dy; // Update y position
            // console.log("Object Location", obj.x, obj.y);

            // Check if the object is outside the observable area
            let dx                 = obj.x - center.x;
            let dy                 = obj.y - center.y;
            let distanceFromCenter = Math.sqrt(dx * dx + dy * dy) - 10;

            let willOverlap = willSquareAndCircleOverlap(player.x, player.y, player.dx, player.dy, player.width,
                obj.x, obj.y, obj.dx, obj.dy, obj.size, player.timeToIntercept, obj.marked);
            
            if (willOverlap){
                obj.willOverlap = willOverlap;
            } else {
                obj.willOverlap = false;
            }
    

            let inRegion = splitGameHalf(obj);
            obj.inPlayerRegion = inRegion;


            // console.log("Will overlap", willOverlap);

            if (obj.willOverlap) drawDebugOverlap(obj, willOverlap);

            if (distanceFromCenter > observableRadius) { // Object leaves observable area (EXIT EVENT)
                // console.log("Object is outside observable area");
                obj.active = false; // Set the object to inactive
                toRemove.push( index );

                // create an event object here
                let gameState = extractGameState(objects);

                // add an event object for catching the target as a human player
                // Values for writing to dataframe
                let objectData      = {ID: obj.ID, value: obj.value,
                                    x: obj.x, y: obj.y,
                                    dx: obj.dx, dy: obj.dy,
                                    vx: obj.vx, vy: obj.vy, speed: obj.speed,
                                    clicked: obj.clicked, AIclicked: obj.AIclicked, 
                                    marked: obj.marked, AImarked: obj.AImarked};

                let playerData      = {x: player.x, y: player.y, speed: player.velocity, 
                                    dx: player.dx, dy: player.dy,
                                    targetX: player.targetX, targetY: player.targetY,
                                    angle: player.angle, moving: player.moving,
                                    score:player.score, AIscore: AIplayer.score};

                let interceptData   = {x: player.targetX, y: player.targetY, time: 0, distance: 0, 
                                        intendedTarget: player.targetObjID, AIintendedTarget: AIplayer.ID};
                let eventType       = 'exit';

                // collapse the 4 object events (spawning, collision, clicking, exiting) into one 1 dataframe
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: playerData, 
                                    interceptData: interceptData, gameState: gameState};

                // if (DEBUG) console.log("Exit Event Object", eventObject);
                eventStream.push(eventObject);
            }
            
            // ********************************** Human CAUGHT TARGET ************************************//
            if (!obj.intercepted && checkCollision(player, obj)) {
                // Collision detected
                obj.intercepted   = true; // MS2: added this flag
                caughtAnything    = true;    //MS6
                score             += obj.value;
                player.score      += obj.value;

                // if (obj.ID == player.targetObjID) player.moving = false; // stop player after catching intended target

                // *************************** Data Writing *********************************//
                let gameState = extractGameState(objects);
                let objectData      = {ID: obj.ID, value: obj.value,
                                    x: obj.x, y: obj.y,
                                    dx: obj.dx, dy: obj.dy,
                                    vx: obj.vx, vy: obj.vy, speed: obj.speed,
                                    clicked: obj.clicked, AIclicked: obj.AIclicked, 
                                    marked: obj.marked, AImarked: obj.AImarked};

                let playerData      = {x: player.x, y: player.y, speed: player.velocity, 
                                    dx: player.dx, dy: player.dy,
                                    targetX: player.targetX, targetY: player.targetY,
                                    angle: player.angle, moving: player.moving,
                                    score:player.score, AIscore: AIplayer.score};

                let interceptData   = {x: player.targetX, y: player.targetY, time: 0, distance: 0, 
                                        intendedTarget: player.targetObjID, AIintendedTarget: AIplayer.ID};
                let eventType       = 'catch';
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: playerData, 
                                    interceptData: interceptData, gameState: gameState};

                // if (DEBUG) console.log("Caught Target Event Object", eventObject);

                eventStream.push(eventObject)
            }

             // MS6 Checking times between catching objects for human player
            if (caughtAnything) numFramesAfterCaughtTarget=0; else numFramesAfterCaughtTarget++;

            // ********************************** AI ONLINE CAUGHT TARGET ************************************//

            // if AI player catches a new object
            if (!obj.intercepted && checkCollision(AIplayer, obj)) { // MS5: added a condition
                // Collision detected
                obj.intercepted   = true; // Added this flag to make sure the object despawns after being caught
                
                if (obj.ID == player.targetObjID) player.moving = false; // stop human after AI catches human intended target
                // obj.AIintercepted = true; // MS2: added this flag             
                //console.log("AI Collision detected!");
                let caughtObj     = {frame: frameCountGame, target: obj}   
                AIcaughtTargets.push(caughtObj);

                aiScore           += obj.value;
                AIplayer.score    += obj.value;

                // *************************** Data Writing *********************************//
                let gameState = extractGameState(objects);
                let objectData    = {ID: obj.ID, value: obj.value,
                                    x: obj.x, y: obj.y,
                                    dx: obj.dx, dy: obj.dy,
                                    vx: obj.vx, vy: obj.vy, speed: obj.speed,
                                    clicked: obj.clicked, AIclicked: obj.AIclicked,
                                    marked: obj.marked, AImarked: obj.AImarked};


                let AIplayerData      = {x: AIplayer.x, y: AIplayer.y, speed: AIplayer.velocity, 
                                    targetX: AIplayer.targetX, targetY: AIplayer.targetY,
                                    angle: AIplayer.angle, moving: AIplayer.moving,
                                    score:AIplayer.score};

                let interceptData   = {x: AIplayer.targetX, y: AIplayer.targetY, time: 0, distance: 0, intendedTarget: AIplayer.ID};
                let eventType       = 'catch';
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: AIplayerData, 
                                    interceptData: interceptData,gameState: gameState};

                // if (DEBUG) console.log("Caught Target Event Object", eventObject);

                AIeventStream.push(eventObject)
            }

            // ********************************** AI OFFLINE CAUGHT TARGET ************************************//

            if (!obj.AIintercepted && checkCollision(AIplayer_offline, obj)) { // MS5: added a condition
                // Collision detected
                obj.AIintercepted = true; // MS2: added this flag             
                let caughtObj     = {frame: frameCountGame, target: obj}   
                AIcaughtTargets_offline.push(caughtObj);

                aiScore_offline           += obj.value;
                AIplayer_offline.score    += obj.value;
                if (DEBUG) console.log("AI Offline Score: ", AIplayer_offline.score);

                // *************************** Data Writing *********************************//

                let gameState = extractGameState(objects);
                let objectData      = {ID: obj.ID, value: obj.value,
                                    x: obj.x, y: obj.y,
                                    dx: obj.dx, dy: obj.dy,
                                    vx: obj.vx, vy: obj.vy, speed: obj.speed,
                                    clicked: obj.clicked, AIclicked: obj.AIclicked,
                                    marked: obj.marked, AImarked: obj.AImarked};

                let AIplayerData      = {x: AIplayer_offline.x, y: AIplayer_offline.y, speed: AIplayer_offline.velocity, 
                                    targetX: AIplayer_offline.targetX, targetY: AIplayer_offline.targetY,
                                    angle: AIplayer_offline.angle, moving: AIplayer_offline.moving,
                                    score: AIplayer_offline.score};

                let interceptData   = {x: AIplayer_offline.targetX, y: AIplayer_offline.targetY, time: 0, distance: 0, intendedTarget: AIplayer_offline.ID};
                let eventType       = 'catch';
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: AIplayerData, 
                                    interceptData: interceptData, gameState: gameState};

                // if (DEBUG) console.log("Caught Target Event Object", eventObject);

                AIeventStream_offline.push(eventObject)
            }
        }
    });

    // ********************************** ONLY Remove Objects that have EXITED ************************************//

    // MS4: Remove items starting from the end
    for (let i = toRemove.length - 1; i >= 0; i--) {
        objects.splice(toRemove[i], 1);
    }

    // **************************************** Run the Collab AI Planner ****************************************//
    
    // Collab player
    let prevBestSolCollab = bestSolCollab;
    let prevFirstStepCollab = firstStepCollab;

    let objectsRemoved;

    // Apply the AI Collab type to remove certain objects (this is only for some rule-based agents)
    // Adjust this for the different communcation types
    // if ((settings.AICollab > 0) && !(settings.AICollab == 2)) {
    //     objectsRemoved = objects.filter(obj => !obj.willOverlap); // all agents remove overlapping objects
    // } else if (settings.AICollab == 2) {
    //     objectsRemoved = objects.filter(obj => obj.inPlayerRegion);
    //     objectsRemoved = objectsRemoved.filter(obj => !obj.willOverlap);
    // } else {
    //     objectsRemoved = objects; // ignorant agent
    // } 

    objectsRemoved = objects.filter(obj => !obj.inPlayerRegion);

    // console.log("Objects removed:", objectsRemoved);
    objectsRemoved = objectsRemoved.filter(obj => !obj.willOverlap);

    if (frameCountGame % 30 == 0) {
        console.log("Objects in player region:", objects.filter(obj => obj.inPlayerRegion));
        console.log("Objects removed:", objectsRemoved);
    }

    // use for later when deleting the other agent types.
    // if (settings.AIColalb == 1){
    //     objectsRemoved = objects.filter(obj => obj.inPlayerRegion);
    //     objectsRemoved = objectsRemoved.filter(obj => !obj.willOverlap);
    // } else {
    //     objectsRemoved = objects; // ignorant agent
    // } 


    // compute the concave hull of the objects
    
    // computeHull(objectsRemoved);

    let isBottomFeeder = false;
    if (settings.AICollab == 4) isBottomFeeder = true; // REMOVE THIS
    
    // SK1 Online AI player
    [ firstStepCollab, bestSolCollab ] = runAIPlanner(objectsRemoved, AIplayer , observableRadius , center, 'collab', 
            settings.AIStabilityThreshold, prevBestSolCollab, frameCountGame, settings.alpha, isBottomFeeder );
    
    // AI intention for click,target pair
    AIplayer.targetX = firstStepCollab.x; // MS7 -- just save the firstStepOffline object to firebase
    AIplayer.targetY = firstStepCollab.y; 
    AIplayer.ID      = firstStepCollab.ID; // MS8 // ID of the object to intercept

    if (AIplayer.ID == -1){
        AIplayer.toCenter = true; 
    } else{
        AIplayer.toCenter = false;
    }

    // **************************************** Marking Objects ****************************************//

    if (prevFirstStepCollab != null && prevFirstStepCollab.ID != AIplayer.ID) {
        // Unmark all objects initially
        objects.forEach(obj => {
            obj.AImarked = false;
            obj.AIclicked = false;
        });
    
        // Get the current plan
        let plan = bestSolCollab.interceptionOrder;
        // console.log("Current plan:", plan);
    
        // Mark objects based on the current plan with decreasing opacity
        if (settings.AICollab == 2 || settings.AICollab == 3) {
            plan.forEach((id, index) => {
                let obj = objects.find(o => o.ID === id);
                if (obj) {
                    obj.AImarked = true;
                    // Store the opacity level with the marking
                    obj.markingOpacity = Math.max(0.1, 1 - (index / plan.length) * 0.9);
                    // console.log(`Marked object ${obj.ID} in interception order with opacity ${obj.markingOpacity}`);
                } else {
                    // console.log(`Object with ID ${id} not found in objects array`);
                }
            });
        }
    
        // Specifically mark the current AI target with full opacity
        objects.forEach(obj => {
            if (obj.ID == AIplayer.ID) {
                obj.AImarked = true;
                obj.AIclicked = true;
                obj.markingOpacity = 1.0; // Always full opacity for current target
                // console.log(`AI clicked object ${obj.ID} with full opacity`);
            }
            if (obj.ID == prevFirstStepCollab.ID) {
                obj.AImarked = false;
                obj.markingOpacity = 0;
                // console.log(`Unmarked previous target ${obj.ID}`);
            }
        });
    }
    
    // Log the state of all objects after marking

    // if (frameCountGame % 30 == 0) {
    //     console.log("Object states after marking:", objects.map(obj => ({
    //         id: obj.ID,
    //         AImarked: obj.AImarked,
    //         AIclicked: obj.AIclicked
    //     })));
    // }

    // Keep track of collab agent decisions
    if ((prevFirstStepCollab != null) && (bestSolCollab.ID != prevBestSolCollab.ID)) {
        // push AI intention array
        let aiIntention = {frame: frameCountGame, x: AIplayer.targetX, y: AIplayer.targetY, id: bestSolCollab.ID, planDelay: planDelay};
        aiClicks.push(aiIntention);
        numAIChanges++;
    } else if (prevBestSolCollab == null) {
        let aiIntention = {frame: frameCountGame, x: AIplayer.targetX, y: AIplayer.targetY, id: bestSolCollab.ID};
        aiClicks.push(aiIntention);
    }

    // **************************************** Run the Offline AI Planner ****************************************//

    let prevBestSolOffline = bestSolOffline;
    let prevFirstStepOffline = firstStepOffline;

    [ firstStepOffline, bestSolOffline ] = runAIPlanner(objects, AIplayer_offline , observableRadius , center, 'AI', 
        settings.AIStabilityThreshold, prevBestSolOffline, frameCountGame, settings.alpha, false );
    
    AIplayer_offline.targetX = firstStepOffline.x; // MS7 -- just save the firstStepOffline object to firebase
    AIplayer_offline.targetY = firstStepOffline.y; 
    AIplayer_offline.ID      = firstStepOffline.ID; // MS8 // ID of the object to intercept

    // we need to save the decisions from the offline agent
    if ((prevFirstStepOffline != null) && (bestSolOffline.ID != prevBestSolOffline.ID)) { // all other decisions
        let aiIntention_offline = {frame: frameCountGame, x: AIplayer_offline.targetX, y: AIplayer_offline.targetY, id: bestSolOffline.ID};
        aiClicks_offline.push(aiIntention_offline);
        numAIChanges++;
    } else if (prevBestSolCollab == null) { // first decision
        let aiIntention_offline = {frame: frameCountGame, x: AIplayer_offline.targetX, y: AIplayer_offline.targetY, id: bestSolOffline.ID};
        aiClicks_offline.push(aiIntention_offline);
        numAIChanges++;
    }

     // ************************************* Run the Human Assistive AI Planner ***********************************//
    // Run the planner conditional on the human player
    // MS8
    [ firstStep, bestSol ] = runAIPlanner( objects, player , observableRadius , center, 'human', frameCountGame, settings.alpha, false );
}

function spawnObject(settings){
    let numObjectsTotal = objects.length; // MS2: count total number of objects (intercepted objects also count)
    
    let randomThreshold = randomGenerator();
    if (randomThreshold < settings.spawnProbability && numObjectsTotal < settings.maxTargets) { // Spawn a new object
        let newObject = createComposite(settings);
        
        // MS: Generate a random angle between 0 and 2π (0 and 360 degrees)
        let angle = randomGenerator() * 2 * Math.PI;

        // get x,y coordinates
        let curXLoc = center.x + observableRadius * Math.cos(angle); // - obj.width / 2;
        let curYLoc = center.y + observableRadius * Math.sin(angle); // - obj.height / 2;

        let location = {x:curXLoc, y:curYLoc, angle:angle, lastSpawnTime:0};

        newObject.x = location.x ;
        newObject.y = location.y ;
        newObject.spawnX = location.x;
        newObject.spawnY = location.y;

        setVelocityTowardsObservableArea(newObject);

        // push to objects array in order to render and update
        objects.push(newObject);
        spawnData.push(newObject);
      
        // ************************* Event Object for Spawning ******************** //   
        let gameState = extractGameState(objects);
        let objectData      = {ID: newObject.ID, value: newObject.value,
                            x: newObject.x, y: newObject.y,
                            dx: newObject.dx, dy: newObject.dy,
                            vx: newObject.vx, vy: newObject.vy, speed: newObject.speed,
                            clicked: newObject.clicked, AIclicked: newObject.AIclicked,
                            marked: newObject.marked, AImarked: newObject.AImarked};

        let playerData      = {x: player.x, y: player.y, speed: player.velocity, 
                            dx: player.dx, dy: player.dy,
                            targetX: player.targetX, targetY: player.targetY,
                            angle: player.angle, moving: player.moving,
                            score:player.score, AIscore: AIplayer.score};

        let interceptData   = {x: player.targetX, y: player.targetY, time: 0, distance: 0, 
                                intendedTarget: player.targetObjID, AIintendedTarget: AIplayer.ID};
     
        let eventType       = 'spawn';

        let eventObject     = {time: frameCountGame, eventType: eventType, 
                            objectData: objectData, playerData: playerData, 
                            interceptData: interceptData, gameState: gameState};

        eventStream.push(eventObject)

    }
    location.lastSpawnTime = elapsedTime;
}

function createComposite(settings) {
    if (!settings) {
        console.error("Settings not provided to createComposite");
        return; // Or set default values for settings
    }
    let shapeType = 'circle';

    const shapeSize = 15;
    // minSize + Math.random() * (maxSize - minSize); // Random size within range

    // Sample u ~ Uniform(0,1)
    // adjust u by the skewFloor and skewCeiling
    var valueLow = settings.valueLow;
    var valueHigh = settings.valueHigh;
    var range = valueHigh - valueLow;

    // use the a-b distribution to get a fillRadius
    let probabilities   = binProbabilities(a, b, bins);
    let cumulative      = cumulativeProbabilities(probabilities);
    let fillRadius      = parseInt(sampleFromDistribution(cumulative, 1));

    // sample from a distribution of speeds
    let speedRange  = settings.speedHigh - settings.speedLow
    let speedSample = randomGenerator() * speedRange + settings.speedLow;

    let newObj = {
        ID: frameCountGame ,
        type: 'composite',
        speed: speedSample, //(),
        x: 0,
        y: 0,
        vx: 0,              // unit vector not yet scaled by speed
        vy: 0,
        dx: 0,              // vector scaled by speed
        dy: 0,
        velAngle: 0,        // initial velocity angle is zero --> reset in the setVelocityTowardsObservableArea
        size: shapeSize,
        outerColor: 'rgba(65, 54, 54, 0.5)',
        innerColor:  'orange', 
        shape: shapeType, // Add shape type here
        type: 'target',
        fill: fillRadius,
        value: Math.floor(fillRadius),
        active: true,
        intercepted: false, // MS2: Added this flag
        AIintercepted: false, // MS5: Added this flag
        spawnX: 0,
        spawnY: 0,
        clicked: false,
        AIclicked: false,
        marked: false,
        AImarked: false,
        willOverlap: false,
    };
    // console.log(newObj.speed);
 
    return newObj;
}

function spawnUnderstandingCheckObjects() {
    for (let i = 0; i < 3; i++) {
        let obj = createComposite(settings);
        obj.fill = 0;

        let angle = randomGenerator() * 2 * Math.PI;
        // Position the object on the rim of the camera
        obj.x = center.x + randomGenerator()* observableRadius * Math.cos(angle);
        obj.y = center.y + randomGenerator() * observableRadius * Math.sin(angle);
        

        objects.push(obj);
    }
}

function setVelocityTowardsObservableArea(obj) {
    // Calculate angle towards the center
    let angleToCenter = Math.atan2(center.y - obj.y, center.x - obj.x);

    // Define the cone's range (22.5 degrees in radians)
    let coneAngle = 90 * (Math.PI / 180); // Convert degrees to radians

    // Randomly choose an angle within the cone
    let randomAngleWithinCone = angleToCenter - coneAngle / 2 + randomGenerator()  * coneAngle;

    // Set velocity based on the angle within the cone
    obj.vx = Math.cos(randomAngleWithinCone);
    obj.vy = Math.sin(randomAngleWithinCone);

    obj.dx = obj.vx * obj.speed;
    obj.dy = obj.vy * obj.speed;
}

// Helper function to determine if an object is within view ***currently not used***

function isWithinObservableArea(obj) {
    // Calculate the distance from the object to the player
    let dx = obj.x - player.x;
    let dy = obj.y - player.y;
    let distanceSquared = dx * dx + dy * dy;

    // Check if the object is within the observable radius
    return distanceSquared <= observableRadius * observableRadius;
}

function checkCollision(player, obj) {
    // Calculate the player's bounding box edges from its center
    let playerLeft = player.x - player.width / 2;
    let playerRight = player.x + player.width / 2;
    let playerTop = player.y - player.height / 2;
    let playerBottom = player.y + player.height / 2;

    // Calculate the distance from the center of the player to the center of the object
    let circleDistanceX = Math.abs(obj.x - player.x);
    let circleDistanceY = Math.abs(obj.y - player.y);

    // Check for collision
    if (circleDistanceX > (player.width / 2 + obj.size / 2)) { return false; }
    if (circleDistanceY > (player.height / 2 + obj.size / 2)) { return false; }

    if (circleDistanceX <= (player.width / 2)) { return true; } 
    if (circleDistanceY <= (player.height / 2)) { return true; }

    // Check corner collision
    let cornerDistance_sq = (circleDistanceX - player.width / 2) ** 2 + (circleDistanceY - player.height / 2) ** 2;

    return (cornerDistance_sq <= ((obj.size / 2) ** 2));
}

// Grabs all relevant current game state modeling data
function extractGameState(objects){
    return objects.map(obj => ({
        id: obj.ID,
        x: obj.x,
        y: obj.y,
        vx: obj.vx,
        vy: obj.vy,
        dx: obj.dx,
        dy: obj.dy,
        // magnitude of hte vecto
        speed: obj.speed,
        clicked: obj.clicked,
        marked:obj.marked,
        AImarked:obj.AImarked,
        value: obj.value,
        active: obj,
        intercepted: obj.intercepted,
    }));
}

function getExponentialMovingAverage(n) {
    let lastNClicks = clickTimes.slice(Math.max(clickTimes.length - n, 0)); // Get the last n clicks
    lastNClicks.forEach(currentDataPoint => {
        if (ema === undefined) {
            ema = currentDataPoint; // For the first data point, EMA equals the current data point
        } else {
            ema = (currentDataPoint - ema) * smoothingFactor + ema;
        }
    });
    return ema;
}
// ***************************************************** CONCAVE MAN *****************************************************//    
console.log("concaveman loaded:", typeof window.concaveman);

function computeHull(objects) {

    // Filter for only active objects
    const curRenderedObjects = objects.filter(obj => !obj.intercepted);
    
    // Compute hull only if there are enough active objects
    if (curRenderedObjects.length >= 3) { // Need at least 3 active points
        const points = curRenderedObjects.map(obj => [obj.x, obj.y]);
        const concavity = 10.0; // Adjust as needed

        // let hullPoints;
        try {
            // Attempt to compute the Concave Hull
            hullPoints = concaveman(points, concavity);
            // console.log("hullPoints", hullPoints);
        } catch (error) {
            // console.error("Concaveman failed, using Convex Hull instead:", error);
            hullPoints = convexHull(points); // Fallback to Convex Hull
        }
       
    } else{
        console.log("Not enough objects to compute hull");
    }
}

// Function to draw reference points
function drawReferencePoints(points) {
    if (!points || points.length === 0) {
        // console.warn("drawReferencePoints: No points provided");
        return;
    }

    // console.log(`drawReferencePoints called with ${points.length} points`);

    points.forEach((point, index) => {
        // console.log(`Drawing reference point ${index}: x=${point[0]}, y=${point[1]}`);
        drawFilledCircle(point[0], point[1], 5, 'blue');
    });
}

// function drawConcaveHull(hullPoints) {
//     ctx.save();
//     ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(hullPoints[0][0], hullPoints[0][1]);
//     for (let i = 1; i < hullPoints.length; i++) {
//         ctx.lineTo(hullPoints[i][0], hullPoints[i][1]);
//     }
//     ctx.closePath();
//     ctx.stroke();
//     ctx.restore();
// }

function drawConcaveHull(hullPoints) {
    ctx.save();
    if (hullPoints.length > 3){
        ctx.fillStyle = 'rgba(0, 128, 0, 0.2)'; // Semi-transparent green fill
        ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)'; // Keep the original stroke color
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hullPoints[0][0], hullPoints[0][1]);
        for (let i = 1; i < hullPoints.length; i++) {
            ctx.lineTo(hullPoints[i][0], hullPoints[i][1]);
        }
        ctx.closePath();
        ctx.fill(); // Fill the shape
        ctx.stroke(); // Keep the outline
    }
    ctx.restore();
}

//***************************************************** BETA SAMPLING ****************************************************//
let a = 1;
let b = 2;
let bins = 16;

function gamma(z) {
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
               771.32342877765313, -176.61502916214059, 12.507343278686905,
               -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let x = C[0];
    for (let i = 1; i < g + 2; i++)
        x += C[i] / (z + i);
    let t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}
// Beta function using the Gamma function
function beta(alpha, beta) {
    return gamma(alpha) * gamma(beta) / gamma(alpha + beta);
}
// Beta distribution PDF
function betaPDF(x, a, background) {
    if (x < 0 || x > 1) return 0;
    return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / beta(a, b);
}
// Function to calculate the probability of each bin
function binProbabilities(alpha, beta, bins) {
    let step = 1 / bins;
    let probabilities = [];
    for (let i = 0; i < bins; i++) {
        let lower = i * step;
        let upper = (i + 1) * step;
        probabilities.push(integrate(betaPDF, lower, upper, alpha, beta, 1000));
    }
    return probabilities;
}
// Numerical integration using the trapezoidal rule
function integrate(func, start, end, alpha, beta, numSteps) {
    let total = 0;
    let step = (end - start) / numSteps;
    for (let i = 0; i < numSteps; i++) {
        let x0 = start + i * step;
        let x1 = start + (i + 1) * step;
        total += 0.5 * (func(x0, alpha, beta) + func(x1, alpha, beta)) * step;
    }
    return total;
}

// Function to calculate cumulative probabilities
function cumulativeProbabilities(probabilities) {
    let cumulative = [];
    let sum = 0;
    for (let prob of probabilities) {
        sum += prob;
        cumulative.push(sum);
    }
    return cumulative;
}

// Function to sample from the distribution
function sampleFromDistribution(cumulative, totalSamples = 1) {
    let samples = [];
    for (let i = 0; i < totalSamples; i++) {
        let random = randomGenerator();  // generate a random number between 0 and 1
        let index = cumulative.findIndex(cum => cum >= random);
        samples.push(index);
    }
    return samples;
}
//*************************************************** DRAWING FUNCTIONS **************************************************//

function setupCanvas() {
    // Fill the background of the entire canvas with grey
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Define the game world area with a white rectangle (or any other color your game uses)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, world.width, world.height);

    ctx.font = '20px Arial'; // MS4: Font size and style for the text
}

function drawWorldBoundary() {
    ctx.strokeStyle = 'grey';
    ctx.strokeRect(0, 0, world.width, world.height);
}

function drawPlayer() {
    let topLeftX = player.x - player.width / 2;
    let topLeftY = player.y - player.height / 2;

    ctx.fillStyle = player.color;
    ctx.fillRect(topLeftX, topLeftY, player.width, player.height);

    ctx.drawImage(humanImg, topLeftX, topLeftY, 50, 50);
}

// MS5
function drawAIPlayer() {
    let topLeftX = AIplayer.x - AIplayer.width / 2;
    let topLeftY = AIplayer.y - AIplayer.height / 2;

    ctx.fillStyle = AIplayer.color;
    //ctx.strokeStyle = player.color;
    ctx.fillRect(topLeftX, topLeftY, player.width, player.height);

    ctx.drawImage(robotHeadImg, topLeftX, topLeftY, 50, 50);

    // write the current intended target id to the top left of the player
    // ctx.fillStyle = 'black';
    // ctx.fillText(AIplayer.ID, topLeftX, topLeftY - 5);  
}

function drawAIPlayerOffline() {
    let topLeftX = AIplayer_offline.x - AIplayer_offline.width / 2;
    let topLeftY = AIplayer_offline.y - AIplayer_offline.height / 2;

    ctx.fillStyle = AIplayer_offline.color;
    //ctx.strokeStyle = player.color;
    ctx.fillRect(topLeftX, topLeftY, player.width, player.height);

    // write the current intended target id ot hte top left of hte palyer
    // ctx.fillStyle = 'black';
    // ctx.fillText(AIplayer.ID, topLeftX, topLeftY - 5);  
}

// Function to draw objects
function drawObjects() {
    objects.forEach(obj => {
        if (obj.active) {
            if (!obj.intercepted) drawCompositeShape(obj); // MS2: added this condition
            // if (!obj.AIintercepted) drawCompositeShape(obj); // MS5: added this condition
            // MS5: added this; can be removed once code is tested
            // if ((obj.AIintercepted) && (settings.visualizeAIPlayer==1)) drawCompositeShapeAI(obj);//drawCompositeShapeAI(obj); 
            // if (obj.intercepted) drawCompositeShapeDEBUG(obj); // MS2: added this; can be removed once code is tested
            // //drawDebugBounds(obj);
        }
    });
}

function drawCompositeShape(obj) {
    // Draw the base object
    drawCircle(obj.x, obj.y, obj.size, obj.outerColor); // Outer circle
    drawCircle(obj.x, obj.y, obj.fill, obj.innerColor); // Inner circle, smaller radius

    // Draw target markers based on object state
    if (obj.marked && obj.AImarked) {
        if (!player.toCenter) {
            drawTargetMarker(obj.x, obj.y, obj.size + 2, obj.size + 12, 10, 'player', 0, obj.ID);
        }
        
        if (!planDelay) {
            let offset = !player.toCenter ? Math.PI/4 : 0;
            drawTargetMarker(obj.x, obj.y, obj.size + 2, obj.size + 12, 10, 'AI', offset, obj.ID);
        }
    } else if (obj.AImarked && !obj.marked && !planDelay) {
        drawTargetMarker(obj.x, obj.y, obj.size + 2, obj.size + 12, 10, 'AI', Math.PI/4, obj.ID);
    } else if (obj.marked && !obj.AImarked && !player.toCenter) {
        drawTargetMarker(obj.x, obj.y, obj.size + 2, obj.size + 12, 10, 'player', 0, obj.ID);
    }
}

function drawCircle(centerX, centerY, radius, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function drawCenterMarker(centerX=400, centerY=400, radius=10, color = "rgba(128, 128, 128, .8"){
    if (player.toCenter) drawCircle(centerX, centerY, 
                                    radius + 5,'red');
    if (AIplayer.toCenter && !planDelay) drawCircle(centerX, centerY,
                                    radius + 5, AIplayer.color);
    drawCircle(centerX, centerY, radius, color);
}

// function drawTargetMarker(centerX, centerY, radius1, radius2, triangleBase = 5, type, offset =0) {
//     const context = document.querySelector('canvas').getContext('2d'); // Assuming there's a canvas element in your HTML
//     const angles = [0 + offset, Math.PI / 2 + offset, Math.PI + offset, (3 * Math.PI) / 2 + offset]; // angles for the 4 triangles

//     context.save();
//     if (type == 'player') ctx.fillStyle = 'red';

//     // AI Players have their own marker colors by the game condition
//     if ((type == 'AI') && AIplayer.collabOrder == 1 && currentBlock == 0) ctx.fillStyle = 'green';
//     if ((type == 'AI') && AIplayer.collabOrder == 2 && currentBlock == 0) ctx.fillStyle = 'purple';
//     if ((type == 'AI') && AIplayer.collabOrder == 1 && currentBlock == 1) ctx.fillStyle = 'blue';
//     if ((type == 'AI') && AIplayer.collabOrder == 2 && currentBlock == 1) ctx.fillStyle = 'rgba(176, 97, 23)'; // copper

//     angles.forEach((angle) => {
//         const tipX = centerX + radius1 * Math.cos(angle);
//         const tipY = centerY + radius1 * Math.sin(angle);
//         const baseX1 = centerX + radius2 * Math.cos(angle) - triangleBase / 2 * Math.sin(angle);
//         const baseY1 = centerY + radius2 * Math.sin(angle) + triangleBase / 2 * Math.cos(angle);
//         const baseX2 = centerX + radius2 * Math.cos(angle) + triangleBase / 2 * Math.sin(angle);
//         const baseY2 = centerY + radius2 * Math.sin(angle) - triangleBase / 2 * Math.cos(angle);

//         // Draw a triangle
//         ctx.beginPath();
//         ctx.moveTo(tipX, tipY);
//         ctx.lineTo(baseX1, baseY1);
//         ctx.lineTo(baseX2, baseY2);
//         ctx.closePath();
//         ctx.fill();
//     });

//     ctx.restore();
// }

// Function to draw a filled circle

// function drawTargetMarker(centerX, centerY, radius1, radius2, triangleBase = 5, type, offset = 0, targetId = null) {
//     const context = document.querySelector('canvas').getContext('2d');
//     const angles = [0 + offset, Math.PI / 2 + offset, Math.PI + offset, (3 * Math.PI) / 2 + offset];

//     context.save();
//     if (type == 'player') {
//         ctx.fillStyle = 'red';
//     } else if (type == 'AI') {
//         let baseColor;
//         if (AIplayer.collabOrder == 1 && currentBlock == 0) baseColor = [0, 128, 0]; // green
//         else if (AIplayer.collabOrder == 2 && currentBlock == 0) baseColor = [128, 0, 128]; // purple
//         else if (AIplayer.collabOrder == 1 && currentBlock == 1) baseColor = [0, 0, 255]; // blue
//         else if (AIplayer.collabOrder == 2 && currentBlock == 1) baseColor = [176, 97, 23]; // copper

//         if ((settings.AICollab == 2 || settings.AICollab == 3) && bestSolCollab && bestSolCollab.interceptionOrder) {
//             const index = bestSolCollab.interceptionOrder.indexOf(targetId);
//             if (index !== -1) {
//                 console.log(bestSolCollab.interceptionOrder);
//                 console.log(`Target ${targetId} index in interception order: ${index}`);
//                 const alpha = 1 - (index / bestSolCollab.interceptionOrder.length) * 0.1;
//                 // console.log(`Alpha for target ${targetId}: ${alpha}`);
//                 ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
//             } else {
//                 console.log(`Target ${targetId} not in interception order`);
//                 ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
//             }
//         } else {
//             ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
//         }
//     }

//     angles.forEach((angle) => {
//         const tipX = centerX + radius1 * Math.cos(angle);
//         const tipY = centerY + radius1 * Math.sin(angle);
//         const baseX1 = centerX + radius2 * Math.cos(angle) - triangleBase / 2 * Math.sin(angle);
//         const baseY1 = centerY + radius2 * Math.sin(angle) + triangleBase / 2 * Math.cos(angle);
//         const baseX2 = centerX + radius2 * Math.cos(angle) + triangleBase / 2 * Math.sin(angle);
//         const baseY2 = centerY + radius2 * Math.sin(angle) - triangleBase / 2 * Math.cos(angle);

//         ctx.beginPath();
//         ctx.moveTo(tipX, tipY);
//         ctx.lineTo(baseX1, baseY1);
//         ctx.lineTo(baseX2, baseY2);
//         ctx.closePath();
//         ctx.fill();
//     });

//     ctx.restore();
// }

// function drawTargetMarker(centerX, centerY, radius1, radius2, triangleBase = 5, type, offset = 0, targetId = null) {
//     console.log("Current interception order:", bestSolCollab ? bestSolCollab.interceptionOrder : "No bestSolCollab");
//     const context = document.querySelector('canvas').getContext('2d');
//     const angles = [0 + offset, Math.PI / 2 + offset, Math.PI + offset, (3 * Math.PI) / 2 + offset];

//     context.save();
//     if (type == 'player') {
//         ctx.fillStyle = 'red';
//     } else if (type == 'AI') {
//         let baseColor;
//         if (AIplayer.collabOrder == 1 && currentBlock == 0) baseColor = [0, 128, 0]; // green
//         else if (AIplayer.collabOrder == 2 && currentBlock == 0) baseColor = [128, 0, 128]; // purple
//         else if (AIplayer.collabOrder == 1 && currentBlock == 1) baseColor = [0, 0, 255]; // blue
//         else if (AIplayer.collabOrder == 2 && currentBlock == 1) baseColor = [176, 97, 23]; // copper

//         if ((settings.AICollab == 2 || settings.AICollab == 3) && bestSolCollab && bestSolCollab.interceptionOrder) {
//             const index = bestSolCollab.interceptionOrder.indexOf(targetId);
//             if (index >= -1) {
//                 console.log(`Drawing marker for target ${targetId} at index ${index}`);
//                 // Ensure a minimum opacity of 0.3
//                 const alpha = Math.max(0.3, 1 - (index / bestSolCollab.interceptionOrder.length) * 0.7);
//                 ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
//             } else {
//                 console.log(`Target ${targetId} not in interception order, using default color`);
//                 ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
//             }
//         } else {
//             ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
//         }
//     }

//     angles.forEach((angle) => {
//         const tipX = centerX + radius1 * Math.cos(angle);
//         const tipY = centerY + radius1 * Math.sin(angle);
//         const baseX1 = centerX + radius2 * Math.cos(angle) - triangleBase / 2 * Math.sin(angle);
//         const baseY1 = centerY + radius2 * Math.sin(angle) + triangleBase / 2 * Math.cos(angle);
//         const baseX2 = centerX + radius2 * Math.cos(angle) + triangleBase / 2 * Math.sin(angle);
//         const baseY2 = centerY + radius2 * Math.sin(angle) - triangleBase / 2 * Math.cos(angle);

//         ctx.beginPath();
//         ctx.moveTo(tipX, tipY);
//         ctx.lineTo(baseX1, baseY1);
//         ctx.lineTo(baseX2, baseY2);
//         ctx.closePath();
//         ctx.fill();
//     });

//     ctx.restore();
// }

function drawTargetMarker(centerX, centerY, radius1, radius2, triangleBase = 5, type, offset = 0, targetId = null) {
    // console.log("Current interception order:", bestSolCollab ? bestSolCollab.interceptionOrder : "No bestSolCollab");

    if (frameCountGame / 30 == 1) {
        console.log("Current interception order:", bestSolCollab ? bestSolCollab.interceptionOrder : "No bestSolCollab");
    }
    const context = document.querySelector('canvas').getContext('2d');
    const angles = [0 + offset, Math.PI / 2 + offset, Math.PI + offset, (3 * Math.PI) / 2 + offset];

    context.save();
    if (type == 'player') {
        ctx.fillStyle = 'red';
    } else if (type == 'AI') {
        let baseColor;
        if (AIplayer.collabOrder == 1 && currentBlock == 0) baseColor = [0, 128, 0]; // green
        else if (AIplayer.collabOrder == 2 && currentBlock == 0) baseColor = [128, 0, 128]; // purple
        else if (AIplayer.collabOrder == 1 && currentBlock == 1) baseColor = [0, 0, 255]; // blue
        else if (AIplayer.collabOrder == 2 && currentBlock == 1) baseColor = [176, 97, 23]; // copper

        // Find the object with this targetId to get its opacity
        const targetObj = objects.find(obj => obj.ID === targetId);
        if (targetObj && targetObj.AImarked) {
            ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${targetObj.markingOpacity})`;
        } else if (targetId === -1) {
            // Handle the special case for the center
            ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.5)`;
        } else {
            ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
        }
    }

    angles.forEach((angle) => {
        const tipX = centerX + radius1 * Math.cos(angle);
        const tipY = centerY + radius1 * Math.sin(angle);
        const baseX1 = centerX + radius2 * Math.cos(angle) - triangleBase / 2 * Math.sin(angle);
        const baseY1 = centerY + radius2 * Math.sin(angle) + triangleBase / 2 * Math.cos(angle);
        const baseX2 = centerX + radius2 * Math.cos(angle) + triangleBase / 2 * Math.sin(angle);
        const baseY2 = centerY + radius2 * Math.sin(angle) - triangleBase / 2 * Math.cos(angle);

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(baseX1, baseY1);
        ctx.lineTo(baseX2, baseY2);
        ctx.closePath();
        ctx.fill();
    });

    ctx.restore();
}

function drawFilledCircle(x, y, radius, color) {
    // console.log(`drawFilledCircle called with x=${x}, y=${y}, radius=${radius}, color=${color}`);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}
// Function to draw a ring with optional line style
function drawRing(x, y, radius, color, style = 'solid') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    if (style === 'dashed') {
        ctx.setLineDash([5, 5]);
    } else {
        ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.closePath();
}

function drawDebugID(obj) {
    // set the text color
    ctx.fillStyle = 'black';
    // set the font
    ctx.font = '16px Arial';
    // draw the ID above the object
    ctx.fillText(obj.ID, obj.x, obj.y - 20);
}

// MS2: added this function just for debugging; it continues to draw the targets even when intercepted
function drawCompositeShapeDEBUG(obj) {
    // Draw the outer circle first
    drawCircle(obj.x, obj.y, obj.size, 'LightGrey' ); // Outer circle

    // Then draw the inner circle on top
    drawCircle(obj.x, obj.y, obj.fill, 'gray' ); // Inner circle, smaller radius
}

// MS5: added this function just for debugging; it shows when AI player has intercepted target
function drawCompositeShapeAI(obj) {
    // Draw the outer circle first
    drawCircle(obj.x, obj.y, obj.size, 'LightGrey' ); // Outer circle

    // Then draw the inner circle on top
    drawCircle(obj.x, obj.y, obj.fill, 'gray' ); // Inner circle, smaller radius
}


function drawDebugOverlap(obj, willOverlap) {
    ctx.save();
    // console.log("will overlap", willOverlap);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Set the color of the box
    ctx.lineWidth = 2; // Set the width of the box border
    let size = 2*obj.size + 15;
    ctx.strokeRect(obj.x - size/2, obj.y - size/2, size, size);
    ctx.restore();
}

function drawVelocityVector(obj) {
    if (isWithinCanvas(obj)) {
        const velocityScale = 1000; // Adjust this value to scale the velocity vector length
        const arrowSize = 5; // Size of the arrowhead

        // Calculate the end point of the velocity vector
        const endX = obj.x + obj.vx * obj.speed * velocityScale;
        const endY = obj.y + obj.vy * obj.speed * velocityScale;

        // Draw the line for the velocity vector
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'blue'; // Color of the velocity vector
        ctx.stroke();

        // Optionally, draw an arrowhead at the end of the velocity vector
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize, endY + arrowSize);
        ctx.lineTo(endX + arrowSize, endY + arrowSize);
        ctx.lineTo(endX, endY);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}

function isWithinCanvas(obj) {
    return obj.x >= 0 && obj.x <= canvas.width && obj.y >= 0 && obj.y <= canvas.height;
}

function drawScore() {
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height); // Clear the score canvas
    scoreCtx.font = '18px Roboto';
    scoreCtx.fillStyle = 'black'; // Choose a color that will show on your canvas
    totalScore = player.score + AIplayer.score;``
    scoreCtx.fillText('Team Score: ' + totalScore, 10, 20); // Adjust the positioning as needed
    // add a new line space between this right and the next
    scoreCtx.font = '14px Roboto';
    scoreCtx.fillText('Player: ' + score, 10, 40); // Adjust the positioning as needed
    scoreCtx.fillText('Bot: ' + AIplayer.score, 10, 60); // Adjust the positioning as needed
}

// drawing outer mask
function drawMask(ctx) {
    if (!ctx) {
        console.error('drawMask: No drawing context provided');
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maskRadius = 400; // Adjust as necessary

    ctx.save();

    // Draw a black rectangle covering the entire canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Then cut out a circular area from the rectangle
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
}

// Function to where the player is heading
function drawArrowDirection() {
    // Define the radial distance from the player
    let radialDistance = 60; // Adjust this value as needed

    // Player dimensions (assuming square for simplicity)
    let playerWidth = 50; // Replace with actual player width
    let playerHeight = 50; // Replace with actual player height

  
    // Calculate the arrow's position around the player center
    let arrowCenterX = player.x + radialDistance * Math.cos(player.angle);
    let arrowCenterY = player.y + radialDistance * Math.sin(player.angle);

    // Define the size of the arrow
    let arrowLength = 20;
    let arrowWidth = 10;

    // Calculate the end point of the arrow
    let endX = arrowCenterX + arrowLength * Math.cos(player.angle);
    let endY = arrowCenterY + arrowLength * Math.sin(player.angle);

    // Calculate the points for the base of the arrow
    let baseX1 = arrowCenterX + arrowWidth * Math.cos(player.angle - Math.PI / 2);
    let baseY1 = arrowCenterY + arrowWidth * Math.sin(player.angle - Math.PI / 2);
    let baseX2 = arrowCenterX + arrowWidth * Math.cos(player.angle + Math.PI / 2);
    let baseY2 = arrowCenterY + arrowWidth * Math.sin(player.angle + Math.PI / 2);

    // Draw the arrow
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(baseX1, baseY1);
    ctx.lineTo(endX, endY);
    ctx.lineTo(baseX2, baseY2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawTargetLocation() {
    // draw an x where the player is aiming
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(player.targetX - 10, player.targetY - 10);
    ctx.lineTo(player.targetX + 10, player.targetY + 10);
    ctx.moveTo(player.targetX + 10, player.targetY - 10);
    ctx.lineTo(player.targetX - 10, player.targetY + 10);
    ctx.stroke();
    ctx.restore();
}

function drawAISolution() {
    if ((settings.AIMode>0) && (bestSol != null) && (player.shownAdvice)) {  // MS7
        // get the length of the suggested path
        let pathLength = Math.min( bestSol.interceptLocations.length, settings.AIMaxDisplayLength ); // MS7
        if (pathLength > 0) {
            // MS7
            if (settings.AIDisplayMode==0) {
                // Show where to move with lines
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency 
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(player.x, player.y );
                for (let i=0; i<pathLength; i++) {
                    let transp = (i+1)/3;
                    ctx.strokeStyle = 'rgba(255, 255, 0, ' + transp + ')'; // Adjust the last number for transparency
                    let toX = bestSol.interceptLocations[i][0];
                    let toY = bestSol.interceptLocations[i][1];
                    ctx.lineTo( toX, toY );
                }
                ctx.stroke();
                ctx.restore();
            }

            // MS7: updating code with new variable
             if (settings.AIDisplayMode==1) {
                // Show a cross on where to click next 
                ctx.save();
                ctx.fillStyle = 'yellow'; // Color of the text
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency
                ctx.lineWidth = 5;
                ctx.beginPath();

                ctx.moveTo(player.x, player.y );

                let i = 0;
                //for (let i=0; i<pathLength; i++) {
                    let toX = bestSol.interceptLocations[i][0];
                    let toY = bestSol.interceptLocations[i][1];
                    
                    ctx.lineTo( toX, toY ); 
                    ctx.moveTo(toX - 10, toY - 10);
                    ctx.lineTo(toX + 10, toY + 10);
                    ctx.moveTo(toX + 10, toY - 10);
                    ctx.lineTo(toX - 10, toY + 10); 

                    // Draw text
                    // Adjust the text position as needed. Here it's slightly offset from the cross.
                    //ctx.fillText(i+1, toX + 15, toY + 15); 
                //}
                ctx.stroke();
                ctx.restore();
            }

            if (settings.AIDisplayMode==2) {
                // Highlight the target interception sequence 
                ctx.save();
                ctx.fillStyle = 'black'; // Color of the text
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency
                ctx.lineWidth = 5;
                ctx.beginPath();

                let i = 0;
                for (let i=0; i<pathLength; i++) {
                    let indexNow = bestSol.originalIndex[i];
                    if (indexNow != -1) {
                        let toX = objects[indexNow].x;
                        let toY = objects[indexNow].y;                      
                        // Draw text
                        //ctx.fillText(i+1, toX + 25, toY + 25); 

                        // Draw an arrow to the first one
                        if (i==0) {
                            drawFilledArrow(ctx, toX - 25 , toY, 10); 
                        }
                    }
                    
                }
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    // MS7
    // Some visualization debugging tools
    let showIDs = false;
    if (showIDs) {
        let numObjects = objects.length;
        for (let i=0; i<numObjects; i++) {
            // only draw the objects that are not intercepted
            if (objects[i].intercepted == false) {
                let index = objects[i].ID;
                let targetX = objects[i].x;
                let targetY = objects[i].y;
                ctx.fillStyle = 'black'; // Color of the text
                ctx.fillText(index , targetX + 15, targetY + 15);
            }          
        }
    }
}

// MS6: test function
function drawFullAISolutionDEBUG() {
    if ((settings.AIMode>0) && (sol != null)) {
        // Draw all indices
        let numObjects = objects.length;
        for (let i=0; i<numObjects; i++) {
            let index = i;
            let targetX = objects[index].x;
            let targetY = objects[index].y;
            ctx.fillStyle = 'black'; // Color of the text
            ctx.fillText(index , targetX - 25, targetY + 15);
        }

        let numSuggestions = sol.valueGoingTowardsObject.length;
        for (let i=0; i<numSuggestions; i++) {
            // Show value and index for each target
            let index = sol.originalIndexSuggestions[i];
            let value = sol.valueGoingTowardsObject[i];

            let targetX = center.x;
            let targetY = center.y;
            let valueTarget = 0;
            if (index != -1) { // Not going towards origin
                // if (objects[index] == null) {
                //     // console.log( 'test');
                // }
                targetX = objects[index].x;
                targetY = objects[index].y;
                valueTarget = objects[index].fill / objects[index].size;
            }
            ctx.fillStyle = 'black'; // Color of the text
            ctx.fillText(index , targetX + 25, targetY + 15); 
  
            ctx.fillStyle = 'green'; // Color of the text
            let str = value.toFixed(2) + ' (' + valueTarget.toFixed(2) + ')';
            ctx.fillText(str , targetX + 25, targetY - 15); 

            //if (objects.length != numSuggestions) {
            //    console.log( 'test');
            //}


            if (sol.interceptLocationTowardsObject[i] != null) {
               let toX = sol.interceptLocationTowardsObject[i][0];
               let toY = sol.interceptLocationTowardsObject[i][1];
               
               // Draw interception path for player
               ctx.save();
               ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency 
               ctx.lineWidth = 5;
               // Set the dash pattern: [dashLength, gapLength]
               ctx.setLineDash([10, 15]); // Example: 10 pixels dash, 15 pixels gap
               ctx.beginPath();
               ctx.moveTo(player.x, player.y );
               ctx.lineTo( toX, toY );

               let str = value.toFixed( 2 );
               ctx.fillText(str , toX + 15, toY - 15); 

               // Draw trajectory from target to this interception point
               //let index = sol.originalIndex[i];
               //if (index != -1) {
                  //if (objects[index] == null) {
                  //    console.log( 'test');
                  //} else {                
                    ctx.lineTo( targetX, targetY );           
                  //}
                  
               //}


               ctx.stroke();
               ctx.restore();
            }
            
        }
    }
} 

// MS4: draw arrow
function drawFilledArrow(ctx, toX, toY, arrowWidth) {
    const arrowLength = arrowWidth * 4; // Adjust the length of the arrow as needed
    const headLength = arrowWidth * 0.6; // Length of the head of the arrow
    const headWidth = arrowWidth * 1.4; // Width of the head of the arrow

    // Starting points for the arrow (adjust as necessary)
    const fromX = toX - arrowLength;
    const fromY = toY;

    // Set the fill color
    //ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    //ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency
    ctx.fillStyle = 'yellow';
    //ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Adjust the last number for transparency


    // Begin a new path for the arrow
    ctx.beginPath();

    // Draw the arrow body as a rectangle
    ctx.rect(fromX, fromY - arrowWidth / 2, arrowLength - headLength, arrowWidth);

    // Draw the arrow head as a triangle
    ctx.moveTo(toX - headLength, toY - headWidth / 2);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headLength, toY + headWidth / 2);

    // Close the path and fill the arrow with the set color
    ctx.closePath();
    ctx.fill();
}

// Messaging board status + AI image type
function displayAIStatus() {
    const aiAssistRobot = document.getElementById("aiAssistRobot");
    const aiAssistRobotCaption = document.getElementById("aiAssistRobotCaption");

    let curMaxTargets = settings.maxTargets;

    if (AIplayer.collabOrder == 1 && currentBlock == 0) {
        aiAssistRobot.src = "./images/simple-robot-line-removebg-preview.png";
        aiAssistRobot.style.backgroundColor = AIplayer.color;
        aiAssistRobotCaption.textContent = "Hi there! I'm Green-Bot. I'll be controlling the green square. I communicate my intentions using green colors.";
        aiAssistRobotCaption.style.opacity = "1";
        aiAssistRobotCaption.style.backgroundColor = AIplayer.color;; // Semi-transparent green
        aiAssistRobotCaption.style.fontWeight = "bold";
    } else if (AIplayer.collabOrder == 2 && currentBlock == 0) {
        aiAssistRobot.src = "./images/simple-robot-line-removebg-preview.png";
        aiAssistRobot.style.backgroundColor = AIplayer.color;
        aiAssistRobotCaption.textContent = "Howdy! I'm Purple-Bot. I'll be controlling the purple square. I communicate my intentions using purple colors.";
        aiAssistRobotCaption.style.opacity = "1";
        aiAssistRobotCaption.style.backgroundColor = "rgba(128, 0, 128, 0.5)"; // Semi-transparent purple
        aiAssistRobotCaption.style.fontWeight = "bold";
    } else if (AIplayer.collabOrder == 1 && currentBlock == 1) {
        aiAssistRobot.src = "./images/simple-robot-line-removebg-preview.png";
        aiAssistRobot.style.backgroundColor = AIplayer.color;
        aiAssistRobotCaption.textContent = "Ahoy! I'm Blue-Bot. I'll be controlling the blue square. I communicate my intentions using blue colors.";
        aiAssistRobotCaption.style.opacity = "1";
        aiAssistRobotCaption.style.backgroundColor = AIplayer.color;; // Semi-transparent brown
        aiAssistRobotCaption.style.fontWeight = "bold";
    } else if (AIplayer.collabOrder == 2 && currentBlock == 1) {
        aiAssistRobot.src = "./images/simple-robot-line-removebg-preview.png";
        aiAssistRobot.style.backgroundColor = AIplayer.color;
        aiAssistRobotCaption.textContent = "G'day! I'm Copper-Bot. I'll be controlling the copper-colored square. I communicate my intentions using copper colors.";
        aiAssistRobotCaption.style.opacity = "1";
        aiAssistRobotCaption.style.backgroundColor = AIplayer.color; // Semi-transparent blue
        aiAssistRobotCaption.style.fontWeight = "bold";
    } 
}

// Custom alert message in order to pause the game and display text
function showCustomAlert(message) {

    return new Promise((resolve, reject) => {
        // Display the custom alert with the message
        $('#customAlertMessage').text(message);
        $('#customAlert').show();
    
        // Set up the event handlers for the 'X' and 'OK' buttons
        $('#customAlert .custom-alert-close, #customAlert button').one('click', function() {
            $('#customAlert').hide();
            resolve(); // This resolves the Promise allowing code execution to continue
        });
    });
}

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
// *************************************** INTERCEPTION ALGORITHMS ********************************** //
// Intercept Function for the Player
function attemptInterceptLocal(playerPosX, playerPosY, playerSpeed, objectPosX, objectPosY, objectVelX, objectVelY, circleRadius) {
    let success = false;
    let travelTime = Infinity;
    let interceptPosX = NaN;
    let interceptPosY = NaN;
    let totalDistanceTraveled = Infinity;

    // Check if the object is within the circle initially
    if (Math.sqrt(objectPosX ** 2 + objectPosY ** 2) > circleRadius) {
        return [ success, travelTime, interceptPosX, interceptPosY, totalDistanceTraveled ];
    }

    // Initial relative position from the player to the object
    let relativePosX = objectPosX - playerPosX;
    let relativePosY = objectPosY - playerPosY;

    // Solving quadratic equation
    let A = objectVelX ** 2 + objectVelY ** 2 - playerSpeed ** 2;
    let B = 2 * (relativePosX * objectVelX + relativePosY * objectVelY);
    let C = relativePosX ** 2 + relativePosY ** 2;

    let discriminant = B ** 2 - 4 * A * C;

    if (discriminant < 0) {
        // No real solutions, interception not possible
        return [ success, travelTime, interceptPosX, interceptPosY, totalDistanceTraveled ];
    }

    // Calculate potential times for interception
    let t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
    let t2 = (-B - Math.sqrt(discriminant)) / (2 * A);

    // Determine the valid and earliest interception time
    if (t1 >= 0 && (t1 < t2 || t2 < 0)) {
        travelTime = t1;
    } else if (t2 >= 0) {
        travelTime = t2;
    } else {
        // No valid interception time found
        return [ success, travelTime, interceptPosX, interceptPosY, totalDistanceTraveled ];
    }

    interceptPosX = objectPosX + travelTime * objectVelX;
    interceptPosY = objectPosY + travelTime * objectVelY;
    totalDistanceTraveled = travelTime * playerSpeed;

    // Check if the intercept position is within the circle
    if (Math.sqrt(interceptPosX ** 2 + interceptPosY ** 2) <= circleRadius) {
        success = true;
    }

    if ((travelTime == null) | (interceptPosX== null) | ( interceptPosX==null) |
       (totalDistanceTraveled == null) | (success==null)) {
        if (DEBUG) console.log( 'Null values');
    }

    return [ success, travelTime, interceptPosX, interceptPosY, totalDistanceTraveled ];
}

// Prediction of interception accross all targets
function willSquareAndCircleOverlap(x1, y1, vx1, vy1, r1, x2, y2, vx2, vy2, r2, timeToIntercept) {
    // Function to calculate the square's corners at time t
    function getSquareCorners(x, y, r, t) {
        const halfR = r / 2;
        return [
            { x: x + halfR, y: y + halfR },
            { x: x + halfR, y: y - halfR },
            { x: x - halfR, y: y + halfR },
            { x: x - halfR, y: y - halfR }
        ].map(corner => ({
            x: corner.x + vx1 * t,
            y: corner.y + vy1 * t
        }));
    }

    // Function to calculate the circle's center at time t
    function getCircleCenter(x, y, t) {
        return {
            x: x + vx2 * t,
            y: y + vy2 * t
        };
    }

    // Function to calculate distance from point to line segment
    function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
        const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (lineLength === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

        const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength ** 2)));
        const closestX = x1 + t * (x2 - x1);
        const closestY = y1 + t * (y2 - y1);
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
    }

    // Check overlap at time t
    function checkOverlap(t) {
        if (t < 0 || t > timeToIntercept) return false;

        const circle = getCircleCenter(x2, y2, t);
        const squareCorners = getSquareCorners(x1, y1, r1, t);
        const halfR = r1 / 2;

        // Check distance to all corners
        for (const corner of squareCorners) {
            const dist = Math.sqrt((circle.x - corner.x) ** 2 + (circle.y - corner.y) ** 2);
            if (dist <= r2) {
                return true;
            }
        }

        // Check distance to edges
        const edges = [
            { x1: x1 - halfR, y1: y1 - halfR, x2: x1 + halfR, y2: y1 - halfR },
            { x1: x1 + halfR, y1: y1 - halfR, x2: x1 + halfR, y2: y1 + halfR },
            { x1: x1 + halfR, y1: y1 + halfR, x2: x1 - halfR, y2: y1 + halfR },
            { x1: x1 - halfR, y1: y1 + halfR, x2: x1 - halfR, y2: y1 - halfR }
        ].map(edge => ({
            x1: edge.x1 + vx1 * t,
            y1: edge.y1 + vy1 * t,
            x2: edge.x2 + vx1 * t,
            y2: edge.y2 + vy1 * t
        }));

        for (const edge of edges) {
            const dist = pointToSegmentDistance(circle.x, circle.y, edge.x1, edge.y1, edge.x2, edge.y2);
            if (dist <= r2) {
                return true;
            }
        }

        return false;
    }

    // Solve quadratic equation to find potential times of overlap
    const a = (vx1 - vx2) ** 2 + (vy1 - vy2) ** 2;
    const b = 2 * ((x1 - x2) * (vx1 - vx2) + (y1 - y2) * (vy1 - vy2));
    const c = (x1 - x2) ** 2 + (y1 - y2) ** 2 - (r1 / 2 + r2) ** 2;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return false;
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2 * a);
    const t2 = (-b + sqrtDiscriminant) / (2 * a);

    // Check if overlap occurs at any potential time points within the stopping time
    return checkOverlap(t1) || checkOverlap(t2) || checkOverlap(0);
}

function splitGameHalf(obj) {

    // console.log(bestSol.interceptLocations);
    // Center of the game view
    const center = { x: canvas.width / 2, y: canvas.height / 2 };

    // Calculate the angle between the player and the center
    let playerAngle = Math.atan2(center.y - player.y, center.x - player.x);

    // Calculate the orthogonal angle (90 degrees or PI/2 radians)
    let orthoAngle = playerAngle + Math.PI / 2;

    drawingAngle = orthoAngle; // global variable assignment

    // Calculate the angle between the object and the center
    let objAngle = Math.atan2(obj.y - center.y, obj.x - center.x);

    // Normalize angles to range [0, 2*PI)
    function normalizeAngle(angle) {
        return (angle + 2 * Math.PI) % (2 * Math.PI);
    }

    let normalizedObjAngle = normalizeAngle(objAngle);
    let normalizedPlayerAngle = normalizeAngle(playerAngle);

    // Check if object is in the player's allotted pi region
    let angleDifference = Math.abs(normalizedObjAngle - normalizedPlayerAngle);

    // Determine if the object is on the left or right side of the orthogonal line
    let isInAIHalf = angleDifference < Math.PI / 2 || angleDifference > (3 * Math.PI) / 2;

    return !isInAIHalf;
}

// version where the interception location is used to determine the half
// function splitGameHalf(obj) {
//     // Center of the game view
//     const center = { x: canvas.width / 2, y: canvas.height / 2 };

//     // Calculate the angle between the player and the center
//     let playerAngle = Math.atan2(player.y - center.y, player.x - center.x);

//     // Calculate the orthogonal angle (90 degrees or PI/2 radians)
//     let orthoAngle = playerAngle + Math.PI / 2;
//     drawingAngle = orthoAngle;

//     // Get the interception location for this object from bestSol
//     let interceptLocation = null;
//     if (bestSol && bestSol.interceptLocations) {
//         // Find matching interception location by object ID
//         const index = bestSol.interceptionOrder.indexOf(obj.ID);
//         if (index !== -1) {
//             interceptLocation = bestSol.interceptLocations[index];
//         }
//     }

//     // If no interception location found, use object's current position
//     const targetX = interceptLocation ? interceptLocation[0] : obj.x;
//     const targetY = interceptLocation ? interceptLocation[1] : obj.y;

//     // Calculate the angle between the interception point and the center
//     let targetAngle = Math.atan2(targetY - center.y, targetX - center.x);

//     // Normalize angles to range [0, 2*PI)
//     function normalizeAngle(angle) {
//         return (angle + 2 * Math.PI) % (2 * Math.PI);
//     }

//     let normalizedTargetAngle = normalizeAngle(targetAngle);
//     let normalizedPlayerAngle = normalizeAngle(playerAngle);

//     // Calculate the absolute angular difference
//     let angleDifference = Math.abs(normalizedTargetAngle - normalizedPlayerAngle);
//     if (angleDifference > Math.PI) {
//         angleDifference = 2 * Math.PI - angleDifference;
//     }

//     // If angle difference is less than PI/2, it's in the player's half
//     let isInPlayerHalf = angleDifference <= Math.PI / 2;

//     if (frameCountGame % 30 === 0) {  // Debug logging every 30 frames
//         console.log({
//             objId: obj.ID,
//             playerAngle: playerAngle * (180/Math.PI),
//             targetAngle: targetAngle * (180/Math.PI),
//             angleDiff: angleDifference * (180/Math.PI),
//             isInPlayerHalf: isInPlayerHalf
//         });
//     }

//     return isInPlayerHalf;  // Return true if in player's half
// }

function drawPlayerHalf(angle) {
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = Math.max(canvas.width, canvas.height) / 2; // Radius large enough to cover the entire canvas

    ctx.save();
    ctx.beginPath();

    // Move to the center
    ctx.moveTo(center.x, center.y);

    // Draw an arc from PI to 2PI (opposite half circle)
    ctx.arc(center.x, center.y, radius, angle + Math.PI, angle + 2 * Math.PI);

    // Close the path back to the center
    ctx.closePath();

    // Fill with semi-transparent green
    ctx.fillStyle = `rgba(${AIplayer.color.match(/\d+/g).slice(0,3).join(',')}, 0.15)`;
    ctx.fill();

    // Draw the dividing line
    ctx.beginPath();
    ctx.moveTo(center.x - radius * Math.cos(angle), center.y - radius * Math.sin(angle));
    ctx.lineTo(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle));
    ctx.strokeStyle = AIplayer.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}

// ***************************************** EVENT LISTENERS ***************************************** //
let lastClickedObj = null;
$(document).ready( function(){
   // Event listener for player click locations
   canvas.addEventListener('click', function(event) {
        // Get the position of the click relative to the canvas
        // Check not first click so that initializing game doesn't leed to player movement
        const rect   = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Calculate the angle from the player to the click position
        const deltaX = clickX - (player.x + player.width / 2);
        const deltaY = clickY - (player.y + player.height / 2);
        player.angle = Math.atan2(deltaY, deltaX);

        // console.log('Player clicked:', clickX, clickY);
        let playerStartX = 0;
        let playerStartY = 0;

        let objectStartX = 0;
        let objectStartY = 0;

        let objectVelX = 0;
        let objectVelY = 0;

        let success, travelTime, interceptPosX, interceptPosY, totalDistanceTraveled = 0;

        // Extract the game state for the click and then ush into the playerClicks dataframe
        let gameSnapshot = extractGameState(objects);
        // if (DEBUG) console.log('gameSnapshot:', gameSnapshot);  

        // check if player clicked on a target
        for (let i = 0; i < objects.length; i++) {
            if (isClickOnObject(objects[i], clickX, clickY)) {
                // The click is on this object
                objects[i].clicked = true;
                objects[i].marked = true;

                // unmark the previous target object
                for (let j = 0; j < objects.length; j++) {
                    if (i !== j) {
                        objects[j].marked = false;
                    }
                }

                playerStartX = ( player.x - center.x );
                playerStartY = ( player.y - center.y );

                objectStartX = ( objects[i].x - center.x );
                objectStartY = ( objects[i].y - center.y );

                objectVelX = objects[i].vx * objects[i].speed;
                objectVelY = objects[i].vy * objects[i].speed;


                // ********* CALCULATE THE DELAY IN PLANNING ********* //

                // num frames it took to make a new target choice 
                // if (player.targetObjID != null && player.targetObjID != objects[i].ID) { // add a delay variable when a new object is clicked
                if (!player.moving){ // only clicks that happen when the player is not moving
                    // console.log("number delays", clickTimes.length);
                    // console.log("Number of Frames Player not Moving", numFramesPlayernotMoving)
                    clickTimes.push(numFramesPlayernotMoving);
                 
                    let lastNumClicks = 5;  
                    avgResponseTime = getExponentialMovingAverage(lastNumClicks);
                    // console.log("Average Response Time", avgResponseTime);
                }        

                planDelayFrames = Math.floor(avgResponseTime);

                let circleRadius = 390;

                [success, travelTime, interceptPosX, 
                interceptPosY, totalDistanceTraveled] = attemptInterceptLocal(playerStartX,playerStartY, player.velocity, 
                                                        objectStartX, objectStartY, objectVelX, objectVelY, circleRadius);

                // Intercept the clicked object using the optimal intercept location
                player.targetX = interceptPosX + center.x; //+ center.x;
                player.targetY = interceptPosY + center.y; //+ center.y;
                player.moving = true;
                player.targetObjID = objects[i].ID;
                player.timeToIntercept = travelTime;

                // (Sanity Check) Only in the case that the object speed is beyond the player speed 
                if (totalDistanceTraveled == Infinity){
                    if (DEBUG) console.log('No interception possible');
                    objects[i].innerColor = 'red'
                }
                
                if (DEBUG) console.log("frames player not moving", numFramesPlayernotMoving);
                if (DEBUG) console.log("ai frame delay relative to human :", planDelayFrames);

                // Values for writing to dataframe
                let objectData      = {ID: objects[i].ID, value: objects[i].value,
                                    x: objects[i].x, y: objects[i].y,
                                    dx: objects[i].dx, dy: objects[i].dy,
                                    vx: objects[i].vx, vy: objects[i].vy, speed: objects[i].speed,
                                    clicked: objects[i].clicked, marked: objects[i].marked, AImarked: objects[i].AImarked};

                let playerData      = {x: player.x, y: player.y, speed: player.velocity, 
                                    dx: player.dx, dy: player.dy,
                                    targetX: player.targetX, targetY: player.targetY,
                                    angle: player.angle, moving: player.moving,
                                    score:player.score, AIscore: AIplayer.score, 
                                    playerDelay: numFramesPlayernotMoving, AIplayerDelay: planDelayFrames};

                let interceptData   = {x: interceptPosX, y: interceptPosY, time: travelTime, distance: totalDistanceTraveled,  
                                        intendedTarget: player.targetObjID, AIintendedTarget: AIplayer.ID};
                let eventType       = 'clickObject';

                // collapse the 4 object events (spawning, collision, clicking, exiting) into one 1 dataframe
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: playerData, 
                                    interceptData: interceptData, gameState: gameSnapshot};

                eventStream.push(eventObject)

                // if (DEBUG) console.log('Object Click eventObject:', eventObject);
            }  
            // if click is around the center, then allow movement there
            if ( isClickOnCenter(clickX,clickY) ) {
                player.targetX = 400;
                player.targetY = 400;
                player.moving = true;
                player.toCenter = true;

                let eventType       = 'clickCenter';
                // let objectData      = 0;

                let objectData      = {ID:0, value:0,
                                    x: center.x, y: center.y,
                                    dx: 0, dy: 0,
                                    vx: 0, vy: 0, speed: 0,
                                    clicked: true, marked: true};

                let playerData      = {x: player.x, y: player.y, speed: player.velocity, 
                                    dx: player.dx, dy: player.dy,
                                    targetX: player.targetX, targetY: player.targetY,
                                    angle: player.angle, moving: player.moving,
                                    score:player.score, AIscore: AIplayer.score};
                let interceptData   = null;
                
                // collapse the 4 object events (spawning, collision, clicking, exiting) into one 1 dataframe
                let eventObject     = {time: frameCountGame, eventType: eventType, 
                                    objectData: objectData, playerData: playerData, 
                                    interceptData: interceptData, gameState: gameSnapshot};

                eventStream.push(eventObject)

                // if (DEBUG) console.log('Center Click eventObject:', eventObject);

            } else{
                player.toCenter = false;
            }
        }
    });

    window.closeCustomAlert = closeCustomAlert; // Add closeCustomAlert to the global scope
});

async function runGameSequence(message) {
    isPaused = true;
    await showCustomAlert(message);
    isPaused = false;
}

// Function to check if the start game area is clicked
function isStartGameAreaClicked(x, y) {
    return x > canvas.width / 2 - 100 && x < canvas.width / 2 + 100 &&
           y > canvas.height / 2 - 20 && y < canvas.height / 2 + 20;
}

// Helper function to determine if the click is on the object
function isClickOnObject(obj, x, y) {
    // Calculate the center of the object
    const centerX = obj.x + obj.size / 2;
    const centerY = obj.y + obj.size / 2;

    // Calculate the distance between the click and the object's center
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    // Check if the distance is less than or equal to the cursor size
    return distance <= cursorSize;
}

// Helper function to determine if the click is on the center
function isClickOnCenter(clickX,clickY){
    if ( Math.abs(clickX - center.x) <= 10 && Math.abs(clickY - center.y) <= 10 ){
        return true;
    }
}

//***************************************************** AI COMPARISON ***************************************************//

async function loadAIComparison() {
    var DEBUG_SURVEY = DEBUG;

    // Survey Information
    var TOPIC_AI_COMPARISON_DICT = {
        "selectedAI": null,
    };

    // Clear previous inputs and classes
    $('#ai-1-button').removeClass('robot-button-selected robot-button-iron robot-button-copper robot-button-green robot-button-purple robot-button-brown robot-button-blue');
    $('#ai-2-button').removeClass('robot-button-selected robot-button-iron robot-button-copper robot-button-green robot-button-purple robot-button-brown robot-button-blue');
    $('#survey-complete-button-comparison').prop('disabled', true);
    
     // Routing to correct survey (based on the corresponding conditions)
     // max targets is 5 first, then 15 (i.e. currentConditino <= 4)
     if (visitedBlocks == 1 && currentCondition <= 4) { // max targets if 5
        $('#ai-1-button').addClass('robot-button-green');
        $('#ai-2-button').addClass('robot-button-purple');
        $('#ai-1-button').next('figcaption').text('Green-Bot');
        $('#ai-2-button').next('figcaption').text('Purple-Bot');
    } else if (visitedBlocks == 2 && currentCondition <= 4 ) { // max targets is 15
        // $('#ai-1-button').addClass('robot-button-iron');
        $('#ai-1-button').addClass('robot-button-blue');
        $('#ai-2-button').addClass('robot-button-copper');
        $('#ai-1-button').next('figcaption').text('Blue-Bot');
        $('#ai-2-button').next('figcaption').text('Copper-Bot');
    }

    //Routing to correct survey for max target conditions 5-8
    if (visitedBlocks == 1 && currentCondition > 4) { // takes us to the correct survey
        // $('#ai-1-button').addClass('robot-button-iron');
        $('#ai-1-button').addClass('robot-button-blue');
        $('#ai-2-button').addClass('robot-button-copper');
        $('#ai-1-button').next('figcaption').text('Blue-Bot');
        $('#ai-2-button').next('figcaption').text('Copper-Bot');
    } else if (visitedBlocks == 2 && currentCondition > 4) {
        $('#ai-1-button').addClass('robot-button-green');
        $('#ai-2-button').addClass('robot-button-purple');
        $('#ai-1-button').next('figcaption').text('Green-Bot');
        $('#ai-2-button').next('figcaption').text('Purple-Bot');
    }


    $(document).ready(function () {

        function handleAISelection() {
            /*
                Image Button Selection Controller.

                Only one AI option can be selected.
                Enable the submit button once an AI is selected.
            */

            // Retrieve the current AI that was selected
            let selectedAI = $(this).attr("id");

            if (selectedAI === 'ai-1-button') {
                $('#ai-1-button').addClass('robot-button-selected');
                $('#ai-2-button').removeClass('robot-button-selected');
                TOPIC_AI_COMPARISON_DICT["selectedAI"] = agent1Name;
            } else {
                $('#ai-2-button').addClass('robot-button-selected');
                $('#ai-1-button').removeClass('robot-button-selected');
                TOPIC_AI_COMPARISON_DICT["selectedAI"] = agent2Name;
            }

            // Enable the submit button
            $('#survey-complete-button-comparison').prop('disabled', false);

            if (DEBUG) {
                console.log("AI Button Selected\n:", "Value :", TOPIC_AI_COMPARISON_DICT["selectedAI"]);
            }
        }

        async function completeExperiment() {
            /*
                When submit button is clicked, the experiment is done.

                This will submit the final selection and then load the
                "Experiment Complete" page.
            */
            let SURVEY_END_TIME = new Date();

            // Write to database based on the number of surveys completed
            
            if (numSurveyCompleted == 1) {
                let path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/AIcomparison1' ;
                await writeRealtimeDatabase(db1, path, TOPIC_AI_COMPARISON_DICT);
                $("#ai-comparison-container").attr("hidden", true);
                $("#ai-open-ended-feedback-container").attr("hidden", false);
                loadAIopenEndedFeedback(numSurveyCompleted);
                
            } else if (numSurveyCompleted == 2) {
                let path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/AIcomparison2' ;
                await writeRealtimeDatabase(db1, path, TOPIC_AI_COMPARISON_DICT);
                $("#ai-comparison-container").attr("hidden", true);
                $("#ai-open-ended-feedback-container").attr("hidden", false);
                await loadAIopenEndedFeedback(numSurveyCompleted);
            } 
        }

        // Handle AI selection for both buttons
        $('#ai-1-button').click(handleAISelection);
        $('#ai-2-button').click(handleAISelection);

        // Handle submitting survey
        $('#survey-complete-button-comparison').off().click(completeExperiment);
    });
}

async function loadAIopenEndedFeedback(numSurveyCompleted) {
    var DEBUG_SURVEY = DEBUG;
    // var numSurveyCompleted = 0; // Assuming this variable is defined somewhere in your global scope

    $(document).ready(function () {
        // Clear previous inputs
        $('#ai-feedback-text').val('');
        $('#submit-feedback-button').prop('disabled', true);

        $('#ai-feedback-text').on('input', function () {
            // Enable the submit button if there's any text in the feedback
            if ($(this).val().trim() !== '') {
                $('#submit-feedback-button').prop('disabled', false);
            } else if (DEBUG_SURVEY){
                $('#submit-feedback-button').prop('disabled', false);
            } else {
                $('#submit-feedback-button').prop('disabled', true);
            }
        });

        async function completeExperiment() {
            /*
                When submit button is clicked, submit the feedback and load the complete page.
            */
            let feedback = $('#ai-feedback-text').val().trim();
            let feedbackData = {
                feedback: feedback,
                timestamp: new Date().toISOString()
            };

            // // Example of writing the feedback to the database
            // let path = studyId + '/participantData/' + firebaseUserId1 + '/AIopenEndedFeedback';
            // await writeRealtimeDatabase(db1, path, feedbackData);
            
            if (numSurveyCompleted == 1) {
                let path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/OpenEnded1' ;
                await writeRealtimeDatabase(db1, path, feedbackData);
            } else if (numSurveyCompleted == 2) {
                let path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/OpenEnded2' ;
                await writeRealtimeDatabase(db1, path, feedbackData);
            }

            if (numSurveyCompleted == 2) {
                // push them to the final page of the experiment which redirects participants
                $("#ai-open-ended-feedback-container").attr("hidden", true);
                $("#task-header").attr("hidden", true);
                $("#exp-complete-header").attr("hidden", false);
                $("#complete-page-content-container").attr("hidden", false);
                finalizeBlockRandomization(db1, studyId, blockOrderCondition);
                finalizeBlockRandomization(db1, studyId, teamingBlockCondition);
                await loadCompletePage();
            } else {
                // update AI order settings
                await updateAgentOrdering();
                $("#ai-open-ended-feedback-container").attr("hidden", true);
                $("#full-game-container").attr("hidden", false);
            }
        }

        // Handle submitting feedback
        $('#submit-feedback-button').off().click(completeExperiment);
    });
}

//**************************************************** SURVEY -- FULL ****************************************************//
async function loadFullSurvey(){
    var DEBUG_SURVEY = DEBUG;
    var TOPIC_FULL_DICT = {
        "agent1": {},
        "agent2": {}
    };
    var TOTAL_QUESTIONS = 8; // Matches the number of questions in the HTML

    $('.radio-group input[type="radio"]').prop('checked', false);

    // Function to update robot icons and colors
    function updateRobotIcons() {
        let agent1Icon = $('#agent1-icon');
        let agent2Icon = $('#agent2-icon');
        let agent1Caption = $('#agent1-caption');
        let agent2Caption = $('#agent2-caption');

        // Remove any existing color classes
        agent1Icon.removeClass('robot-green robot-purple robot-blue robot-copper');
        agent2Icon.removeClass('robot-green robot-purple robot-blue robot-copper');

        if (visitedBlocks == 1 && currentCondition <= 4) {
            agent1Icon.addClass('robot-green');
            agent2Icon.addClass('robot-purple');
            agent1Caption.text('Green-Bot');
            agent2Caption.text('Purple-Bot');
        } else if (visitedBlocks == 2 && currentCondition <= 4) {
            agent1Icon.addClass('robot-blue');
            agent2Icon.addClass('robot-copper');
            agent1Caption.text('Blue-Bot');
            agent2Caption.text('Copper-Bot');
        } else if (visitedBlocks == 1 && currentCondition > 4) {
            agent1Icon.addClass('robot-blue');
            agent2Icon.addClass('robot-copper');
            agent1Caption.text('Blue-Bot');
            agent2Caption.text('Copper-Bot');
        } else if (visitedBlocks == 2 && currentCondition > 4) {
            agent1Icon.addClass('robot-green');
            agent2Icon.addClass('robot-purple');
            agent1Caption.text('Green-Bot');
            agent2Caption.text('Purple-Bot');
        }
    }

    // Call the function to update robot icons
    updateRobotIcons();

    function likertTopicAbility() {
        let [question, agent] = $(this).attr("name").split("_");
        TOPIC_FULL_DICT[agent][question] = Number($(this).val());

        checkAllAnswered();

        if (DEBUG_SURVEY) {
            console.log(
                "Radio Button Selected:",
                "Question:", question,
                "Agent:", agent,
                "Value:", TOPIC_FULL_DICT[agent][question]
            );
        }
    }

    function checkAllAnswered() {
        var totalAnswered = 0;

        for (let agent in TOPIC_FULL_DICT) {
            totalAnswered += Object.keys(TOPIC_FULL_DICT[agent]).length;
        }

        var allAnswered = totalAnswered === TOTAL_QUESTIONS * 2; // 2 agents

        if (DEBUG_SURVEY) {
            console.log("Total answered:", totalAnswered);
            console.log("All answered:", allAnswered);
            allAnswered = true;
        }

        $('#survey-complete-button-full').prop('disabled', !allAnswered);

        if (DEBUG_SURVEY) {
            console.log("Submit button " + (allAnswered ? "enabled" : "disabled"));
        }
    }

    async function completeExperiment() {
        numSurveyCompleted++;
        
        let path;
        if (numSurveyCompleted == 1) {
            path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/full1';
        } else if (numSurveyCompleted == 2) {
            path = studyId + '/participantData/' + firebaseUserId1 + '/selfAssessment/full2';

        }

        await writeRealtimeDatabase(db1, path, TOPIC_FULL_DICT);
        await loadAIComparison();

        $("#ai-comparison-container").attr("hidden", false);
        $("#survey-full-container").attr("hidden", true);
    }

    $('.radio-group input[type="radio"]').click(likertTopicAbility);
    $('#survey-complete-button-full').off().click(completeExperiment);

    // Initial check in case the form is pre-filled
    checkAllAnswered();
}

//*************************************************** COMPLETE -- REDIRECT ************************************************//
async function loadCompletePage(){
    var DEBUG_COMPLETE     = false;

    /******************************************************************************
        VARIABLES

            All metadata variables that are relevant to the survey page.
    ******************************************************************************/
    // console.log("Database and firebaseuid: ", db1, firebaseUserId1); 
    // Database Path
    // var COMPLETE_DB_PATH        = EXPERIMENT_DATABASE_NAME + '/participantData/' + firebaseUserId1 + '/userFeedback';

    $(document).ready(function (){
        /******************************************************************************
            FUNCTIONALITY
    
                All functions that will be used for the complete page.
        ******************************************************************************/
        function replaceClass(element, remove, add) {
            /*
                Use jQuery to replace the class of the given element.
            */
    
            $(element).removeClass(remove);
            $(element).addClass(add);
        };
        
        function redirectToProlific() {
            /*
                Redirect participants back to prolific after the study.
            */
            //  Redirect URL for Experiment 02 (explanationstyleN with eplanations file v15) (pilot 10 participants)
            var restart;
            if (confirm("If you click 'OK', you will be redirected to Prolific. If you click 'Cancel' you will stay on this page.")) {
                restart = true;
            } else {
                restart = false;
            }
            
            // The redirect URL should be back to Prolific
            if (restart) {
                if (DEBUG_COMPLETE){
                    window.location.replace("https://skarny0.github.io/target-intercept-exp-3/");
                } else {
                    // This redirect should be updated to Prolific when you are LIVE
                    window.location.replace("https://app.prolific.com/submissions/complete?cc=C683JZHM");
                }
            }
        }
    
        function feedbackToSubmit() {
            /*
                Determine if there is feedback to submit or not.
    
                If there is then the button is enabled.
                If there isn't then the button is disabled.
    
            */
            let content = $("#user-feedback-text").val().trim();
            $('#user-feedback-button').prop('disabled', content === '');
        }
    
        function submitFeedback() {
            /*
                Submit user feedback.

            */

            let feedbacktext = $('#user-feedback-text').val();
            let path = studyId + '/participantData/' + firebaseUserId1 + 'paricipantInfo/' + 'feedback';
            let currentPath = studyId + '/participantData/' + firebaseUserId1 + '/participantInfo/' + 'feedback'
            writeRealtimeDatabase(db1, currentPath, feedbacktext);
    
            replaceClass('#user-feedback-button', "btn-secondary", "btn-primary");
        };
        //  Copy Unique Code to Clipboard
        $('#unique-code-copy-button').click(redirectToProlific);
    
        //  Determine if there is User Feedback to be Submitted
        $('#user-feedback-text').on('keyup', feedbackToSubmit);
    
        //  Submit User Feedback
        $('#user-feedback-button').click(submitFeedback);
    });
}