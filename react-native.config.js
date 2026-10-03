const isTV = process.env.EXPO_TV === '1';

// Native libraries with no tvOS support; excluded from Apple TV builds only
const notOnTV = [
  '@stripe/stripe-react-native',
  'react-native-google-mobile-ads',
];

module.exports = {
  dependencies: isTV
    ? Object.fromEntries(notOnTV.map((name) => [name, { platforms: { ios: null } }]))
    : {},
};
