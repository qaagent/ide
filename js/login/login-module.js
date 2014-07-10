function LoginModule($scope){
    
    $scope.email = "";
    $scope.password = "";
    $scope.repassword = "";
    
    $scope.signUp = function()
    {
        console.log("jkhkj" + $scope.email);
        console.log($scope.password);
        console.log($scope.repassword);
    };
}