import React, { Component } from 'react';
import { Navigator,
         BackAndroid
       } from 'react-native';
import { Members } from './members';
import { Member } from './member';

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
        initialRoute={{member: null}}
        renderScene={this._renderScene}
      />
    )
  }

  _renderScene(route, navigator) {
    if (route.member === null) {
      return <Members
        onSelect={(member) => {
          navigator.push({ member: member })
        }}
      />
    } else {
      return <Member
        member={route.member}
      />
    }
  }
}
