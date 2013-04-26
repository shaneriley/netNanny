// jQuery netNanny
// Filters out unwanted words and phrases in forms
// v 1.0.0
(function(factory) {
  typeof define === "function" && define.amd ? define(["jquery"], factory) : factory(jQuery);
})(function($) {
  var net_nanny = {
    name: "netNanny",
    input_selectors: ["[type=text]", "textarea"],
    replacement_character: "*",
    terms_path: "/javascripts/filtered_words.json",
    terms_property: "words",
    terms: [],
    getTerms: function() {
      var plugin = this;
      $.getJSON(plugin.terms_path, function(json) {
        plugin.terms = json[plugin.terms_property];
      });
    },
    _offense: false,
    search: function(e) {
      var plugin = this;

      plugin.$inputs.each(function(i) {
        plugin.scrub.call(plugin.$inputs.eq(i), plugin);
      });

      this.furtherAction(this._offense, e);
    },
    scrub: function(plugin) {
      var source = this.val();
      source = " " + source + " ";
      $.each(plugin.terms, function(i, term) {
        var rxp = new RegExp("(\\W)(" + term + ")(\\W)", "gi");
        if (rxp.test(source)) {
          plugin._offense = true;
          source = source.replace(rxp, function() {
            return arguments[1] + (new Array(term.length + 1)).join(plugin.replacement_character) + arguments[3];
          });
        }
      });

      this.val($.trim(source));
    },
    furtherAction: $.noop,
    locateForm: function() {
      var $f = this.$el.is("form") ? this.$el : this.$el.closest("form");
      if (!this.$el.is("form")) {
        this.$inputs = this.$el;
        return $f;
      }
      this.$inputs = $f.find(this.input_selectors.join(","));

      return $f;
    },
    init: function() {
      var $f = this.locateForm();

      if (!$f.length) { return; }
      this.getTerms();
      $f.on("submit", $.proxy(this.search, this));
    }
  };

  var internals = {
    createPlugin: function(plugin) {
      $.fn[plugin.name] = function(opts) {
        var $els = this,
            args = arguments,
            method = $.isPlainObject(opts) || !opts ? "" : opts;
        if (method && plugin[method]) {
          $els.each(function(i) {
            plugin[method].apply($els.eq(i).data(plugin.name), Array.prototype.slice.call(arguments, 1));
          });
        }
        else if (!method) {
          $els.each(function(i) {
            var plugin_instance = $.extend({
              $el: $els.eq(i)
            }, plugin, opts);
            $els.eq(i).data(plugin.name, plugin_instance);
            plugin_instance.init();
          });
        }
        else {
          $.error('Method ' +  method + ' does not exist on jQuery.' + plugin.name);
        }
        return $els;
      };
    }
  };

  internals.createPlugin(net_nanny);
});
