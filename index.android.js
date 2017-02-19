import React, { Component } from 'react'; 
import { AppRegistry } from 'react-native';
import { Navigation, addAndroidBackSupport } from './navigation';

addAndroidBackSupport();
AppRegistry.registerComponent('CongressHelper', () => Navigation);
