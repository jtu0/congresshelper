import React, { Component, PropTypes } from 'react';
import { Text,
	       ListView,
         TouchableHighlight,
       } from 'react-native';
import { ApiKey } from './api_key';

var membersHouse = { members: [], lastUpdated: null };
export class MembersList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(membersHouse.members),
    }
    var fifty_minutes = 3000000;
    if (membersHouse.lastUpdated === null || Date.now() - membersHouse.lastUpdate > fifty_minutes) {
      this._setMembersHouse();
    }
  }


  async _setMembersHouse() {
    membersHouse.members = await this._getMembersHouseFromApiAsync();
    membersHouse.lastUpdated = Date.now();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(membersHouse.members),
    });
  }

  async _getMembersHouseFromApiAsync() {
    try {
      let response = await this._fetchMembersHouse();
      let responseJson = await response.json();
      members = [];
      for (var result of responseJson.results) {
        for (var member of result.members) {
          members.push(member);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return members.sort((a,b) => {
      if (a.state < b.state) { return -1; }
      if (a.state > b.state) { return +1; }
      if (a.district < b.district) { return -1; }
      if (a.district > b.district) { return +1; }
      return 0;
    });
  }

  _fetchMembersHouse() {
    return fetch('https://api.propublica.org/congress/v1/114/house/members.json', {
      method: 'GET',
      headers: {
        'X-API-Key': ApiKey,
      }
    });
  }

  _renderRow(member) {
    text = ('(' + member.state + '-' + member.district + ' ' + member.party + ') '
            + member.first_name + ' ' + member.last_name);
    return(
      <TouchableHighlight onPress={() => this.props.onSelect(member)}>
        <Text>{text}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(member) => this._renderRow(member)}
      />
    );
  }
}

MembersList.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
