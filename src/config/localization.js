import LocalizedStrings from 'react-native-localization';

const strings = new LocalizedStrings({
  en: {
    //Bottom navigation
    objects: 'Objects',
    chat: 'Chat',
    discover: 'Discover',
    myPlan: 'My plan',
    collection: 'Collection',
    info: 'Info',
    objectPhoto: 'Object Photo',
    plannedTour:'Planned Tour',

    //Loader
    wentWrong: 'Something went wrong',
    updatingError: 'Updating error',
    appStart: 'Start application',
    museumIsCurrently:'Museum is currently unavailable',

    //Account info
    nameLabel: 'NAME',
    languageLabel: 'LANGUAGE',
    fontSizeLabel: 'FONT SIZE',
    chatIntervalLabel: 'CHAT INTERVAL',
    accountInfo: 'Account Settings',
    humboldtForm:'Humboldt Forum',
    humboldtDescription:'With the Humboldt Forum, a whole new cultural district is being created in the very heart of the city. It represents an approach that brings together diverse cultures and perspectives and seeks new insights into topical issues such as migration, religion and globalization.',
    openGuide:'Show introduction',   
    resetDevice:'Reset MeinObjekt-App',
    typeYourName: 'Type your name…',
    termsAnd:'Terms and conditions',
    chooseYourLanguage:'CHOOSE YOUR LANGUAGE',
    levelInformation: 'If you have collected at least 3 objects of one category, you will level up. Then new high-level objects become available!',

    //Tinder
    like:'Like',
    dislike:'Dislike',
    away:'Away',
    noObjectsLeft: 'No objects left!',

    //Match screen
    startConversation:'Start Conversation',
    youAnd:'You and',
    haveLiked:'have liked each other. You can now talk to it.',
    noThanks:'No, Thanks!',
    whatDoes:'What does this mean?',
    weThing:'We think this object matches your interests! Here objects are alive - and want to chat with you. Start the dialogue now and get to know the secret sides of this object.',
    gotIt:'Got It',
    perfectMatch:'Perfect Match!',

    //Chat screen
    noActine:'No active chats',
    likeObjects:'Like objects to match and chat with them.',
    addThis:'Add this photo to collection',
    takeAnother:'Take another photo',
    useDefault:'Use default photo',
    useThisPhoto:'Use this photo',
    send:'Send',
    takePhoto:'Take a photo!',
    wasNotRecognized:'The object in the photo you just made was not recognized. Did you take a photo of ',
    made:'',
    NotRecognized: 'Image not recognized',
    cannotTalk:'This object cannot talk yet - but we have noted your interest and will try to integrate it soon!',
    back:'Back',
    youCanPinch: 'You can enlarge and zoom in on images inserted in chats by pressing them and enlarging them with two fingers',

    //Discover
    iFound:'I found you!',
    startChat:'Do you want to start a chat?',
    zoomIn: 'Zoom in with two finger gesture',
    youCanSwipe: 'You can click on arrows at the top to switch to a different museum location map. Or you can just simply swipe them!',
    youCanZoom: 'You can also click on the map and zoom into it for more details!',

    //Collection
    completed:'Completed',
    congratulations:'Congratulations!',
    youHaveCompleted:'You have collected three objects in the {0} category and have reached level {1}. Level  objects are now available.',
    close:'Close',
    startCollection: 'Congratulations! You have started your own collection!',
    filterFor:'Filter by category',
    set:'set',
    youWill:'You will find the suggested objects on top of the stack now',
    toObject:'To Object Selection',
    newCategoryUnlocked: 'A new Category has been unlocked in your collection. Check it out!',

    // Choose Avatar Dialog
    chooseAvatar:'Choose Avatar',
    apply:'Apply',
    cancel:'Cancel',

    //Museums
    noMuseums: 'No Museums Found',
    detecting:'Detecting your location…',
    weCouldntDetect:'We couldn’t detect your location.',
    areYouInside:'Are you inside a museum?',
    selectMuseum:'Already in the museum? Then click here',
    areYouOutside:'Are you outside a Museum?',
    planTour:'Plan my own Tour',
    planMode:'Plan Mode',
    weDetectedThatYou:'We detected that you are here: ',
    startTour:'Start my own Tour',
    areWeWrong:'Wrong museum? Then click here',
    chooseAnotherMuseum:'Choose Another Museum',
    weDetectedThatYouOutside:'We detected that you are outside the museum. Start planning your next visit now!',
    startDiscover:'Start\n Discovery',
    startPlannedTour:'Start your\n Planned Tour',
    museumTours:'Or start a created tour of the museum',
    noPlannedTour:'You have no Planned Tours',
    likeObjectsInPlanned:'Like objects in "Plan Mode" to match and chat with them.',
    dataIsBeingProcessed: "Please wait, the museum's data is being processed",
    downloading: 'Downloading...',
    synchronising: 'Synchronising...',
    

    //Permission to use camera
    permissionDialogTitle:'Permission to use camera',
    permissionDialogMessage:'We need your permission to use your phone camera',


    //onboarding
    title_1:'Discover the individual stories of objects',
    description_1:'MeinObjekt allows you to connect to interesting objects in the museum in a playful way. You can chat with them, find them in the exhibition and add them to your personal collection.',
    title_2:'Swipe left or right to find your matching objects',
    description_2:'All objects of the museum have a unique character. Some might match with you, some not. They will introduce themselves with a picture and a phrase. Swipe them left or right to like or dislike them.',
    title_3:'Find the objects in the museum',    
    description_3:'In MeinObjekt, objects are alive. After matching with an object, you can start a chat conversation with it. They will tell you untold stories and eventually invite to meet them for real in the museum space. ',
    title_4:'Individual tour through the museum',
    description_4:'Make your path through the museum as individual as yourself. With MeinObjekt you will find your very own tour through the museum with objects that really fascinate you.',
    title_5:'Plan tour',
    description_5:'When you are outside of museums - you can only enter Plan mode. In this mode you can only see what objects are in the museum and talk to them. But you cannot look for them in the museum or add them to your collection',
    title_6:' In the Museum',
    description_6:'When you are inside of one of the museums - the app will detect it and you will enter a Discovery Mode. In this mode you can talk to objects, find them in the museum and add them to your collection.',
    title_7:'User Profile',
    description_7:'In "Info" you can easily change your user name, your avatar as well as the configuration of language, font size and chat speed. There you can also end current tours / journeys of discovery and start new ones.',
    next:'Next',
    skip:'Close',
    swipeRightIf:'Swipe the object-cards left or right to like or dislike them',
    orUseButtons:'Or use the buttons instead of gestures to like or skip an object',    
    greatYouLiked:"Great! You liked this object! Unfortunately this object does not match with your profile. That is fine, don't worry! Keep trying, the next one might match",
    youDidNotLike:'You did not like this object. Thats good! Your choices matter! This way you will meet the most interesting objects for you',
    youJustMet:'You just met the first VIP object. VIP objects are highlights of the museum. Often their dialogues are written by especially interesting people',
    awesomeThisObject:'Awesome! This object matched with you and is interested in you! This means, you can start a chat with it to learn more!',
    youAreInvited:'You are invited to search for the object now! Find it in the marked area on the map and click "I found you" when you are standing in front of it',
    tappingOnTheObject:'Tapping on the object gives you more information about it',
    allObjectsBelong:'All objects belong to a category. You can complete a category by collecting three objects in it. Then you level up! You can still collect objects from other categories, too.',
    youHaveTwoObjects:'If you complete a category with three objects, you will go up a level. Then new level 2 objects will become available!',
    greatYouSelected:'Great, you selected a category filter. You can change it at all times',
    youCanSetFilter: 'You can set a filter for the category and complete it. If you set the filter, the next objects in this category will be displayed next in the deck of cards.',

    // Plan
    startYouOwnTour: 'Congratulations! You have started your own planned tour! This way you can prepare your next museum visit!',
    quitPlan: 'Quit Plan Mode',
    quitTour: 'Quit Tour',
    quitDiscovery: 'Quit Discovery',
    quitPlannedTour: 'Quit Planned Tour',
    quit: 'Quit',
    completePlan: 'Complete Plan',
    addMoreObjects: 'Add More Objects',

    // Options
    fontSizesNormal: 'Normal',
    fontSizesBig: 'Big',
    fontSizesLarge: 'Large',
    chatInervalsAuto: 'Auto',
    chatInervalsSlow: 'Slow',
    chatInervalsNormal: 'Normal',
    chatInervalsFast: 'Fast',
    chatInervalsVeryFast: 'Very fast',

    // Profile
    website: 'Website',
    quitDiscoveryExplanation: 'You can exit current mode and go back to choosing another mode or another museum',
    openVisitorsGuideExplanation: 'Look through app guide slides which explain core concepts of this app',
    resetAppExplanation: 'You can delete your profile and create a new one. And start collecting objects from scratch.',
    grantGalleryAccess: 'Please grant this app an access to the gallery in the settings of your device'
    
  },
  de: {
    //Bottom navigation
    objects: 'Objekte',
    chat: 'Chat',
    discover: 'Entdecken',
    myPlan: 'Mein Plan',
    collection: 'Sammlung',
    info: 'Info',
    objectPhoto: 'Objekt Foto',
    plannedTour:'Geplante Tour',

    //Loader
    wentWrong: 'Etwas ist schief gelaufen',
    updatingError: 'Aktualisierungsfehler',
    appStart: 'Anwendung starten',
    museumIsCurrently:'Dieses Museum ist derzeit nicht verfügbar',
    
    //Account info
    nameLabel: 'NAME',
    languageLabel: 'SPRACHE',
    fontSizeLabel: 'SCHRIFTGRÖSSE',
    chatIntervalLabel: 'CHAT INTERVALL',
    accountInfo: 'Kontoeinstellungen',
    humboldtForm:'Humboldt Forum',
    humboldtDescription:'Mit dem Humboldt Forum entsteht im Herzen der Stadt ein ganz neuer Kulturbezirk. Es stellt einen Ansatz dar, der verschiedene Kulturen und Perspektiven zusammenbringt und neue Einsichten in aktuelle Themen wie Migration, Religion und Globalisierung sucht.',
    openGuide:'Einführung anzeigen',
    resetDevice:'MeinObjekt-App zurücksetzen',
    typeYourName: 'Gib deinen Namen ein…',
    termsAnd:'Nutzungsbedingungen',
    chooseYourLanguage:'Wähle deine Sprache',
    levelInformation: 'Wenn du mindestens 3 Objekte einer Kategorie in deiner Sammlung hast, steigst du ein Level auf. Dann werden neue High-Level-Objekte verfügbar!',

    //Tinder
    like:'Spannend',
    dislike:'Langweilig',
    away:'Weg',
    noObjectsLeft: 'Keine Objekte mehr!',

    //Match screen
    startConversation:'Starte die Unterhaltung',
    youAnd:'Du und',
    haveLiked:'finden einander interessant! Ihr könnt jetzt miteinander chatten.',
    noThanks:'Nein Danke!',
    whatDoes:'Was bedeutet das?',
    weThing:'Wir denken, dass dieses Objekt deinen Interessen entspricht! Hier werden Objekte lebendig - und wollen mit dir chatten. Starte jetzt den Dialog und lerne die geheimen Seiten dieses Objekts kennen.',
    gotIt:'Verstanden',
    perfectMatch:'Perfect Match!',

    //Chat screen
    noActine:'Keine aktiven Chats',
    likeObjects:'Like Objekte, um euch zu matchen und mit ihnen chatten.',
    addThis:'Füge dieses Foto der Sammlung hinzu',
    takeAnother:'Mache ein anderes Foto',
    useDefault:'Standardfoto verwenden',
    useThisPhoto:'Dieses Foto verwenden',
    send:'Senden',
    takePhoto:'Mach ein Foto!',
    wasNotRecognized:'Das Objekt auf dem Foto, das du gerade gemacht hast, wurde nicht erkannt. Hast du ein Foto von ',
    made:'gemacht?',
    NotRecognized: 'Bild nicht erkannt',
    cannotTalk:'Dieses Objekt kann noch nicht sprechen - aber wir haben dein Interesse bemerkt und werden versuchen, es bald zu integrieren!',
    back:'Zurück',
    youCanPinch: 'Du kannst Bilder, die in Chats eingefügt sind, vergrößern und zoomen, indem du auf sie drückst und sie mit zwei Fingern vergrößerst',

    //Discover
    iFound:'Ich hab dich gefunden!',
    startChat:'Möchtest du mit dem Chat beginnen?',
    zoomIn: 'Karte mit Zwei-Finger-Geste vergrößern',
    youCanSwipe: 'Du kannst oben auf die Pfeile klicken, um zu einer anderen Standortkarte des Museums zu wechseln. Oder du kannst sie einfach weiter wischen.',
    youCanZoom: 'Du kannst auch auf die Karte klicken und sie vergrößern, um weitere Informationen zu erhalten!',

    //Collection
    completed:'Abgeschlossen',
    congratulations:'Gratulation!',
    youHaveCompleted:'Du hast drei Objekte der Kategorie {0} gesammelt und Level {1} erreicht. Ab jetzt sind Level {1} Objekte verfügbar.',
    close:'Schließen',
    startCollection: 'Glückwunsch! Du hast deine eigene Objekt-Sammlung begonnen!',
    filterFor:'Filter für Kategorie',
    set:'gesetzt',
    youWill:'Die vorgeschlagenen Objekte findest du ganz oben in der Objektauswahl',
    toObject:'Zu den Objekten',
    newCategoryUnlocked: 'Eine neue Kategorie wurde in deiner Sammlung freigeschaltet!',

    // Choose Avatar Dialog
    chooseAvatar:'Wähle einen Avatar',
    apply:'Übernehmen',
    cancel:'Abbrechen',

    //Museums
    noMuseums: 'Keine Museen gefunden. Bitte Internetverbindung prüfen...',
    detecting:'Wir suchen deinen Standort...',
    weCouldntDetect:'Wir konnten deinen Standort nicht erkennen.',
    areYouInside:'Bist du in einem Museum?',
    selectMuseum:'Doch schon im Museum? Dann hier klicken',
    areYouOutside:'Bist du außerhalb eines Museums?',
    planTour:'Meine eigene Tour planen',
    planMode:'Planmodus',
    weDetectedThatYou:'Wir haben festgestellt, dass du dich in folgendem Museum befindest:',
    startTour:'Meine eigene Tour starten',
    areWeWrong:'Falsches Museum? Dann hier klicken',
    chooseAnotherMuseum:'Wähle ein anderes Museum',
    weDetectedThatYouOutside:'Wir haben festgestellt, dass du dich nicht in einem Museum befindest. Plane jetzt deinen nächsten Besuch!',
    startDiscover:'Starte deine \nEntdeckungsreise',
    startPlannedTour:'Starte deine \ngeplante Tour',
    museumTours:'Oder beginne eine erstellte Tour vom Museum',
    noPlannedTour:'Keine geplanten Touren',
    likeObjectsInPlanned:'Like Objekte im Plan-Modus, um mit ihnen zu chatten.',
    dataIsBeingProcessed: "Bitte warten Sie, die Daten des Museums werden verarbeitet",
    downloading: 'Wird heruntergeladen...',
    synchronising: 'Synchronisieren...',

    //Permission to use camera
    permissionDialogTitle:'Erlaubnis zur Verwendung der Kamera',
    permissionDialogMessage:'Wir benötigen deine Erlaubnis, um die Handykamera zu benutzen',

    //onboarding
    title_1:'Entdecke die Geschichten von Objekten',
    description_1:'Mit MeinObjekt knüpfst du spielerisch Verbindungen zu interessanten Objekten im Museum. Du kannst mit ihnen chatten, sie in der Ausstellung aufsuchen und sie deiner persönlichen Sammlung hinzufügen.',
    title_2:'Wische nach links oder rechts, um spannende Objekte zu finden',
    description_2: 'Alle Objekte im Museum haben einen einzigartigen Charakter. Einige passen vielleicht zu dir, andere nicht. Sie stellen sich dir mit einem Bild und einem Spruch vor. Wische  mit dem Finger nach links oder rechts, um sie zu liken oder zu verwerfen.',
    title_3:'Finde die Objekte im Museum',
    description_3:'In MeinObjekt werden Objekte lebendig. Nach dem Matchen mit einem Objekt kannst du eine Chat-Unterhaltung mit ihm beginnen. Sie erzählen dir unglaubliche Geschichten und laden dich schließlich ein, sie im Museum kennenzulernen.',
    title_4:'Individuelle Führung durch das Museum',
    description_4:'Erstelle deine persönliche Museumstour, die so individuell wie du selbst ist. Mit MeinObjekt hast du die Möglichkeit, eine persönliche Tour durchs Museum zu erstellen, mit Objekten die dich wirklich faszinieren.',
    title_5:'Tour planen',
    description_5:'Wenn Sie sich außerhalb von Museen befinden, können Sie nur in den Plan-Modus wechseln. In diesem Modus können Sie nur sehen, welche Objekte sich im Museum befinden, und mit ihnen sprechen. Sie können sie jedoch nicht im Museum suchen oder Ihrer Sammlung hinzufügen.',
    title_6:'Im Museum',
    description_6:'Wenn Sie sich in einem der Museen befinden, erkennt die App dies und Sie gelangen in einen Erkennungsmodus. In diesem Modus können Sie mit Objekten sprechen, sie im Museum finden und Ihrer Sammlung hinzufügen.',
    title_7:'Benutzerprofil',
    description_7:'Unter "Info" kannst du ganz einfach deinen Benutzernamen, deinen Avatar sowie Konfigurationen zu Sprache, Schriftgröße und Chat-Geschwindigkeit ändern. Dort kannst du auch aktuelle Touren/ Entdeckungsreisen beenden und neue beginnen.',
    next:'Weiter',
    skip:'Schließen',
    swipeRightIf:'Wische nach rechts, wenn du ein Objekt liken willst, oder wische nach links, um es zu verwerfen',
    orUseButtons:'Oder verwende die Buttons anstelle von Gesten, um ein Objekt zu liken oder es zu verwerfen',  
    greatYouLiked:"Toll! Du mochtest dieses Objekt! Leider passt dieses Objekt nicht zu deinem Profil. Das ist in Ordnung! Versuch es weiter, das nächste könnte passen",
    youDidNotLike:'Du mochtest dieses Objekt nicht. Das ist völlig ok! Deine Entscheidungen sind wichtig! Auf diese Weise triffst du die wirklich spannenden Objekte',
    youJustMet:'Du hast gerade das erste VIP-Objekt getroffen. VIP-Objekte sind Highlights des Museums. Oft werden ihre Dialoge von besonders interessanten Personen geschrieben',
    awesomeThisObject:'Genial! Dieses Objekt passtzu dir und interessiert sich auch für dich! Das heißt, du kannst einen Chat mit ihm beginnen, um mehr zu erfahren!',
    youAreInvited:'Du bist eingeladen, jetzt nach dem Objekt zu suchen! Finde es im markierten Bereich auf der Karte und klicke auf "Ich habe dich gefunden", wenn du davor stehst',
    tappingOnTheObject:'Wenn du auf das Objekt tippst, erhältst du weitere Informationen',
    allObjectsBelong:'Alle Objekte gehören zu einer Kategorie. Du kannst eine Kategorie vervollständigen, indem du drei Objekte darin sammelst.All objects belong to one category. You can complete a category by collecting three objects in it.',
    youHaveTwoObjects:'Wenn du eine Kategorie mit drei Objekten abschließt, steigst du ein Level auf. Dann werden neue Level-2-Objekte verfügbar!',
    greatYouSelected:'Gut, du hast einen Kategoriefilter ausgewählt. Du kannst das jederzeit wieder ändern',
    youCanSetFilter: 'Du kannst einen Filter für die Kategorie setzen und sie so vervollständigen. Wenn du den Filter setzt, werden dir die nächsten Objekte dieser Kategorie als nächstes im Stapel angezeigt.',


    // Plan
    startYouOwnTour: 'Herzlichen Glückwunsch! Du hast deine eigene geplante Tour gestartet!',
    quitPlan: 'Planmodus Beenden',
    quitTour: 'Tour Beenden',
    quitDiscovery: 'Discovery Beenden',
    quitPlannedTour: 'Geplante Tour Beenden',
    quit: 'Verlassen',
    completePlan: 'Plan Abschließen',
    addMoreObjects: 'Weitere Objekte Hinzufügen',
    
    // Options
    fontSizesNormal: 'Normal',
    fontSizesBig: 'Groß',
    fontSizesLarge: 'Extra groß',
    chatInervalsAuto: 'Auto',
    chatInervalsSlow: 'Schleppend',
    chatInervalsNormal: 'Normal',
    chatInervalsFast: 'Schnell',
    chatInervalsVeryFast: 'Extra schnell',

    // Profile
    website: 'Webseite',
    quitDiscoveryExplanation: 'Sie können den aktuellen Modus verlassen und wieder einen anderen Modus oder ein anderes Museum auswählen',
    openVisitorsGuideExplanation: 'Schauen Sie sich die Folien der App-Anleitung an, in denen die Kernkonzepte dieser App erläutert werden',
    resetAppExplanation: 'Sie können Ihr Profil löschen und ein neues erstellen. Und fangen Sie an, Objekte von Grund auf neu zu sammeln.',
    grantGalleryAccess: 'Bitte gewähren Sie dieser App in den Einstellungen Ihres Geräts einen Zugriff auf die Galerie',
  }
});

export default strings;