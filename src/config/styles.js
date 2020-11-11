import { Platform, StyleSheet } from "react-native";

export const IOSpadding = (Platform.OS === 'ios') ? 23 : 0;
export const Shadow = Platform.select({
  ios: {   
  shadowOpacity: 0.3,
  shadowRadius: 5,
  shadowOffset: {
      height: 0,
      width: 0
  }},  android: {elevation: 5}});

export const colors = {   
  black:'rgb(11,9,8)',
  dark:'rgb(20,18,17)',
  gray:'rgb(117,117,117)',
  brownGrey:'rgb(128,128,128)',
  darkGrey:'rgb(92,94,96)',
  white:'rgb(255,255,255)',
  red:'rgb(167,41,42)',
  green:'rgb(42,158,99)',
  greenWithOpacity: 'rgba(42,158,99, 0.3)',
  blue:'rgb(42,96,158)',
  yellow:'#F4BA39'
};

export const common = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor:colors.black
  },
  noObjectsMessage: {
    fontWeight:'bold',
    fontSize:20,
    color:colors.white,
    alignSelf: 'center',
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer:{
    height: 45 + IOSpadding,
    paddingTop: IOSpadding,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal:15,
    backgroundColor: colors.dark
  },
  headerName:{
    fontSize: 26, 
    color: colors.white,
    fontWeight:'bold', 
    flex:0.95,
    paddingVertical: 10,
  },
  headerTitle:{
    fontSize: 16, 
    fontWeight:'bold', 
    color: colors.white
  },
  headerDescription:{
    fontSize: 14, 
    color: colors.gray
  },
  headerIconContainer: {
    position: 'absolute',
    paddingTop: IOSpadding,
    paddingHorizontal: 10,
    zIndex: 1
  },
  headerButtonContainer:{
    position:'absolute',
    alignSelf:'center',
    backgroundColor:colors.green,
    paddingHorizontal:5,
    borderRadius:5, 
    bottom:-12,
    zIndex:99
  },
  toastsContainer: {
    zIndex: 1, position: 'absolute',
    top: 45 + IOSpadding, left: 0, right: 0,
    elevation: 5
  },
  toastView: {
    elevation: 4,
    backgroundColor: colors.darkGrey,
    padding: 10, zIndex: 1,
    marginHorizontal: 15,
    marginVertical: 2,
    borderRadius: 10
  },
  navigationContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical:5,
    backgroundColor:colors.dark
  },
  navigatorItem:{
    alignItems:'center',
    justifyContent:'center',
    width:100
  },
  navigatorItemIcon:{
    fontFamily:'meinobjekt',
    fontSize:24,
    color:colors.white
  },
  buttonContainer:{
    backgroundColor:colors.green,
    // alignItems:'center',
    justifyContent:'center',
    minHeight:50,
    borderRadius:10,
    marginVertical:8,
    padding:5
  },
  noMoreContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  noMoreIcon:{
    fontFamily:'meinobjekt',
    fontSize:68,
    color:colors.brownGrey
  },
  noMoreTitle:{
    fontSize:16,
    textAlign: 'center',
    width:'80%',
    color:colors.white,
    marginVertical:8
  },
  noMoreDescription:{
    fontSize:10,
    textAlign: 'center',
    color:colors.brownGrey,
    width:'80%'
    // textTransform: 'uppercase'
  },
  pacificoTitle:{
    alignSelf:'center',
    fontFamily: 'Pacifico-Regular',
    color:colors.white,
    fontSize:40 
  },
  preloaderMessageContainer:{
    position:'absolute',
    alignSelf:'center',
    bottom:40,
    alignItems:'center',
    justifyContent:'center'
  },
  preloaderMessageTitle:{
    fontSize:10,
    color:colors.darkGrey
  },
  preloaderMessageDescription:{
    fontWeight:'bold',
    fontSize:16,
    color:colors.white,
    alignSelf: 'center'
  }
})

export const main = StyleSheet.create({
    matchImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth:2,
      borderColor:colors.white
    },    
    matchTitle: {
      fontSize: 16,
      textAlign: 'center',
      color:colors.white,
      marginBottom:15
    }, 
    matchDescription: {
      fontSize: 12,
      textAlign: 'center',
      color:colors.brownGrey,
      marginTop:15
    },
    actionBtn: {
      width: 60,
      height: 60,
      backgroundColor: '#eee',
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 30,
      marginHorizontal: 25
    },
    dialogRootContainer:{
      flex:1,
      justifyContent:'center',
      backgroundColor:'rgba(0,0,0,0.5)'
    },
    dialogRootContainerButton:{
      position:'absolute',
      top:0,
      bottom:0,
      left:0,
      right:0
    },
    dialogContentContainer:{
      marginHorizontal: 15,
      backgroundColor: colors.dark,
      borderRadius:10,
      padding:15
    },
    dialogContentText:{
      fontSize: 16,
      color:colors.white,
      textAlign:'center',
      marginVertical:10
    },
    collectionTitleContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      margin:15
    },
    collectionContainer:{
      flexDirection:'row',
      marginBottom:15
    },
    collectionImage:{
      width: 90,
      height: 90,
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: colors.dark,
      resizeMode: 'cover'
    },
    collectionCompletedContainer:{
      backgroundColor:colors.green,
      paddingVertical:6,
      paddingHorizontal:8,
      borderRadius:10
    },
    collectionCompletedLabel:{
      color:colors.white,
      fontSize: 10
    },
    objectInfoContainer:{
      flex:1,
      height:400,
      backgroundColor: colors.dark
    },
    objectInfoTitleContainer:{
      position:"absolute",
      margin:10,
      bottom:0
    },
    objectInfoTitle:{
      fontWeight:'bold',
      fontSize: 26,
      color:colors.white,
      marginBottom:5
    },
    objectInfoPhrase:{
      fontSize:16,
      color:colors.white
    },
    objectInfoDescription:{
      color:colors.white,
      fontSize:16,
      paddingVertical: 10  
    },
    museumsRowContainer:{
      // flexDirection:'row',
      padding:10,
      marginHorizontal:10,
      marginTop:10,
      borderRadius:10,
      backgroundColor:colors.dark
    },
    museumsRowDescriptionContainer:{
      flex:1,
      marginTop:20,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    },
    museumsRowTitle:{
      fontSize: 16,
      fontWeight:'bold',
      color:colors.white
    },
    museumsRowDescription:{
      fontSize:10,
      color:colors.darkGrey,
      textTransform: 'uppercase'
    },
    museumTourLabel:{
      fontSize:16,
      fontWeight:'bold',
      color:colors.white,
      marginVertical:10
    },
    museumTourTitle:{
      fontSize:16,
      fontWeight:'bold',
      color:colors.white
    },
    locationInfoRow:{
      color:colors.darkGrey,
      fontSize: 10,
      textAlign:'center'
    },
    locationTitleRow:{
      color:colors.white,
      fontSize: 16,
      marginTop:15,
      textAlign:'center'
    },
    toursButtonContainer:{
      flex:1,
      height:170,
      backgroundColor:colors.green,
      borderRadius:10,
      justifyContent:'center',
      padding:15
    },
    toursButtonIcon:{
      fontFamily:'meinobjekt',
      position:'absolute',
      fontSize: 96,
      bottom:25,
    },
    toursButtonLabel:{
      fontSize:26,
      color:colors.white,
      alignSelf: 'center',
      width: '50%'
    },
    appGuideButtonContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      padding:30
    },
    appGuideButtonTitle:{
      fontSize: 18,
      color:colors.darkGrey
    },
    appGuideItemTitle:{
      fontSize: 24,
      color:colors.white,
      marginVertical:15
    },
    appGuideItemDescription:{
      fontSize: 16,
      color:colors.white
    }
})


export const chat = StyleSheet.create({
  messageInputContainer:{
    backgroundColor:colors.dark,
    paddingHorizontal:15,
    paddingVertical:10,
    flexDirection:'row',
    height:55
  },
  messageTextInput:{
    backgroundColor:colors.black,
    color:colors.white,
    padding:10,
    borderRadius:5,
    flex:1
  },
  messageInputButton:{
    marginLeft:10,
    backgroundColor:colors.green,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    paddingHorizontal:10
  },
  messageInputButtonText:{
    fontSize: 16,
    fontWeight:'bold',
    color:colors.white,
    paddingHorizontal:5,
    textAlign:'center',
  },
  messageContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    padding: 5
  },
  messageTextContainer: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    maxWidth: '80%'
  },
  messageText: {
    color: colors.white,
    fontSize: 15,
    paddingVertical: 5
  },
  messageImage: {
    width: 200, height: 200,
    marginVertical: 10,
    borderRadius: 5
  },
  optionsContainer:{ 
    backgroundColor: colors.black,
    borderTopWidth:0.5
  },
  chatButton:{
    borderRadius:5,
    padding:10,
    margin:5,
    alignItems:'center',
    backgroundColor: colors.green
  },
  optionsTitle:{
    fontSize: 16,
    color:colors.white,
    fontWeight:'bold'
  },
  lastMessageLabel:{
    fontSize: 16,
    color:'rgba(255,255,255,0.5)'
  },
  chooseAvatarContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center',
    borderColor:colors.dark,
    borderTopWidth:1
  },
  chooseAvatarImage:{
    width:84,
    height:84,
    borderRadius:42,
    margin:8
  },
  chooseAvatarDialogTitle:{
    fontSize:26,
    color:colors.white,
    fontWeight:'bold',
    marginBottom:8,
    marginLeft:8
  },
  chatListContainer:{
    flexDirection:'row',
    justifyContent:'center',
    padding:15,
    borderColor:colors.dark,
    borderBottomWidth:0.5
  },
  planListContainer:{
    width: '30%',
    height:110,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
    margin:5,
    backgroundColor:colors.gray,
    // borderWidth:2, borderColor:'red'
  }
});

const profile = StyleSheet.create({ 
    settingContainer:{
      justifyContent:'space-between',
      flexDirection:'row',
      padding:15,
      borderBottomWidth:0.5,
      borderColor:colors.gray
    },
    profileTitle:{
      fontSize: 16,
      color:colors.white,
      fontWeight:'bold',
      paddingHorizontal:15,
      paddingTop:15
    },
    levelTitle:{
      fontSize: 16,
      color:colors.white,
      fontWeight:'bold',
      paddingTop:15
    },
    profileDescription:{
      fontSize: 16,
      color:colors.white,
      padding:15
    },
    versionTitle: {
      fontSize: 10,
      color:colors.brownGrey,
      paddingHorizontal:15,
    },
    btnTitle:{
      fontSize: 10,
      color:colors.brownGrey,
      marginVertical:10
    },
    profileAvatar:{
      width:120,
      height:120,
      borderRadius:60,
      backgroundColor:colors.dark
    },
    profileAvatarBorder:{
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
      width:130,
      height:130,
    },
    cameraIcon:{
      position:'absolute',
      top:110, right:10
    },
    optionsContainer:{
      flex:1,
      marginLeft:15
    },
    optionContainer:{
      backgroundColor:colors.dark,
      height:60,
      padding:10,
      borderRadius:5,
      // flex:1      
    },
    nameTextInput:{
      color:colors.white,
      paddingVertical:10
    },
    inputTitle:{
      fontSize: 10,
      color:colors.gray
    }
 })

const tinder = StyleSheet.create({  
  card: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    overflow:'hidden',
    zIndex:-1
  },
  cardImage: {
    flex: 1, 
    height: null, 
    width: null,
    borderRadius:10
  },
  actionContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:50,
    alignSelf:'center'
  },
  actionBtn: {
    width: 64,
    height: 64,
    backgroundColor: colors.dark,
    borderRadius: 32,
    marginHorizontal:15,
    alignItems:'center',
    justifyContent:'center'
  },
  likeIcon:{    
    fontFamily:'meinobjekt',
    fontSize:32,
    color:colors.white
  },
  boxLabelWrapper: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 16, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  boxLabel:{
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    // textTransform: 'uppercase'
  },
  boxTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight:'bold',
    textAlign: 'center',
    marginVertical:5
  },
  wrapper:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftLabel:{
    backgroundColor: colors.red,
    fontFamily:'SFProText-Regular',
    fontSize:26,
    color: 'white',
  },
  rightLabel:{    
    backgroundColor: colors.green,
    fontFamily:'SFProText-Regular',
    fontSize:26,
    color: 'white',
  }
});

const camera = StyleSheet.create({  
  cameraButton:{
    position:'absolute', 
    alignSelf:'center', 
    bottom:30,
    backgroundColor: '#fff',
    width:50, height:50,
    borderRadius: 25,
    alignItems:'center',
    justifyContent:'center'
  },
  photoTitleContainer:{
    position:"absolute",
    margin:10,
    bottom:0
  },
  photoTitle:{
    fontWeight:'bold',
    fontSize:26,
    color:colors.white,
    marginBottom:5
  },
  photoDescription:{
    fontSize: 16,
    color:colors.white
  },
  errorMessageContainer:{
    marginTop:-20,
    marginHorizontal:15,
    padding:8,
    backgroundColor:colors.red,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    zIndex:-1
  },
  errorMessage:{
    fontSize: 16,
    color:colors.white,
    textAlign:'center'
  }
});


export default { common, main, chat, tinder, profile, camera };