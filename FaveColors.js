
/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Array containing knock knock jokes.
 */
// var JOKE_LIST = [
//     {setup: "To", speechPunchline: "Correct grammar is <break time=\"0.2s\" /> to whom.",
//         cardPunchline: "Correct grammar is 'to whom'."},
//     {setup: "Beets!", speechPunchline: "Beats me!", cardPunchline: "Beats me!"},
//     {setup: "Little Old Lady", speechPunchline: "I didn't know you could yodel!",
//         cardPunchline: "I didn't know you could yodel!"},
//     {setup: "A broken pencil", speechPunchline: "Never mind. It's pointless.",
//         cardPunchline: "Never mind. It's pointless."},
//     {setup: "Snow", speechPunchline: "Snow use. I forgot", cardPunchline: "Snow use. I forgot"},
//     {setup: "Boo", speechPunchline: "Aww <break time=\"0.3s\" /> it's okay <break time=\"0.3s\" /> don't cry.",
//         cardPunchline: "Aww, it's okay, don't cry."},
//     {setup: "Woo", speechPunchline: "Don't get so excited, it's just a joke",
//         cardPunchline: "Don't get so excited, it's just a joke"},
//     {setup: "Spell", speechPunchline: "<say-as interpret-as=\"characters\">who</say-as>",
//         cardPunchline: "w.h.o"},
//     {setup: "Atch", speechPunchline: "I didn't know you had a cold!", cardPunchline: "I didn't know you had a cold!"},
//     {setup: "Owls", speechPunchline: "Yes, they do.", cardPunchline: "Yes, they do."},
//     {setup: "Berry!", speechPunchline: "Berry nice to meet you.", cardPunchline: "Berry nice to meet you."}
// ];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * HackFeelings is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HackFeelings = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HackFeelings.prototype = Object.create(AlexaSkill.prototype);
HackFeelings.prototype.constructor = HackFeelings;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
HackFeelings.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
HackFeelings.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HackFeelings onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    handleFeelingIntent(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
HackFeelings.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

HackFeelings.prototype.intentHandlers = {
    "HandleFeelingIntent": function (intent, session, response) {
        handleFeelingIntent(session, response);
    },

    "FirstResponseIntent": function (intent, session, response) {
        firstResponseIntent(session, response);
    },

    // "SecondResponseIntent": function (intent, session, response) {
    //     handleSetupNameWhoIntent(session, response);
    // },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "";

        switch (session.attributes.stage) {
            case 0:
                speechText = "Why did you want to talk?";
                break;
            case 1:
                speechText = "Are you still bored?";
                break;
            case 2:
                speechText = "Good luck!";
                break;
            default:
                speechText = "What are you feeling?";
        }

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Selects a joke randomly and starts it off by saying "Knock knock".
 */
function handleFeelingIntent(session, response) {
    var speechText = "";
    const feelingSlot = intent.slots.Feeling; //get slot

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = "Are you still bored?";

    //Check if session variables are already initialized.
    if (session.attributes.stage) {

        //Ensure the dialogue is on the correct stage.
        if (session.attributes.stage === 0) {
            //The joke is already initialized, this function has no more work.

            speechText = "Are you still ${feelingSlot.value}";

        } else {
            //The user attempted to jump to the intent of another stage.
            // session.attributes.stage = 0;
            // speechText = "That's not how knock knock jokes work! "
            //     + "knock knock";
        }
    } else {
        //Select a random joke and store it in the session variables.
        // var jokeID = Math.floor(Math.random() * JOKE_LIST.length);

        // //The stage variable tracks the phase of the dialogue.
        // //When this function completes, it will be on stage 1.
        // session.attributes.stage = 1;
        // session.attributes.setup = JOKE_LIST[jokeID].setup;
        // session.attributes.speechPunchline = JOKE_LIST[jokeID].speechPunchline;
        // session.attributes.cardPunchline = JOKE_LIST[jokeID].cardPunchline;

        // speechText = "Knock knock!";
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Hack Feelings", speechText);
}

/**
 * Responds to the user saying "Who's there".
 */
function handlefirstResponseIntent(session, response) {
    var feeling = "";
    var repromptText = "";
    const responseSlot = intent.slots.Response; //get slot
    const responseVal = responseSlot.value;

    if (session.attributes.stage) {
        if (session.attributes.stage === 1) {
            //Retrieve the joke's setup text.
            feeling = session.attributes.setup;

            //Advance the stage of the dialogue.
            session.attributes.stage = 2;

            if(responseVal === 'yes'){
              repromptText = "That's good.";
            }else{
              repromptText = "Are you feeling better now?";
            }


        } else {
            // session.attributes.stage = 1;
            // feeling = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
            //     + "knock knock";

            // repromptText = "You can ask, who's there."
        }
    } else {

        //If the session attributes are not found, the joke must restart.
        feeling = "Sorry, I couldn't understand you "
            + "You can say, I am feeling bored.";

        repromptText = "You can say, I am bored.";
    }

    var speechOutput = {
        speech: '<speak>' + feeling + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: '<speak>' + repromptText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput, repromptOutput);
}

/**
 * Delivers the punchline of the joke after the user responds to the setup.
 */
// function handleSetupNameWhoIntent(session, response) {
//     var speechText = "",
//         repromptText = "",
//         speechOutput,
//         repromptOutput,
//         cardOutput;

//     if (session.attributes.stage) {
//         if (session.attributes.stage === 2) {
//             speechText = session.attributes.speechPunchline;
//             cardOutput = session.attributes.cardPunchline;
//             speechOutput = {
//                 speech: '<speak>' + speechText + '</speak>',
//                 type: AlexaSkill.speechOutputType.SSML
//             };
//             //If the joke completes successfully, this function uses a "tell" response.
//             response.tellWithCard(speechOutput, "Wise Guy", cardOutput);
//         } else {

//             session.attributes.stage = 1;
//             speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
//                 + "Knock knock!";
//             cardOutput = "That's not how knock knock jokes work! "
//                 + "Knock knock!";

//             repromptText = "You can ask who's there.";

//             speechOutput = {
//                 speech: speechText,
//                 type: AlexaSkill.speechOutputType.SSML
//             };
//             repromptOutput = {
//                 speech: repromptText,
//                 type: AlexaSkill.speechOutputType.PLAIN_TEXT
//             };
//             //If the joke has to be restarted, this function uses an "ask" response.
//             response.askWithCard(speechOutput, repromptOutput, "Wise Guy", cardOutput);
//         }
//     } else {
//         speechText = "Sorry, I couldn't correctly retrieve the joke. "
//             + "You can say, tell me a joke";

//         repromptText = "You can say, tell me a joke";

//         speechOutput = {
//             speech: speechText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         repromptOutput = {
//             speech: repromptText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         response.askWithCard(speechOutput, repromptOutput, "Hack Feelings", speechOutput);
//     }
// }

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new HackFeelings();
    skill.execute(event, context);
};
