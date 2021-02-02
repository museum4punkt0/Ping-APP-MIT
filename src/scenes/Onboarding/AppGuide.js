import React from "react";
import { View, FlatList, Dimensions, Image, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import strings from "../../config/localization";
import styles, { colors } from "../../config/styles";
import Text from '../../components/Text';
import Scene from '../../components/Scene';
import img_1 from '../../assets/images/onboarding/1.png'
import img_2 from '../../assets/images/onboarding/2.png'
import img_3 from '../../assets/images/onboarding/3.png'
import img_4 from '../../assets/images/onboarding/4.png'

const { width } = Dimensions.get("window");

class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSelectIndex:0
        };
        this.viewabilityConfig = {
          minimumViewTime: 250,
          viewAreaCoveragePercentThreshold: 60,
        };
        this.swipeData = [
          {id:0, title:strings.title_1, description:strings.description_1, image:img_1},
          {id:1, title:strings.title_2, description:strings.description_2, image:img_2},
          {id:2, title:strings.title_3, description:strings.description_3, image:img_3},
          {id:3, title:strings.title_4, description:strings.description_4, image:img_4},
      ]
    }


    // OnPress Methods
    _onPressNextBtn(currentSelectIndex){
        if (currentSelectIndex < this.swipeData.length - 1) {
            this.swiper.scrollToIndex({
                index: currentSelectIndex + 1,
                animated: true,
            });
        }else{ Actions.DetectLocation(); }
    }

    onViewableItemsChanged = ({ viewableItems }) => {
      // eslint-disable-next-line no-invalid-this
      if (viewableItems && viewableItems.length > 0) this.setState({ currentSelectIndex: viewableItems[0].index });
    };

    // eslint-disable-next-line
    renderItem({item}){
        return (
          <View style={{width, flex:1, alignItems:'center', justifyContent:'center', padding:30}}>
            <Image source={item.image} style={{ width:250, height:250}} />
            <View>
              <Text style={styles.main.appGuideItemTitle}>{item.title}</Text>
              <Text style={styles.main.appGuideItemDescription}>{item.description}</Text>
            </View>
          </View>
        )
    }



    render() {
        const{ currentSelectIndex } = this.state;
        return (
          <Scene isHaderShow={false}>
            <FlatList
              ref={flatList => { this.swiper = flatList; }}
              scrollEnabled
              data={this.swipeData}
              keyExtractor={index => index.id}
              renderItem={(item) => this.renderItem(item)}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
              horizontal
              directionalLockEnabled
              pagingEnabled
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
            
            <View style={styles.main.appGuideButtonContainer}>
              <TouchableOpacity onPress={() => Actions.DetectLocation()}>
                <Text style={styles.main.appGuideButtonTitle}>{strings.skip}</Text>
              </TouchableOpacity>
              <View style={{flexDirection:'row'}}>
                {this.swipeData.map(item=>(<View key={item.id} style={{width:10, height:10, borderRadius:5, marginHorizontal:5, backgroundColor:item.id === currentSelectIndex ? colors.white : colors.darkGrey}} />))}
              </View>
              <TouchableOpacity onPress={() => this._onPressNextBtn(currentSelectIndex)}>
                <Text style={styles.main.appGuideButtonTitle}>{strings.next}</Text>
              </TouchableOpacity>
            </View>
          </Scene>
        );
    }
}

export default Swiper;
