// Controllers


rprtr.controller('GlobalCtrl',
  ['$scope', '$http', '$location', 'declarations', 'declarationsByType', 'selectors', 'createUniques',
  function($scope, $http, $location, declarations, declarationsByType, selectors, createUniques) {

    console.log('GlobalCtrl');

    // Setting as a scope variable that can be updated in the view
    if($scope.styleData == null) {

      $scope.styleData = 'twitter';
      console.log('getting styles for ' + $scope.styleData);
    }

    // Function to get the styles data - This should really go in a factory
    $scope.getStyles = function(styleData) {
      $scope.loading = true;
      $http.get('data/' + styleData + '/rules.json').success(function(res) {
        $scope.styles = res;
        selectors($scope);
        
        
      });
      // This might break the parser
      $http.get('data/' + styleData + '/declarations.json').success(function(res){
        $scope.declarations = res;
        // Create arrays for each declaration type in the factory
        declarationsByType($scope);
      });
      $http.get('data/' + styleData + '/unique_declarations.json').success(function(res){
        $scope.uniqueDeclarations = res;
      });
      $scope.$watch('selectors', function(){
        // Wait for selectors to load, then get uniques
        if($scope.selectors) {
          createUniques($scope);
          $scope.loading = false;
        };
      });
    };

    // Getting initial styles data
    $scope.getStyles($scope.styleData);

    $scope.updateStyles = function(url){
      if(url) $scope.styleData = url;
      $scope.getStyles($scope.styleData);
      if($location.path() != '/parser') $location.path('/');
    };

}]);


rprtr.controller('HomeCtrl', ['$scope', '$filter', function($scope, $filter) {
  $scope.$watch('loading', function(){
    if($scope.uniqueDeclarations) $scope.refactoringPotential = parseInt((1 - ($scope.uniqueDeclarations.length / $scope.declarations.length)) * 100);
  });
}]);

rprtr.controller('MarginCtrl', ['$scope', 'anythingToRelative', function($scope, anythingToRelative){
  anythingToRelative($scope.margins);
}]);

rprtr.controller('PaddingCtrl', ['$scope', 'anythingToRelative', function($scope, anythingToRelative){
  anythingToRelative($scope.paddings);
}]);

rprtr.controller('WidthCtrl', ['$scope', 'anythingToRelative', function($scope, anythingToRelative){
  anythingToRelative($scope.widths);
}]);

rprtr.controller('HeightCtrl', ['$scope', 'anythingToRelative', function($scope, anythingToRelative){
  anythingToRelative($scope.heights);
}]);



rprtr.controller('ParserCtrl', ['$scope', '$http', '$filter', 'declarations', function($scope, $http, $filter, declarations){

  // Controller for parsing the base JSON data and spitting out
  // declarations and unique_declarations

  $scope.styleDataToParse = null;

  // Reset any previously loaded data
  $scope.declarations = null;
  $scope.uniqueDeclarations = null;

  $scope.updateStylesToParse = function(url){
    console.log('getting: ' + 'data/' + $scope.styleDataToParse + '/rules.json');
    $http.get('data/' + $scope.styleDataToParse + '/rules.json').success(function(res) {
      console.log('got: ' + 'data/' + $scope.styleDataToParse + '/rules.json');
      $scope.styles = res;
      declarations($scope);
    });
  };

  $scope.$watch($scope.declarations, function(){
    console.log('found declarations. parsing uniques...');
    $scope.getUniques();
  });

  $scope.getUniques = function(){
    console.log('getting uniques for ' + $scope.styleDataToParse);
    var uniqueFilter = $filter('unique');
    $scope.uniqueDeclarations = uniqueFilter($scope.declarations);
  };

}]);
