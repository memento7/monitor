'use strict';

/*
 * rickshaw - rickshaw charts directive
 */
/*function rickshaw($compile, $window) {

  return {
    restrict: 'EA',
    scope: {
      options: '=rickshawOptions',
      series: '=rickshawSeries',
      features: '=rickshawFeatures'
    },
    // replace: true,
    link: function (scope, element) {
      var graphEl;
      var graph;
      var settings;

      function update() {
        if (!graph) {
          var mainEl = angular.element(element);
          mainEl.append(graphEl);
          mainEl.empty();
          graphEl = $compile('<div></div>')(scope);
          mainEl.append(graphEl);

          settings = angular.copy(scope.options);
          settings.element = graphEl[0];
          settings.series = scope.series;

          graph = new Rickshaw.Graph(settings);

          if (scope.features && scope.features.hover) {
            var hoverConfig = {
              graph: graph
            };
            hoverConfig.xFormatter = scope.features.hover.xFormatter;
            hoverConfig.yFormatter = scope.features.hover.yFormatter;
            hoverConfig.formatter = scope.features.hover.formatter;
            var hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
            mainEl.find('.detail').addClass('inactive');
          }

          if (scope.features && scope.features.palette) {
            var palette = new Rickshaw.Color.Palette({
              scheme: scope.features.palette
            });
            for (var i = 0; i < settings.series.length; i++) {
              settings.series[i].color = palette.color();
            }
          }
          if (scope.features && scope.features.xAxis) {
            var xAxisConfig = {
              graph: graph
            };
            if (scope.features.xAxis.timeUnit) {
              var time = new Rickshaw.Fixtures.Time();
              xAxisConfig.timeUnit = time.unit(scope.features.xAxis.timeUnit);
            }
            var xAxis = new Rickshaw.Graph.Axis.Time(xAxisConfig);
            xAxis.render();
          }
          if (scope.features && scope.features.yAxis) {
            var yAxisConfig = {
              graph: graph
            };
            if (scope.features.yAxis.tickFormat) {
              yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[scope.features.yAxis.tickFormat];
            }

            var yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
            yAxis.render();
          }
          if (scope.features && scope.features.legend) {
            var legendEl = $compile('<div></div>')(scope);
            mainEl.append(legendEl);

            var legend = new Rickshaw.Graph.Legend({
              graph: graph,
              element: legendEl[0]
            });
            if (scope.features.legend.toggle) {
              var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                graph: graph,
                legend: legend
              });
            }
            if (scope.features.legend.highlight) {
              var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
                graph: graph,
                legend: legend
              });
            }
          }
        } else {
          settings = angular.copy(scope.options, settings);
          settings.element = graphEl[0];
          settings.series = scope.series;

          settings.width = element.parent().width();

          graph.configure(settings);
        }

        graph.render();
      }

      var optionsWatch = scope.$watch('options', function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          update();
        }
      }, true);
      var seriesWatch = scope.$watch(function (scope) {
        if (scope.features && scope.features.directive && scope.features.directive.watchAllSeries) {
          var watches = {};
          for (var i = 0; i < scope.series.length; i++) {
            watches['series' + i] = scope.series[i].data;
          }
          return watches;
        } else {
          return scope.series[0].data;
        }
      }, function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          update();
        }
      }, true);
      var featuresWatch = scope.$watch('features', function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          update();
        }
      }, true);

      scope.$on('$destroy', function () {
        optionsWatch();
        seriesWatch();
        featuresWatch();
      });

      var w = angular.element($window);

      scope.getWidth = function () {
        return window.innerWidth;
      };

      scope.$watch(scope.getWidth, function (newValue, oldValue) {
        update();
      });

      w.bind('resize', function () {
        scope.$apply();
      });

      update();
    },
    controller: function ($scope, $element, $attrs) {}
  };
}

angular.module('urbanApp').directive('rickshaw', rickshaw);*/


angular.module('urbanApp')
        .directive('rickshaw', ['$compile', '$window', function($compile, $window) {
            return {
                restrict: 'EA',
                scope: {
                    options: '=rickshawOptions',
                    series: '=rickshawSeries',
                    features: '=rickshawFeatures'
                },
                // replace: true,
                link: function(scope, element, attrs) {
                    var mainEl;
                    var graphEl;
                    var legendEl;
                    var xAxis;
                    var yAxis;
                    var graph;
                    var settings;

                    function redraw() {
                        graph.setSize();
                        graph.render();
                    }

                    function _splice(args) {
                        var data = args.data;
                        var series = args.series;

                        if (!args.series) {
                            return data;
                        }

                        series.forEach(function(s) {
                            var seriesKey = s.key || s.name;
                            if (!seriesKey) {
                                throw "series needs a key or a name";
                            }

                            data.forEach(function(d) {
                                var dataKey = d.key || d.name;
                                if (!dataKey) {
                                    throw "data needs a key or a name";
                                }
                                if (seriesKey == dataKey) {
                                    var properties = ['color', 'name', 'data'];
                                    properties.forEach(function(p) {
                                        if (d[p]) {
                                            s[p] = d[p];
                                        }
                                    });
                                }
                            } );
                        });
                    }

                    function updateData() {
                        if (graph && settings) {
                            _splice({ data: scope.series, series: settings.series });
                            redraw();
                        }
                    }

                    function updateConfiguration() {
                        if (!graph) {
                            mainEl = angular.element(element);
                            mainEl.append(graphEl);
                            mainEl.empty();
                            graphEl = $compile('<div></div>')(scope);
                            mainEl.append(graphEl);

                            settings = angular.copy(scope.options);
                            settings.element = graphEl[0];
                            settings.series = scope.series;

                            graph = new Rickshaw.Graph(settings);
                        }
                        else {
                            if (scope.options) {
                                for (var key in scope.options) {
                                    settings[key] = scope.options[key];
                                    console.log(key + '=' + scope.options[key]);
                                }
                                settings.element = graphEl[0];
                            }

                            graph.configure(settings);
                        }

                        if (scope.features) {
                            if (scope.features.hover) {
                                var hoverConfig = {
                                    graph: graph
                                };
                                hoverConfig.xFormatter = scope.features.hover.xFormatter;
                                hoverConfig.yFormatter = scope.features.hover.yFormatter;
                                hoverConfig.formatter = scope.features.hover.formatter;
                                var hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
                            }

                            if (scope.features.palette) {
                                var palette = new Rickshaw.Color.Palette({scheme: scope.features.palette});
                                for (var i = 0; i < settings.series.length; i++) {
                                    settings.series[i].color = palette.color();
                                }
                            }
                        }

                        redraw();

                        if (scope.features) {
                            if (scope.features.xAxis) {
                                var xAxisConfig = {
                                    graph: graph
                                };
                                if (scope.features.xAxis.timeUnit) {
                                    var time = new Rickshaw.Fixtures.Time();
                                    xAxisConfig.timeUnit = time.unit(scope.features.xAxis.timeUnit);
                                    if (!xAxis) {
                                        xAxis = new Rickshaw.Graph.Axis.Time(xAxisConfig);
                                        xAxis.render();
                                    }
                                    else {
                                        // Update xAxis if Rickshaw allows it in future.
                                    }
                                }
                                else {
                                    if (!xAxis) {
                                        xAxis = new Rickshaw.Graph.Axis.X(xAxisConfig);
                                        xAxis.render();
                                    }
                                    else {
                                        // Update xAxis if Rickshaw allows it in future.
                                    }
                                }
                            }
                            else {
                                // Remove xAxis if Rickshaw allows it in future.
                            }

                            if (scope.features.yAxis) {
                                var yAxisConfig = {
                                    graph: graph
                                };
                                if (scope.features.yAxis.tickFormat) {
                                    yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[scope.features.yAxis.tickFormat];
                                }
                                if (!yAxis) {
                                    yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
                                    yAxis.render();
                                }
                                else {
                                    // Update yAxis if Rickshaw allows it in future.
                                }
                            }
                            else {
                                // Remove yAxis if Rickshaw allows it in future.
                            }

                            if (scope.features.legend) {
                                if (!legendEl) {
                                    legendEl = $compile('<div></div>')(scope);
                                    mainEl.append(legendEl);

                                    var legend = new Rickshaw.Graph.Legend({
                                        graph: graph,
                                        element: legendEl[0]
                                    });
                                    if (scope.features.legend.toggle) {
                                        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                                            graph: graph,
                                            legend: legend
                                        });
                                    }
                                    if (scope.features.legend.highlight) {
                                        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
                                            graph: graph,
                                            legend: legend
                                        });
                                    }
                                }
                            }
                            else {
                                if (legendEl) {
                                    legendEl.remove();
                                    legendEl = null;
                                }
                            }
                        }
                    }

                    var optionsWatch = scope.$watch('options', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateConfiguration();
                        }
                    }, true);
                    var seriesWatch = scope.$watchCollection('series', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateData();
                        }
                    }, true);
                    var featuresWatch = scope.$watch('features', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateConfiguration();
                        }
                    }, true);

                    scope.$on('$destroy', function() {
                        optionsWatch();
                        seriesWatch();
                        featuresWatch();
                    });

                    angular.element($window).on('resize', function() {
                        scope.$broadcast('rickshaw::resize');
                    });
                    
                    scope.$on('rickshaw::resize', function() {
                        redraw();
                    });
                    
                    updateConfiguration();
                },
                controller: function($scope, $element, $attrs) {
                }
            };
        }]);