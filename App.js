import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import PagerView from 'react-native-pager-view';
import Main from './pages/main';
import Add from './pages/add';

const Pager = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <PagerView style={styles.viewPager} initialPage={0}>
        <View key="1">
          <Main/>
        </View>
        <View key="2">
        <Add/>
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});

export default Pager;