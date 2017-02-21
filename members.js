import React, { Component, PropTypes } from 'react';
import { Button,
	       ListView,
         Text,
         TouchableHighlight,
         View,
       } from 'react-native';
import { ApiKey } from './api_key';

var membersHouse = { members: [], lastUpdated: null };
export class Members extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([null]),
      chamber: 'house',
    }
    var fifty_minutes = 3000000;
    if (membersHouse.lastUpdated === null || Date.now() - membersHouse.lastUpdate > fifty_minutes) {
      this._setMembers('house');
    }
  }


  async _setMembers(chamber) {
    membersHouse.members = await this._getMembersFromApiAsync(chamber);
    membersHouse.lastUpdated = Date.now();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(membersHouse.members),
      chamber: chamber,
    });
  }

  async _getMembersFromApiAsync(chamber) {
    try {
      let response = await this._fetchMembers(chamber);
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

  _fetchMembers(chamber) {
    return fetch(`https://api.propublica.org/congress/v1/114/${chamber}/members.json`, {
      method: 'GET',
      headers: {
        'X-API-Key': ApiKey,
      }
    });
  }

  _renderRow(member) {
    if (member === null) {
      return (<Text>(loading members...)</Text>);
    }
    if (member.district === undefined) {
      stateDistrict = member.state
    } else {
      stateDistrict = member.state + '-' + member.district;
    }
    text = ('(' + stateDistrict + ' ' + member.party + ') '
            + member.first_name + ' ' + member.last_name);
    return(
      <TouchableHighlight onPress={() => this.props.onSelect(member)}>
        <Text>{text}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    chamberIsHouse = this.state.chamber == 'house';
    houseTitle = chamberIsHouse ? 'In the House' : 'Show House';
    senateTitle = chamberIsHouse ? 'Show Senate' : 'In the Senate';
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Button
            title={houseTitle}
            disabled={this.state.chamber == 'house'}
            onPress={() => this._setMembers('house')}
          />
          <Button
            title={senateTitle}
            disabled={this.state.chamber == 'senate'}
            onPress={() => this._setMembers('senate')}
          />
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(member) => this._renderRow(member)}
          pageSize={1000}
        />
      </View>
    );
  }
}

Members.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
