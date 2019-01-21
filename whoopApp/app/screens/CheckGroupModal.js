import React from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableHighlight
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-checkbox'

export default class CheckGroupModal extends React.Component {
  static navigationOptions = {
    title: 'WHOOP!!! APP',
    headerStyle: {
      backgroundColor: '#500000'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20
    }
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state
    this.handler = require('../DB.js')
    this.state = {
      object: params.object,
      loading: true,
      empty: false,
      adding: false,
      removing: false,
      contacts: this.handler.getContacts(),
      nonMembers: [],
      members: []
    }
    this.tmpList = []
    this.tmpRemoveList = []
  };

  getNonMembers(members, contacts){
    console.log('contacts')
    console.log(JSON.stringify(contacts))
    console.log('members')
    console.log(JSON.stringify(members))
    var nonMembers = contacts
    for(c in nonMembers){
      var tmp = nonMembers[c]
      for(m in members){
        var mem = members[m]
        if(mem.id == tmp.id){
          nonMembers.splice(c, 1)
          continue
        }
      }
    }
    return nonMembers
  }

  getGroupMembersCallback(grp){
    console.log('members')
    console.log(JSON.stringify(grp))
    if(grp == false){
      this.setState({
        mems: [],
        nonMembers: this.state.contacts,
        loading: false,
        empty: true
      })
      return
    }
    for(m in grp.getMembers()){
      console.log(JSON.stringify(grp.getMembers()[m]))
    }
    var mems = grp.getMembers()
    var nonMembers = this.getNonMembers(mems, this.state.contacts)
    this.setState({
      object: grp,
      loading: false,
      empty: false,
      nonMembers: nonMembers
    })
  }

  componentDidMount(){
    var callback = this.getGroupMembersCallback.bind(this)
    this.handler.loadGroupMembers(this.state.object.getId(), callback)
    var storedGroupMems = this.state.object.getMembers()
    console.log('stored group members')
    console.log(JSON.stringify(storedGroupMems))
    if(storedGroupMems.length < 1){
      console.log('no stored group members')
      return
    }
    var nonMembers = this.getNonMembers(storedGroupMems, this.state.contacts)
    this.setState({
      loading: false,
      nonMembers: nonMembers
    })
  }

  addMembers(){
    this.setState({
      adding: true
    })
  }

  removeMembers(){
    this.setState({
      removing: true
    })
  }

  pushAddMembers(members){
    console.log('adding members')
    console.log(JSON.stringify(members))
    for(m in members){
      var newMem = members[m]
      this.handler.addMemToGroup(this.state.object.getId(), newMem)
    }
    var nonMembers = this.getNonMembers(this.state.object.getMembers(), this.state.contacts)
    this.setState({
      nonMembers: nonMembers
    })
  }

  pushRemoveMembers(members){
    console.log('removing members')
    console.log(JSON.stringify(members))
    for(m in members){
      var newMem = members[m]
      this.handler.removeMemFromGroup(this.state.object.getId(), newMem)
    }
    var nonMembers = this.getNonMembers(this.state.object.getMembers(), this.state.contacts)
    this.setState({
      nonMembers: nonMembers
    })
  }

  displayMembers(){
    if(this.tmpList.length >= 1){
      this.pushAddMembers(this.tmpList)
    }
    if(this.tmpRemoveList.length >= 1){
      this.pushRemoveMembers(this.tmpRemoveList)
    }
    this.tmpList = []
    this.tmpRemoveList = []
    this.setState({
      adding: false,
      removing: false
    })
  }

  displayMembersScreen(){
    return (
        <View style={styles.container2}>
        <View style={{flex:0.9, alignItems: 'center'}}>
          <Text style={styles.title}>
            {this.state.object.getName()}
          </Text>
          <FlatList
            data={this.state.object.getMembers()}
            extraData={this.state}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => (
              <View>
              <Text>{item.first_name + ' ' + item.last_name}</Text>
              </View>
            )}
          />
          <View style={styles.editButtons}>
            <Button
              title='Add Members'
              onPress={()=>{this.addMembers()}}
            />
            <Button
              title='Remove Members'
              onPress={()=>{this.removeMembers()}}
            />
          </View>
        </View>
        </View>
    )
  }

  emptyScreen(){
    return (
        <View style={styles.container2}>
        <View style={{flex:0.9, alignItems: 'center'}}>
          <Text style={styles.title}>
            {this.state.object.getName()}
          </Text>
          <Text>Group is empty</Text>
          <View style={styles.editButtons}>
            <Button
              title='Add Members'
              onPress={()=>{this.addMembers()}}
            />
          </View>
        </View>
        </View>
    )
  }

  tmpRemoveMem(item){
    if(this.tmpRemoveList){
      this.tmpRemoveList.push(item)
    } else {
      this.tmpRemoveList = [item]
    }
  }

  tmpUndoRemoveMember(item){
    for(n in this.tmpRemoveList){
      if(this.tmpRemoveList[n] == item){
        this.tmpRemoveList.splice(n, 1)
        return
      }
    }
  }

  removeMembersScreen(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.state.object.getName()}
        </Text>
        <FlatList
          data={this.state.object.getMembers()}
          extraData={this.state}
          renderItem={({item}) => (
            <CheckBox
              label={item.first_name + ' ' + item.last_name}
              onChange={(checked)=>{
                if(checked){
                  this.tmpRemoveMem(item)
                } else {
                  this.tmpUndoRemoveMember(item)
                }
              }}
            />
          )}
        />
        <View style={styles.editButtons}>
          <Button
            title='Done'
            onPress={()=>{
              console.log('removeing members')
              console.log(JSON.stringify(this.tmpRemoveList))
              this.displayMembers()
            }}
          />
        </View>
      </View>
    )
  }

  tmpAddMember(item){
    console.log('adding')
    console.log(JSON.stringify(item))
    this.tmpList.push(item)
  }

  tmpUndoAddMember(item){
    console.log('removing')
    console.log(JSON.stringify(item))
    for(n in this.tmpList){
      if(this.tmpList[n] == item){
        this.tmpList.splice(n, 1)
        return
      }
    }
  }

  addMembersScreen(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.state.object.getName()}
        </Text>
        <FlatList
          data={this.state.object.getMembers()}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <Text>{item.first_name + ' ' + item.last_name}</Text>
          )}
        />
        <FlatList
          data={this.handler.getContacts()}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <CheckBox
              label={item.first_name + ' ' + item.last_name}
              onChange={(change)=>{
                if(change){
                  this.tmpAddMember(item)
                } else {
                  this.tmpUndoAddMember(item)
                }
              }}
            />
          )}
        />
        <View style={styles.editButtons}>
          <Button
            title='Done'
            onPress={()=>{
              console.log('tmp list')
              console.log(JSON.stringify(this.tmpList))
              this.displayMembers()
            }}
          />
        </View>
      </View>
    )
  }

  loadingScreen(){
    return (
      <View style={styles.container}>
      <Text style={styles.title}>
        {this.state.object.getName()}
      </Text>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  render() {
    if(this.state.loading){
      return this.loadingScreen()
    }
    if(this.state.adding){
      return this.addMembersScreen()
    }
    if(this.state.removing){
      return this.removeMembersScreen()
    }
    if(this.state.empty){
      return this.emptyScreen()
    }
    return this.displayMembersScreen()
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginTop: DEVICE_HEIGHT / 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1
  },
  editButtons: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 100
  },
  text: {
    textAlign: 'left',
    color: '#000'
  },
  input: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold',
    width: DEVICE_WIDTH - 30,
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
