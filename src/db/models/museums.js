import Realm from 'realm';

export default class Museums extends Realm.Object {}
Museums.schema = {
  name: "Museums",
  primaryKey: 'sync_id',
  properties:{
    sync_id: 'string',
    localizations : 'Localizations[]',
    ratio_pixel_meter: {type: 'int?', default: 1},
    museum_site_url: {type: 'string?', default: ''},
    tensor: 'Tensor',
    images: {type: 'list', objectType: 'Images'},
    objects: {type: 'list', objectType: 'Objects'},
    categories: {type: 'list', objectType: 'Categories'},
    tours: {type: 'list', objectType: 'Tours'}
  }
}

export class Objects extends Realm.Object {}
Objects.schema = {
    name: "Objects",
    primaryKey: 'sync_id',
    properties: {
      sync_id: 'string',
      priority: 'int', // (0 or 1 or 2 or 3)
      floor: 'int', // (1 or 2 or 3)
      positionX: 'double', //(11,8)
      positionY: 'double', //(11,8)
      vip: 'bool',
      language_style: 'string', // (easy or kids or fun or professional)
      avatar: 'string?', // (path)
      cropped_avatar: 'string?',
      object_map: 'string?',
      level: {type: 'int?', default: 0},
      onboarding: 'bool',
      created_at: 'date',
      updated_at: 'date',

      localizations: 'Localizations[]',
      images: 'Images[]',
      semantic_relations:'Semantic_relations[]',
      objects_to_suggest: {type: 'list', objectType: 'Objects_to_suggest'}
    }
}

export class Categories extends Realm.Object {}
Categories.schema = {
    name: "Categories",
    primaryKey: 'sync_id',
    properties: {   
      sync_id: 'string',
      
      object_ids: 'int[]',
      sync_object_ids: 'string[]',

      localizations: 'Localizations[]',
      created_at: 'date',
      updated_at: 'date'
    }
}


export class Images extends Realm.Object {}
Images.schema = {
    name: "Images",
    primaryKey: 'sync_id',
    properties: {
      sync_id: 'string',
      image_type: 'string?', // (floor or general)
      image: 'string',
      number: {type: 'int?', default: 0},
      created_at: 'date',
      updated_at: 'date'
    }
}

export class Localizations extends Realm.Object {}
Localizations.schema = {
    name: "Localizations",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string',    
      language: 'string', // (de, eng)
      conversation: 'string?',
      description: 'string?',
      phrase: 'string?',
      title: {type: 'string?', default: ''},
      object_kind: 'string?', // (sculpture, painting, ethnological)
      created_at: 'date',
      updated_at: 'date'
    }
}
export class Tensor extends Realm.Object {}
Tensor.schema = {
    name: "Tensor",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string', 
      tensor_flow_lables : 'string', 
      tensor_flow_model : 'string', 
      museum_id: {type: 'string?', default: ''},
      created_at: 'date',
      updated_at: 'date'
    }
}

export class Semantic_relations extends Realm.Object {}
Semantic_relations.schema = {
    name: "Semantic_relations",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string', 
      object_item_id: 'string', 
      localizations : 'Localizations[]',
      created_at: 'date',
      updated_at: 'date'
    }
}

export class Tours extends Realm.Object {}
Tours.schema = {
    name: "Tours",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string', 
      tourobjects: 'string[]', 
      localizations : 'Localizations[]',
      created_at: 'date',
      updated_at: 'date'
    }
}

export class Museums_list extends Realm.Object {}
Museums_list.schema = {
    name: "Museums_list",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string', 
      // museumimages: 'Images[]', 
      localizations : 'Localizations[]',
      museum_site_url:{type: 'string?', default: ''},
      ratio_pixel_meter:{type: 'int?', default: 1},
      located:{type: 'bool?', default: false},
      tours:'Tours[]',
      created_at: 'date',
      updated_at: 'date'
    }
}

export class Objects_to_suggest extends Realm.Object {}
Objects_to_suggest.schema = {
    name: "Objects_to_suggest",
    primaryKey: 'sync_id',
    properties: {  
      sync_id: 'string', 
      position: {type: 'int?', default: 1},
    }
}