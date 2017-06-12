const SERVER = require('../utils/av-weapp-min');

class PackInfo extends SERVER.Object {
  get bonus() {
    return this.get('bonus');
  }

  set bonus(value) {
    this.set('bonus', value);
  }

  get content() {
    return this.get('content');
  }

  set content(value) {
    this.set('content', value);
  }

  get delName() {
    return this.get('delName');
  }

  set delName(value) {
    this.set('delName', value);
  }

  get desLocation() {
    return this.get('desLocation');
  }

  set desLocation(value) {
    this.set('desLocation', value);
  }

  get realName() {
    return this.get('realName');
  }

  set realName(value) {
    this.set('realName', value);
  }

  get sendDate() {
    return this.get('sendDate');
  }

  set sendDate(value) {
    this.set('sendDate', value);
  }

  get sendLocation() {
    return this.get('sendLocation');
  }

  set sendLocation(value) {
    this.set('sendLocation', value);
  }

  get senderPhone() {
    return this.get('senderPhone');
  }

  set senderPhone(value) {
    this.set('senderPhone', value);
  }

  get state() {
    return this.get('state');
  }

  set state(value) {
    this.set('state', value);
  }

  get wxName() {
    return this.get('wxName');
  }

  set wxName(value) {
    this.set('wxName', value);
  }

  get objectId() {
    return this.get('objectId');
  }
}
SERVER.Object.register(PackInfo, 'PackInfo');
module.exports = PackInfo;