import Realm from 'realm';

export default class User extends Realm.Object {}
User.schema = {
    name: "User",
    primaryKey: 'sync_id',
    properties:{
        sync_id: 'string',
        name: {type: 'string?', default: ''},
        avatar: 'string?', // (path)
        category: 'string?',
        positionX: {type: 'double?', default: 1}, //(11,8)
        positionY: {type: 'double?', default: 1}, //(11,8)
        floor: {type: 'int?', default: 1},
        language: 'string', // (de, eng)
        font_size: {type: 'string?', default: 'medium'},
        // language_style: 'string?', // (easy or fun or kids or professional)
        score: {type: 'int?', default: 0},
        level: {type: 'int', default: 1},
        levelup: {type: 'bool?', default: false},
        created_at: 'date',
        updated_at: 'date',

        language_style: {type: 'list', objectType: 'Language_style'}, // (easy or fun or kids or professional)
        chats: {type: 'list', objectType: 'Chats'},
        votings: {type: 'list', objectType: 'Votings'},
        collections: {type: 'list', objectType: 'Collections'},
    }
}


export class Chats extends Realm.Object {}
Chats.schema = {
    name: "Chats",
    primaryKey: 'sync_id',
    properties: {
        sync_id: 'string',
        object_id: 'string',
        last_step: 'int',
        finished: {type: 'bool?', default: false},
        history: 'string',
        planned: {type: 'bool?', default: false},
        created_at: 'date',
        updated_at: 'date'
    }
}

export class Votings extends Realm.Object {}
Votings.schema = {
    name: "Votings",
    primaryKey: 'object_id',
    properties: {
        sync_id: 'string',
        object_id: 'string',
        vote: 'bool', // (true: like, false: dislike)
        created_at: 'date',
        updated_at: 'date'
    }
}

export class Collections extends Realm.Object {}
Collections.schema = {
    name: "Collections",
    primaryKey: 'sync_id',
    properties: {   
        sync_id: 'string', 
        object_id: 'string',
        image: 'string', // (path)
        category_id: 'string',
        created_at: 'date',
        updated_at: 'date'
    }
}

export class Language_style extends Realm.Object {}
Language_style.schema = {
    name: "Language_style",
    primaryKey: 'sync_id',
    properties: {   
        sync_id: 'string', 
        score: 'int',
        style:'string'
        
    }
}
