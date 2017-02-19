import React, { Component } from 'react';
import { Navigator,
         BackAndroid
       } from 'react-native';
import { MembersList } from './members_list';
import { MemberDetails } from './member_details';

var _navigator;

export var addAndroidBackSupport = () => {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator.getCurrentRoutes().length === 1) {
      return false;
    }
    _navigator.pop();
    return true;
  });
}

export class Navigation extends Component {
  render() {
    return(
      <Navigator
        ref={(nav) => {_navigator=nav; }}
        initialRoute={{memberId: null}}
        renderScene={this._renderScene}
      />
    )
  }

  _renderScene(route, navigator) {
    if (route.memberId === null) {
      return <MembersList
        onSelect={(memberId) => {
          navigator.push({ memberId: memberId })
        }}
      />
    } else {
      return <MemberDetails
        memberId={route.memberId}
      />
    }
  }
}
