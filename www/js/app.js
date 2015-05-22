(function(){
  //'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope) {
  });

  module.controller('MasterController', function($scope, $http) {
    $scope.keyUnlock = false;
    $scope.start = false;
    var watchID = null;

    $scope.reStart = function() {
        $('#mainContent').css('background','#092951');
        $('#status').text('');
        $scope.$apply(function() {
          $scope.start = false;
          $scope.keyUnlock = false;
        });
    };

    $scope.unLock = function() {
      // 鍵を解除する
      $.ajax({
          url: 'http://linda-server.herokuapp.com/masuilab',
          type: 'POST',
          data: {
              tuple : '{"type":"door","cmd":"open","where":"delta"}'
          },
          success: function( data ) {
            $scope.$apply(function() {
              $scope.keyUnlock = true;
            });
            $('#status').text('Unlocked!');
            $('#mainContent').css('background','#f1c40f');
            navigator.vibrate(1000);
            setTimeout(function() {
              $scope.reStart();
            }, 6000);
          },
          error: function( data ) {
            $('#status').text('Error!');
            $('#mainContent').css('background','#c0392b');
            navigator.vibrate(1000);
            setTimeout(function() {
              $scope.reStart();
            }, 6000);
          }
      });
    }

    $scope.startWatch = function() {
       if($scope.start == false) {
          $scope.start = true;
       var options = { frequency: 100 };
        function onSuccess(acceleration) {
            var element = document.getElementById('accelerometer');
            var x = Math.floor(acceleration.x*1000);
            var percent = Math.floor((x / 9000) * 100);
            if(percent < 100) {
              var move_px = 280 * (percent / 100);
                  move_px = -280 + move_px;
              $('#bar').css('left',move_px+'px');
              var head = Math.floor(percent / 10);
              switch (head) {
                case 0:
                  $('#mainContent').css('background','#0e2b47');
                break;
                case 2:
                  $('#mainContent').css('background','#15406a');
                break;
                case 4:
                  $('#mainContent').css('background','#1d558d');
                break;
                case 6:
                  $('#mainContent').css('background','#236ab1');
                break;
                case 8:
                  $('#mainContent').css('background','#2b80d5');
                break;
              }
            } else if(percent > 100) {
              $('#status').text('Unlocking...');
              $('#mainContent').css('background','#e67e22');
              $('#bar').css('left','0px');
              navigator.accelerometer.clearWatch(watchID);
              watchID = null;
              $scope.unLock();
            }

        }
        function onError() {
            alert('onError!');
        }
       watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
       }
    };

  });
})();

