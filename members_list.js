import React, { Component } from 'react';
import { Text,
	 ListView,
       } from 'react-native';

export class MembersList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(['Barbara Lee', 'Dianne Feinstein', 'Kamala Harris'])
    }
  }

  _renderRow(rowData) {
    return(<Text>{rowData}</Text>);
  }

  render() {
    return (
      <ListView
	dataSource={this.state.dataSource}
	renderRow={this._renderRow}
	/>
    );
  }
}
