import React, {useState} from 'react';
import {View, Image, ActivityIndicator, StyleSheet, Text} from 'react-native';
import R from '../../resources/R';

const ImageWithLoading = ({source, style, loaderColor = '#000', onPress}) => {
  const [loading, setLoading] = useState(true);
  const handleOnPress = () => {
    console.log("INSIDE");
    onPress && onPress();
  };
  return (
    <View style={styles.container} onPress={handleOnPress}>
      {loading && (
        <>
          <ActivityIndicator
            style={styles.loader}
            size="small"
            color={loaderColor}
          />
          <Text style={{color: R.colors.LIGHTGRAY}}>Loading Image...</Text>
        </>
      )}
      <Image
        source={source}
        style={[style, {display: loading ? 'none' : 'flex'}]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 160,
    alignSelf: 'center',
    // marginBottom: 10,
    borderRadius: 6,
    // borderWidth: 1.5,
    // borderColor: R.colors.SLATE_GRAY,
  },
  loader: {
    position: 'absolute',
  },
  clientImage: {
    width: 120,
    height: 120,
    borderRadius: 160,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: R.colors.SLATE_GRAY,
  },
});

export default ImageWithLoading;
