import React from "react";
import { View, TouchableWithoutFeedback, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import PropTypes from "prop-types";
import Toaster, {ToasterTypes} from "../Popup";
import {colors} from '../../config/styles';
import strings from "../../config/localization";

const { width } = Dimensions.get("window");
class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            swipeData: [],
            currentSelectIndex:0
        };
    }

    componentWillMount(){        
        const {swipeData, currentSelectIndex} = this.props;
        this.setState({swipeData, currentSelectIndex});
    }

    componentDidMount(){
      const {currentSelectIndex} = this.props;
      const { swipeData } = this.state;
      if(swipeData.length < currentSelectIndex || currentSelectIndex < 0 ) return;
      if (this.swiper) this.swiper.scrollToIndex({ index: currentSelectIndex });

    }

    // OnPress Methods
    _onPressNextBtn(){
        const{ currentSelectIndex, swipeData } = this.state;
        if (currentSelectIndex < swipeData.length - 1) {
            this.swiper.scrollToIndex({
                index: currentSelectIndex + 1,
                animated: true,
            });
        }
    }

    _onPressBackBtn(){
        const{ currentSelectIndex } = this.state;
        if (currentSelectIndex !== 0) {
            this.swiper.scrollToIndex({
                index: currentSelectIndex - 1,
                animated: true,
            });
        }
    }

    onViewableItemsChanged = ({ viewableItems }) => {
      // eslint-disable-next-line no-invalid-this
      if (viewableItems && viewableItems.length > 0) this.setState({ currentSelectIndex: viewableItems[0].index });
    };
    
    getItemLayout = (data, index) => ({
        length: width,
        offset: width * index,
        index
    });

    // Render Methods.
    renderItem({item, index}){
    const{ renderSwipeItem } = this.props;
        return (
          <View style={{width, flex:1}}>
            {renderSwipeItem ? renderSwipeItem(item, index) : <Text>{index}</Text>}
          </View>
        )
    }

    render() {
        const { swipeData, currentSelectIndex } = this.state;
        const floor = swipeData[currentSelectIndex] ? swipeData[currentSelectIndex].floor : 0;
        const length = swipeData.length || 1
        return (
          <View style={{flex: 1, width }}>
            <View style={{flexDirection:'row', alignItems:'center', margin:15, justifyContent:length>1?'space-between':'center'}}>
              {length > 1 && (
                <TouchableWithoutFeedback onPress={this._onPressBackBtn.bind(this)}>
                  <Icon color={colors.brownGrey} name="keyboard-arrow-left" size={30} />
                </TouchableWithoutFeedback>
              )}
              <View style={{height:30, justifyContent:'center'}}>
                <Text style={{color:colors.brownGrey, fontSize:16, fontWeight:'bold'}}>{`Level: ${floor}rd Floor`}</Text>
                <TouchableOpacity onPress={()=>Toaster.showMessage(strings.youAreInvited, ToasterTypes.MESSAGE)} style={{position:'absolute', right:-50, height:30, justifyContent:'center', paddingHorizontal:15}}>
                  <FIcon color={colors.white} name="question-circle" size={20} />
                </TouchableOpacity>
              </View>
              {length > 1 && (
                <TouchableWithoutFeedback onPress={this._onPressNextBtn.bind(this)}>
                  <Icon color={colors.brownGrey} name="keyboard-arrow-right" size={30} />
                </TouchableWithoutFeedback>
              )}
            </View>

            <FlatList
              ref={flatList => { this.swiper = flatList; }}
              scrollEnabled
              backgroundColor='rgba(255,255,255,0)'
              data={swipeData}
              extraData={this.state}
              keyExtractor={index => index.sync_id}
              renderItem={(item) => this.renderItem(item)}
              onViewableItemsChanged={this.onViewableItemsChanged}
              getItemLayout={this.getItemLayout.bind(this)}
              horizontal
              directionalLockEnabled
              pagingEnabled
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
    }
}

Swiper.propTypes = {
    renderSwipeItem: PropTypes.func.isRequired,
    currentSelectIndex: PropTypes.number,
    swipeData: PropTypes.array
};

Swiper.defaultProps = {
    swipeData: [],
    currentSelectIndex:0
};

export default Swiper;
