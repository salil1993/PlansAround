import { View, Text, Animated, Image, StyleSheet } from 'react-native';
import React from 'react';
import { t } from 'i18next';

function ListEmptyComponent(props) {
  return (
    <Animated.View style={[styles.noDataContainer, props?.customContainer]}>
      {/* <Image
        source={Images.nodata}
        style={{ height: 400, width: '100%', resizeMode: 'contain' }}
      /> */}
      <Text style={styles.noDataText}>No data found</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export { ListEmptyComponent };
