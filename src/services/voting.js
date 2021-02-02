
export const getDistance = (user, object, position = {positionX:15,positionY:15}) => {
    let distance = 0;
    const exit_positionX = position.positionX;
    const exit_positionY = position.positionY;

    if (object.floor === user.floor) {
        distance = Math.sqrt(
            Math.pow( Math.abs(user.positionX - object.positionX), 2)
            +
            Math.pow(Math.abs(user.positionY - object.positionY), 2)
        )
    } else {
        distance = Math.sqrt(Math.pow(Math.abs(user.positionX - exit_positionX), 2)
            +
            Math.pow(Math.abs(user.positionY - exit_positionY), 2)
        );

        distance +=	Math.sqrt(Math.pow(Math.abs(object.positionX - exit_positionX), 2)
            +
            Math.pow(Math.abs(object.positionY - exit_positionY), 2)
        );

    }
    return Math.round(distance);
}

export const getScore = (user, object, categories, settings) => {
    let score = 0;

    // if users selected category is the category of the object, score gets +10
    const objectCategory = categories.find(item => item.sync_object_ids.find(sync_id => sync_id === object.sync_id));
    if ( objectCategory && objectCategory.sync_id === user.category) { score += settings.category_score; }

    //determine if objects profile is in position 1 or 2 of users profile, adding 5 or 3 to score
    const language_styles = Array.from(user.language_style || []);
    const objectLanguageStyleScore = language_styles.find(language_style => language_style.style === object.language_style);
    let position = 1;
    if(objectLanguageStyleScore) for (const p in language_styles) { if (language_styles[p].score > objectLanguageStyleScore.score) position++; }
    settings.position_scores.forEach(positionScore => {
        if(positionScore.position === position) score += positionScore.score;
        if(positionScore.position === position) score += positionScore.score;
    });

      // modifying score according to priority
      settings.priority_scores.forEach(priority => {
          if(object.priority === priority.priority) score += priority.score;
      });

    //calculating distance in meter and modifying score accordingly
    const distance = getDistance(user, object, settings.exit_position);

    // if(user.positionX && user.positionY) score += Math.abs(10 - (distance / 10));
    const distance_scores = settings.distance_scores;
    if(distance_scores.basic_point  - (distance / distance_scores.divider) > 0) score += Math.abs(distance_scores.basic_point - (distance / distance_scores.divider));

    object.currentScore = score;
    return score;
}