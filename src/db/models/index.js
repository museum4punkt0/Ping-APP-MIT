import Realm from 'realm';
import User, {Chats, Votings, Collections, Language_style} from './user'
import Museums, {Objects, Categories, Images, Localizations, Tensor, Semantic_relations, Tours, Museums_list, Objects_to_suggest} from './museums'
import Settings, {Position_scores, Exit_position, Likes_scores, Chat_scores, Priority_scores, Distance_scores } from './settings'

const realm = new Realm({
    schema: [
        User.schema, Chats.schema, Votings.schema, Collections.schema, Language_style.schema,
        Museums.schema, Objects.schema, Categories.schema, Images.schema, Localizations.schema, Tensor.schema,Semantic_relations.schema, Tours.schema, Museums_list.schema, Objects_to_suggest.schema,
        Settings.schema, Position_scores.schema, Exit_position.schema, Likes_scores.schema, Chat_scores.schema, Priority_scores.schema, Distance_scores.schema
    ],
    schemaVersion:3
});

  
export default realm;
  