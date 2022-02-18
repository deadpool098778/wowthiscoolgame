function isUserLoggedIn(){var authCookieName='drifted_logged_in';var regEx=new RegExp(authCookieName+"=","g");return regEx.test(document.cookie);}
function checkPlayerLoggedIn(){if(isUserLoggedIn()){var result=0;var userProfile=getDataUserProfile("dh_max_game_version_index")
return userProfile.then(function(userProfile){if(userProfile.meta.dh_max_game_version_index!==""){result=userProfile.meta.dh_max_game_version_index.index;}
window.unityInstance.SendMessage('JSHook','InitializeSaveFileVersionFromServer',""+result);}).catch(function(err){if(err.responseText){console.log(err.responseText);}}).finally(function(){return result;});}
else{window.unityInstance.SendMessage('JSHook','InitializeSaveFileVersionFromPlayerPrefs');}}
function getDataUserProfile(metaKey){var WPNonce=fetchWPNonce();return new Promise(function(resolve,reject){WPNonce.then(function(nonce){$.ajax({async:false,method:"get",url:"/wp-json/wp/v2/users/me",headers:{"X-WP-Nonce":nonce}}).done(function(userProfile){if(userProfile.meta){if(userProfile.meta.dh_max_cars){userProfile.meta.dh_max_cars=JSON.parse(userProfile.meta.dh_max_cars);}
if(userProfile.meta.dh_max_game_version_index){userProfile.meta.dh_max_game_version_index=JSON.parse(userProfile.meta.dh_max_game_version_index);}
if(userProfile.meta.dh_max_wallet){userProfile.meta.dh_max_wallet=JSON.parse(userProfile.meta.dh_max_wallet);}}
resolve(userProfile);}).fail(function(err){reject(err);})});});}
function saveDataUserProfile(metaData){var WPNonce=fetchWPNonce();return new Promise(function(resolve,reject){WPNonce.then(function(nonce){$.ajax({async:false,method:"post",url:"/wp-json/wp/v2/users/me",headers:{"X-WP-Nonce":nonce},data:{"meta":metaData}}).done(function(returnedData){resolve(returnedData);}).fail(function(err){reject(err);})});});}
function fetchWPNonce(){var promise=new Promise(function(resolve,reject){$.post({async:false,url:"/endpoint-create-nonce",data:{"id":"rest"}}).done(function(data,textStatus,jqXHR){response=JSON.parse(data);if(response.nonce){resolve(response.nonce)}else{reject("Missing nonce from call")}}).fail(function(err){reject(err)});});return promise;}
function initUserCars(carData){var metaObj={"dh_max_cars":carData};return saveDataUserProfile(metaObj).finally(function(){return true;});}
function getAllUserCars(fireCallback=true){var userProfile=getDataUserProfile("dh_max_cars");return userProfile.then(function(userProfile){var dh_max_cars="";if(userProfile&&userProfile.meta&&userProfile.meta.dh_max_cars){dh_max_cars=JSON.stringify(userProfile.meta.dh_max_cars);}
if(fireCallback){window.unityInstance.SendMessage('JSHook','InitializeAllUserCarsFromServer',dh_max_cars);}
return dh_max_cars;});}
function saveUserCar(carData){var userCarData=getAllUserCars(false);userCarData.then(function(userCarData){if(userCarData!==""){userCarData=JSON.parse(userCarData);carData=JSON.parse(carData)
if(userCarData.array!==undefined){userCarData.array=userCarData.array.map(function(carEntry){if(carEntry.carId===carData.carId){carEntry=carData;}
return carEntry;});userCarData=JSON.stringify(userCarData);}}else{userCarData="["+carData+"]";}
initUserCars(userCarData).then(function(){return true;});});}
function initUserWallet(){var initialWalletBalance=1000;return saveUserWallet(initialWalletBalance).then(function(userProfile){return true;});}
function getUserWallet(){var userProfile=getDataUserProfile("dh_max_wallet")
userProfile.then(function(userProfile){window.unityInstance.SendMessage('JSHook','InitializeUserWalletFromServer',""+userProfile.meta.dh_max_wallet.balance);return userProfile.meta.dh_max_wallet.balance;});}
function saveUserWallet(balance){var userWallet={balance:balance};var metaObj={"dh_max_wallet":JSON.stringify(userWallet)};saveDataUserProfile(metaObj).then(function(returnResult){return true;});}
function setLastSaveGameVersionIndex(gameVersionIndex){var versionIndex={index:gameVersionIndex};var metaObj={"dh_max_game_version_index":JSON.stringify(versionIndex)};saveDataUserProfile(metaObj).then(function(returnResult){return true;});}
