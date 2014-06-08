/*
*  WPMServer  this module perfoms operation on dataStore 
*/

exports.WPMServer = (function WPMServer() {

    return {

        getPackages: ds.Package.getPackages,
        createPackage : ds.Package.createPackage,
        removePackage : ds.Package.removePackage,
        updatePackage : ds.Package.updatePackage
        
           }
})();







