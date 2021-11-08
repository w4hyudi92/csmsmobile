export const firebaseConfig = {
  apiKey: "AIzaSyDWaRUfJVbFCFCGsI2okNEIRvKNYwDKRVM",
  authDomain: "csms-53576.firebaseapp.com",
  databaseURL: "https://csms-53576.firebaseio.com",
  projectId: "csms-53576",
  storageBucket: "csms-53576.appspot.com",
  messagingSenderId: "448392195185",
  appId: "1:448392195185:web:a61d4423dfdf5642"
};

export const snapshootToArray = snapshoot => {
  let returnArray = [];
  snapshoot.forEach(element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });
  return returnArray;
}