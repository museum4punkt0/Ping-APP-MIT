import Realm from 'realm';
import User, {Chats, Votings, Collections, Language_style} from './user'
import Museums, {Objects, Categories, Images, Localizations, Tensor, Semantic_relations, Tours, Museums_list, Objects_to_suggest} from './museums'
import Settings, {Position_scores, Exit_position, Likes_scores, Chat_scores, Priority_scores, Distance_scores } from './settings'

const realm = new Realm({
    schema: [
        User, Chats, Votings, Collections, Language_style,
        Museums, Objects, Categories, Images, Localizations, Tensor,Semantic_relations, Tours, Museums_list, Objects_to_suggest,
        Settings, Position_scores, Exit_position, Likes_scores, Chat_scores, Priority_scores, Distance_scores
    ],
    schemaVersion:3
});
  
export default realm;
  