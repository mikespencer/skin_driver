var wpAd = window.wpAd || {};

(function(w, d, $, where){
  
  'use strict';
  
  var siteData = {
    washingtonpost: {
      wrappers: {
        'standard': '#shell',
        'jobs': '#wrapper',
        'cityguide': '#wrapper'
      },
      pageCSS: {
        'padding': '0 11px',
        'background-color': '#fff'
      }
    },
    slate: {      
      wrappers: {
        'standard': 'div.sl-content-wrapper'
      },
      pageCSS: {
        'padding': '0 6px',
        'background-color': '#fff'
      }
    },
    theroot: {
      wrappers: {
        'standard': '#page'
      },
      pageCSS: {
        'background-color': '#fff'
      }
    }
  };
  
  function Skin(config){
  
    config = config || {};
    
    var site = config.site && siteData[config.site] ? config.site : (function(domain){
      if(domain){
        for(var key in siteData){
          if(siteData.hasOwnProperty(key) && (new RegExp(key).test(domain))){
            return key;
          }
        }
      }
      return 'washingtonpost';
    })(d.domain);
    
    this.config = $.extend(true, {
      click: {
        track: '',
        url: ''
      },
      css: {
        body: {},
        wrapper: siteData[site].pageCSS || {},
        ct: {
          'display': 'block',
          'margin': '0',
          'padding': '0',
          'height': '30px'
        }
      },
      pixels: [],
      ct_title: '',
      wrapper_selector: null,
      site: site
    }, config);
    
    this.$body = $('body');
    this.$head = $('head');
    this.cssString = '';
    
    this.$wrapper = this.getWrapper(this.config.wrapper_selector) || 
      this.getWrapper(siteData[site].wrappers[where.split('/')[0]]) ||
      this.getWrapper(siteData[site].wrappers.standard);
    
    this.exec();
    
    return this;
  }

  Skin.prototype.getWrapper = function(selector){
    if(selector){
      var el = $(selector);
      if(el.length){
        this.config.wrapper_selector = selector;
        return el;
      }
    }
    return false;
  };
  
  Skin.prototype.exec = function(){
    this.$body.addClass('skinned');
    this.tracking().insertClickthrough().configWrapperCSS().configBodyCSS().addStyles(this.cssString);
  };
  
  Skin.prototype.tracking = function(){
    var p = this.config.pixels, l = p.length;
    while(l--){
      if(p[l]){
        this.addPixel(p[l], 'impression pixel');
      }
    }
    return this;
  };
  
  Skin.prototype.insertClickthrough = function(){
    this.$clickthrough = (this.config.click.url ? $(d.createElement('a')).attr({
      target: '_blank',
      title: this.config.ct_title,
      href: this.config.click.track + this.config.click.url
    }) : $(d.createElement('div'))).css(this.config.css.ct).attr({id: 'skin_spacer_top'}).prependTo(this.$body);
    return this;
  };
  
  Skin.prototype.configWrapperCSS = function(){
    if(this.config.wrapper_selector){
      this.cssString += this.stringifyCSS('html body.skinned ' + this.config.wrapper_selector, this.config.css.wrapper);
    }
    return this;
  };
  
  Skin.prototype.configBodyCSS = function(){
    this.cssString += this.stringifyCSS('html body.skinned', this.config.css.body);
    return this;
  };
  
  Skin.prototype.addStyles = function(css){
    $('<style type="text/css">' + css + '</style>').appendTo(this.$head);
  };

  Skin.prototype.stringifyCSS = function(target, obj){
    var rv = [target + '{'], key;
    for(key in obj){
      if(obj.hasOwnProperty(key)){
        rv.push(key + ': ' + obj[key] + ' !important;');
      }
    }
    rv.push('}');
    return rv.join(' ');
  };
  
  Skin.prototype.addPixel = function(url){
    $(d.createElement('img')).attr({
      src: url.replace(/\[timestamp\]|\[random\]|\%n/gi, Math.floor(Math.random() * 1E9)),
      width: '1',
      height: '1',
      alt: arguments[1] || ''
    }).css({
      display: 'none',
      border: '0'
    }).appendTo(this.$body);
  };
  
  wpAd.Skin = Skin;
  
})(window, document, window.jQuery, window.commercialNode);