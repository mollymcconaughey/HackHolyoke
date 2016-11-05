'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Tell me what\'s going on. ';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me what you are feeling. ' +
        'I am bored.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createFeelingAttributes(feeling) {
    return {
        feeling,
    };
}

// function createBoredResponseAttributes(boredResponse) {
//     return {
//         boredResponse,
//     };
//
//
// }

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setFeelingInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const feelingSlot = intent.slots.Feeling;
    //const responseSlot = i
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (feelingSlot) {
        const feeling = feelingSlot.value;
        sessionAttributes = createFeelingAttributes(feeling);
        speechOutput += `Okay you are ${feeling}  `;

        if(feeling === 'bored'){
          speechOutput += 'How about a paint by numbers? Or you could listen to a podcast or go on a pic nic.';
        }
        else if(feeling === 'happy'  || feeling === 'joyful' || feeling === 'excited'){
          speechOutput += `Fantastic! Do you want to dance?`;
          repromptText = "You can ask me what to do by saying, I am bored";
          //shouldEndSession = true;
        }else if(feeling === 'sad' || feeling === 'upset' || feeling === 'depressed' || feeling === 'unhappy'){
           speechOutput += 'Tell me what happened.';
           repromptText = "You can ask me what to do by saying, I am bored";
           //shouldEndSession = true;
         }else if(feeling === 'anxious' || feeling === 'nervous' || feeling === 'antsy' || feeling === 'irritated'){
           speechOutput +=  'Why don’t you try sqeezing a fist for 5 seconds, then relaxing for 7?';
           repromptText = "You can ask me what to do by saying, I am bored";
           //shouldEndSession = true;
         }else if(feeling === 'angry' || feeling === 'mad' || feeling === 'furious' || feeling == 'fuming'){
           speechOutput += `Do you want to count down from 10?`;
           repromptText = "You can ask me what to do by saying, I am bored";
           //shouldEndSession = true;
         }else if(feeling === 'embarrassed' || feeling === 'ashamed'){
           speechOutput += `It's okay. Tell me what happened.`;
           repromptText = "You can ask me what to do by saying, I am bored";
           //shouldEndSession = true;
        }else{
          speechOutput = "Okay.";
          repromptText = "You can ask me what to do by saying, I am bored";
          //shouldEndSession = true;

        }





        // speechOutput = `I now know your feeling is ${feeling}. You can ask me ` +
        //     "your favorite color by saying, what's my favorite color?";
        // repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
    } else {
        speechOutput = "I'm not sure what your feeling. Please try again.";
        repromptText = "I'm not sure what your feeling. You can tell me you are " +
            'faeeling by saying, I feel bored.';
        //shouldEndSession = false;
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



/*Bored response*/
function boredResponseF (intent, session, callback, speechOutput) {
    let sessionAttributes = {};
    const cardTitle = intent.name;
    const boredResponseSlot = intent.slots.BoredResponse;
    let repromptText = '';
    if (boredResponse === 'yes') {
        const boredResponse = boredResponseSlot.value;
        sessionAttributes = createBoredResponseAttributes(boredResponse);
        //speechOutput = `One ${feeling}. `;
        speechOutput += ` Here are some fun activities: do a paint by numbers.`;
        repromptText = "You can tell me if you are still bored.";
        //finalResponse(intent, session, callback, speechOutput);
    }
    else{
      //finalResponse(intent, session, callback, speechOutput);
    }
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, true));

}



/*final response*/
function finalResponse (intent, session, callback, speechOutput) {
    let sessionAttributes = {};
    const cardTitle = intent.name;
    const boredResponseSlot = intent.slots.BoredResponse;
    let repromptText = '';
    if (boredResponseSlot === 'yes') {
        const boredResponse = boredResponseSlot.value;
        sessionAttributes = createBoredResponseAttributes(boredResponse);
        //speechOutput = `One ${feeling}. `;
        speechOutput += `Here are some fun facts: Camels have three eyelids.`;
        repromptText = "You can tell me if you are still bored.";
        //finalResponse(intent, session, callback, speechOutput);
    }
    else{

    }
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, true));

}



function getFeelingFromSession(intent, session, callback) {
    let feeling;
    const repromptText = '';
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes) {
        feeling = session.attributes.feeling;
    }

    if (feeling) {
        if (feeling === 'bored') {
            speechOutput = `You are feeling ${feeling}.`;
        }
        // speechOutput = `You are feeling ${feeling}.`;
        //shouldEndSession = true;
    } else {
        speechOutput = "How are you feeling today?"
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'MyFeelingIsIntent') {
        setFeelingInSession(intent, session, callback);
    } else if (intentName === 'WhatsMyFeelingIntent') {
        getFeelingFromSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
