import Realm from 'realm';

export default class Settings extends Realm.Object {}
Settings.schema = {
  name: "Settings",
  primaryKey: 'sync_id',
  properties:{
    sync_id: 'string',
    position_scores: 'Position_scores[]',
    category_score: 'int',
    exit_position: 'Exit_position',
    likes_scores: 'Likes_scores',
    chat_scores: 'Chat_scores',
    predifined_objects: 'string[]',
    priority_scores: 'Priority_scores[]',
    distance_scores: 'Distance_scores',
    // predefined_categories: {type: 'string[]', default: [], optional: true},
    redirection_timout: {type: 'int?', default: 0},
    predefined_avatars:'string[]',
    languages: 'string[]',
    language_styles: 'string[]',
    created_at: 'date',
    updated_at: 'date'
  }
}

export class Position_scores extends Realm.Object {}
Position_scores.schema = {  
    name: "Position_scores",
    properties:{
        position:'int',
        score:'int'
    }
}

export class Exit_position extends Realm.Object {}
Exit_position.schema = {  
    name: "Exit_position",
    properties:{
        positionX:'int',
        positionY:'int'
    }
}

export class Likes_scores extends Realm.Object {}
Likes_scores.schema = {  
    name: "Likes_scores",
    properties:{
        like:'int',
        dislike:'int'
    }
}

export class Chat_scores extends Realm.Object {}
Chat_scores.schema = {  
    name: "Chat_scores",
    properties:{
        finished:'int',
        exited:'int'
    }
}

export class Priority_scores extends Realm.Object {}
Priority_scores.schema = {  
    name: "Priority_scores",
    properties:{
        priority:'int',
        score:'int'
    }
}

export class Distance_scores extends Realm.Object {}
Distance_scores.schema = {  
    name: "Distance_scores",
    properties:{
        basic_point:'int',
        divider:'int'
    }
}