//FROM: https://github.com/scottbw/dialoguejs
const Dialogue = exports;

Dialogue.dialogue_states = {};

Dialogue.dialogues = {};
    

Dialogue.__getState = (actor, player)=>{    
    if (!Dialogue.dialogue_states[actor]) Dialogue.dialogue_states[actor] = {};    
    let player_state = Dialogue.dialogue_states[actor][player];
    if (!player_state) player_state = 1;
    return player_state;
}

Dialogue.__setState = (actor, player, state)=>{
    Dialogue.dialogue_states[actor][player] = state;
}

Dialogue.__getDialogue = (actor, id)=>{
    if (!Dialogue.dialogues[actor]) Dialogue.dialogues[actor] = {};
    return Dialogue.dialogues[actor][id]; 
}


Dialogue.__setDialogue = (actor, dialogue)=>{
    if (!Dialogue.dialogues[actor]) Dialogue.dialogues[actor] = {};
    Dialogue.dialogues[actor][dialogue.id] = dialogue;
}

// Dialogue.interact = (actor,player,response)=>{
Dialogue.interact = (actor,player,response, isNext)=>{
    
    let state = Dialogue.__getState(actor, player);
    let dialogue;

    if (response){  
        const response_dialogue = Dialogue.__getDialogue(actor,response);
        if (response_dialogue){
            if (parseInt(response)){
                // state = response_dialogue.next;
                state = isNext ? response_dialogue.next : response_dialogue.id;
                Dialogue.__setState(actor, player, state);
                dialogue = Dialogue.__getDialogue(actor,state);
            } else {
                dialogue = response_dialogue;
            }
        } 
            
    } else {
        dialogue = Dialogue.__getDialogue(actor,state);
    }
    
    
    if (!dialogue) return null;

    const responses = new Array();
    if (dialogue.responses){
        for (const r in dialogue.responses){
            const response = Dialogue.__getDialogue(actor,dialogue.responses[r]);
            // responses.push({id:response.id, text:response.text});
            responses.push({id:response.id, text:response.text, next:response.next});
        }
    }
    
    const dialogue_processed = {};
    dialogue_processed.text = dialogue.text;
    dialogue_processed.responses = responses;
    
    if (dialogue.next){
        Dialogue.__setState(actor, player, dialogue.next);
    }
    
    return dialogue_processed;
}


Dialogue.parse = (actor, text)=>{
   const lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);

   Dialogue.dialogue_states = {};
   Dialogue.dialogues = {};
   for (const line in lines){
        let dialogue_line =  lines[line];
        const dialogue = {};

        
        dialogue.id = parseInt(dialogue_line);
        
        if (isNaN(dialogue.id)){
            dialogue.id = dialogue_line.substr(0, dialogue_line.indexOf(":"));
            dialogue_line = dialogue_line.substr(dialogue.id.toString().length+1);
        } else {
            dialogue_line = dialogue_line.substr(dialogue.id.toString().length);
        }
        

        if (dialogue_line.indexOf("->") !== -1){
            const str = dialogue_line.split("->");
            dialogue_line = str[0];
            dialogue.next= parseInt(str[1]);
        }
        if (dialogue_line.indexOf("[") !== -1){
            const choices = dialogue_line.substr(dialogue_line.indexOf("["));
            dialogue.responses = JSON.parse(choices);
            dialogue_line = dialogue_line.split("[")[0];
        }
        
        dialogue.text = dialogue_line.trim();
        Dialogue.__setDialogue(actor, dialogue);
    } 
}


