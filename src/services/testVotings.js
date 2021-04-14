class User {

    constructor(category) {
        //sets a possible filter on a category for this user. User starts without category set and can only select one after at least one object is in his collection
        this.category = category;
  
        // manages the profile s cores of the user. Depending on actions like like, dislike or chat these counts are constantly modified.
        this.profile = {
            "easy" : 0,
            "kids" : 0,
            "fun" : 0,
            "prof" : 0
        }
  
      // sets the last known position of the user
      this.positionX = 0;
      this.positionY = 0;
      this.floor = 1;
    }
  
    //changing profile count +1 for liking an object with this profile
    like(object) {
        this.profile[object.profile] += 1;
  
    }
  
    //changing profile count -1 for disliking an object with this profile
    dislike(object) {
        this.profile[object.profile] -= 1;
    }
  
    //is triggered when user adds the user to the collection
    finish_dialogue(object) {
        //adding +3 to the profile for a finished dialogue
        this.profile[object.profile] += 3;
  
        //changing the users position to the last visited object
        this.positionX = object.positionX;
        this.positionY = object.positionY;
        this.floor = object.floor;
    }
  
    //changing profile count -3 for exiting an dialogue with an object with this profile
    exit_dialogue(object) {
        this.profile[object.profile] -= 3;
    }
  
    //changing profile count +3 if the user gets back to the chat of the object
    getback_dialogue(object) {
        this.profile[object.profile] += 3;
    }
  
  }
  
  
  
  class Object {
  
      constructor(name, category, profile, priority, positionX, positionY, floor) {
          this.name = name;
          this.category = category;
          this.profile = profile;
          this.priority = priority;
          this.positionX = positionX;
          this.positionY = positionY;
          this.floor = floor;
          this.currentScore = 0;
      }
  
      getScore(user) {
          let score = 0;
  
          // if users selected category is the category of the object, score gets +10
          if (user.category === this.category) {
            score += 10;
          } 
  
          //determine if objects profile is in position 1 or 2 of users profile, adding 5 or 3 to score
            let position = 1;
          for (const p in user.profile) {
              if (user.profile[p] > user.profile[this.profile]) position++;
          }
  
            if (position === 1) score += 5;
             if (position === 2) score += 3;
  
             // modifying score according to priority
            switch (this.priority) {
              case 0: score += 100; // for first predefined objects, pushes them to first position 
              break;
              case 1: score += 3;
              break;
              case 2: score += 2;
              break;
              case 3: score += 1;
              break;
            }
  
          //calculating distance in meter and modifying score accordingly
          const distance = getDistance(user, this);
          score += 10 - (distance / 10);
  
          this.currentScore = score;
          return score;
  
      }
  }
  
  function getDistance(user, object) {
      let distance = 0;
      const exit_positionX = 15;
      const exit_positionY = 15;
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
  
  function like() {
      currentUser.like(currentObject);
      rankedObjects.pop();
      if (rankedObjects.length === 0) {
          rankedObjects = allObjects.slice();
          rankedObjects.sort((a, b) => (a.score> b.score) ? 1 : -1);
      }
      currentObject = rankedObjects[rankedObjects.length - 1];
      document.getElementById("object").innerHTML = currentObject.name + " (" + currentObject.profile + ")";
      showResult();
  }
  
  function dislike() {
      currentUser.dislike(currentObject);
      rankedObjects.pop();
      if (rankedObjects.length === 0) {
          rankedObjects = allObjects.slice();
          rankedObjects.sort((a, b) => (a.score> b.score) ? 1 : -1);
      }
      currentObject = rankedObjects[rankedObjects.length - 1];
      document.getElementById("object").innerHTML = currentObject.name + " (" + currentObject.profile + ")";
      showResult();
  }
  
  function visit() {
      currentUser.finish_dialogue(currentObject);
      rankedObjects.pop();
      if (rankedObjects.length == 0) {
          rankedObjects = allObjects.slice();
          rankedObjects.sort((a, b) => (a.score> b.score) ? 1 : -1);
      }
      currentObject = rankedObjects[rankedObjects.length - 1];
      document.getElementById("object").innerHTML = currentObject.name + " (" + currentObject.profile + ")";
      showResult();
  }
  
  function showResult() {
      let result = "";
      for (var i = 0; i < rankedObjects.length; i++) {
          rankedObjects[i].getScore(currentUser);
      }
  
      rankedObjects.sort((a, b) => (a.currentScore> b.currentScore) ? 1 : -1);
      for (var i = rankedObjects.length - 2; i >= 0; i--) {
          result += i + ": <b>" + rankedObjects[i].name + "</b> score: " + rankedObjects[i].currentScore +  " (" + rankedObjects[i].profile + " " + getDistance(currentUser, rankedObjects[i]) + "m)<br>";
      }
      result+= "<p>";
      for (const p in currentUser.profile) {
          result += p + " " + currentUser.profile[p] + "<br>";
      }
      result += "User-Position X: " + currentUser.positionX + " Y: " + currentUser.positionY + " floor: " + currentUser.floor;
      document.getElementById("result").innerHTML = result;
  }
  
  let allObjects = [];
  allObjects.push(new Object ("Mona Lisa", "death", "easy", 0, 0, 0, 0));
  allObjects.push(new Object ("Das Abendmahl", "time", "kids", 0, 0, 0, 0));
  allObjects.push(new Object ("Sternennacht", "fashion", "fun", 0, 0, 0, 0));
  allObjects.push(new Object ("Guernica", "fashion", "prof", 0, 0, 0, 0));
  allObjects.push(new Object ("Das Mädchen mit dem Perlenohrgehänge", "time", "easy", 0, 0, 0, 0));
  allObjects.push(new Object ("Die Erschaffung Adams", "death", "kids", 0, 0, 0, 0));
  allObjects.push(new Object ("Die Geburt der Venus", "death", "fun", 0, 0, 0, 0));
  allObjects.push(new Object ("Die Beständigkeit der Erinnerung", "time", "prof", 0, 0, 0, 0));
  allObjects.push(new Object ("Die Nachtwache", "fashion", "easy", 1, 1, 1, 1));
  allObjects.push(new Object ("Der Kuss", "time", "prof", 2, 5, 5, 1));
  allObjects.push(new Object ("American Gothic", "fashion", "easy", 1, 1, 5, 1));
  allObjects.push(new Object ("Das letzte Abendmahl", "time", "prof", 2, 5, 1, 2));
  
  //copy array for sorting
  let rankedObjects = allObjects.slice();
  rankedObjects.sort((a, b) => (a.score> b.score) ? 1 : -1);
  
  let currentObject = rankedObjects[rankedObjects.length - 1];
  let currentUser = new User("");
  
  document.getElementById("object").innerHTML = currentObject.name;
  /*
  currentUser.like(allObjects[0]);    // Users profil: easy = 1, kids = 0,  fun = 0, prof = 0
  currentUser.dislike(allObjects[1]); // Users profil: easy = 1, kids = -1, fun = 0, prof = 0
  currentUser.like(allObjects[2]);    // Users profil: easy = 1, kids = -1, fun = 1, prof = 0
  currentUser.dislike(allObjects[3]); // Users profil: easy = 1, kids = -1, fun = 1, prof = -1
  currentUser.like(allObjects[4]);    // Users profil: easy = 2, kids = -1, fun = 1, prof = -1
  currentUser.dislike(allObjects[5]); // Users profil: easy = 2, kids = -2, fun = 1, prof = -1
  currentUser.dislike(allObjects[6]); // Users profil: easy = 2, kids = -2, fun = 0, prof = -1
  */
  currentUser.dislike(allObjects[8]); // Users profil: easy = 2, kids = -2, fun = 0, prof = -2
  
  //users profile after this: position1 = easy (+5), position2 = fun (+3)