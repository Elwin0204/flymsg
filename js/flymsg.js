;(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(global);
    });
  } else {
    global.FLYMSG = factory(global);
  }
})(this, function (exports) {
  'use strict';

  // compatible assign syntax
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) {
        throw new TypeError('Cannot convert undifined or null to object');
      }

      target = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        if (source != null) {
          for (var k in source) {
            if (Object.prototype.hasOwnProperty.call(source, k)) {
              target[k] = source[k];
            }
          }
        }
      }
      return target;
    }
  }

  // compatible classList 
  if (!('classList'in HTMLElement.prototype)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function () {
        var _self = this;
        return {
          contains: function (cls) {
            var index = _self.className.indexOf(cls);
            return index != -1 ? true : false;
          },
          add: function (cls) {
            if (!this.contains(cls)) {
              _self.className += ' ' + cls;
            }
          },
          remove: function (cls) {
            if (this.contains(cls)) {
              var reg = new RegExp(cls);
              _self.className = _self.className.replace(reg, '');
            }
          },
          toggle: function (cls) {
            if (this.contains(cls)) {
              this.remove(cls);
            } else {
              this.add(cls);
            }
          }
        }
      }
    });
  }

  /**
   * @description Generate name with namespace
   * @param {...String}
   * @returns {String}
   */
  function namespacify () {
    var result = G_NAMESPACE;
    for (var i = 0; i < arguments.length; i++) {
      result += '-' + arguments[i];
    }
    return result;
  }

  /**
   * @description Determine whether the css attribute is supported
   * @param {String} prop: css attribute
   * @returns {Boolean}
   */
  function supportCss3 (prop) {
    var divEl = document.createElement('div');
    var vendors = 'Ms O Moz Webkit'.split();
    var len = vendors.length;
    if (prop in divEl.style) return true;

    prop = prop.replace(/^[a-z]/, function (val) {
      return val.toUpperCase();
    });

    while (len--) {
      if (vendors[len]+prop in divEl.style) return true;
    }
    return false;
  }

  /**
   * @description merge config params
   */
  function mergeOpt (content, opt) {
    var config = Object.assign({}, G_DEFALUTS);
    if (arguments.length === 0) return config;
    if (Object.prototype.toString.call(content) === '[object Object]') {
      config = Object.assign(config, content);
      return config;
    } else {
      config.content = content.toString();
    }
    if (Object.prototype.toString.call(opt) === '[object Object]') {
      config = Object.assign(config, opt);
      return config;
    }
    return config;
  }

  /**
   * @param {Msg} ins
   * @param {String} state
   */
  function setState (ins, state) {
    if (!state || !G_STATES[state]) return;
    ins.state = state;
    ins.contianerEl.style.animationName = G_STATES[state];
  }

  /**
   * 
   */
  function setInsCount (ins) {
    var countClass = namespacify('count');
    var contentEl = ins.contianerEl.querySelector('.'+namespacify('content'));
    var countEl = contentEl.querySelector('.'+countClass);

    if (!countEl) {
      countEl = document.createElement('span');
      countEl.classList.add(countClass);
      contentEl.appendChild(countEl);
    }
    countEl.innerHTML = ins.count;
    countEl.style.animationName = '';
    countEl.style.animationName = 'MessageShake';
    ins.timeout = ins.settings.timeout || G_DEFALUTS.timeout;
  }

  /**
   * plugin name
   * @type String
   * @defalut
   */
  var G_PLUGIN = 'flymsg';

  /**
   * namespace for the css
   * @type String
   * @defalut
   */
  var G_NAMESPACE = exports && exports.FLYMSG && exports.FLYMSG.FM_SETTINGS.namespace || G_PLUGIN;

  /**
   * state for the animation
   * @type Object
   * @defalut
   */
  var G_STATES = {
    OPENING: 'flymsgMovein',
    OPENING2: 'flymsgMovein2',
    CLOSING: 'flymsgMoveout'
  }

  /**
   * position: 
   * @type Object
   * @defalut
   */
  var G_DEFALUTS = Object.assign({
    position: 'center',
    type: 'info',
    showClose: false,
    timeout: 2000,
    animation: true,
    autoClose: true,
    content: '',
    onClose: null,
    maxNum: 5,
    html: false,
    animationMode: 'TopToBottom'  // TopToBottom, BottomToTop
  }, exports && exports.FLYMSG && exports.FLYMSG.FM_SETTINGS && exports.FLYMSG.FM_SETTINGS.defaluts || {});

  /**
   * icon for different message type
   */
  var G_ICONS = {
    INFO: '<svg t="1677055357848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12166" width="16" height="16"><path d="M512 505.281561m-499.512195 0a499.512195 499.512195 0 1 0 999.02439 0 499.512195 499.512195 0 1 0-999.02439 0Z" fill="#2196F3" p-id="12167"></path><path d="M464.421463 457.703024h95.157074v261.644488h-95.157074z" fill="#FFFFFF" p-id="12168"></path><path d="M512 326.88078m-59.466927 0a59.466927 59.466927 0 1 0 118.933854 0 59.466927 59.466927 0 1 0-118.933854 0Z" fill="#FFFFFF" p-id="12169"></path></svg>',
    WARNING: '<svg t="1677055441600" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13910" width="16" height="16"><path d="M512.16 192c231.808 0 437.536 296.384 312.16 489.984-128.896 199.04-494.208 200.96-624.352 0-80.448-124.192-28.288-286.528 79.84-389.568l11.36-10.432C352.96 227.456 430.848 192 512.16 192z m-1.76 388.8a48 48 0 1 0 0 96 48 48 0 0 0 0-96z m1.6-256a36.8 36.8 0 0 0-36.8 36.8V512a36.8 36.8 0 1 0 73.6 0v-150.4A36.8 36.8 0 0 0 512 324.8z" fill="#FA6400" p-id="13911"></path><path d="M512 32C191.936 32 32 191.936 32 512c0 320.064 159.936 480 480 480 320.064 0 480-159.936 480-480C992 191.936 832.064 32 512 32z m0 64c284.736 0 416 131.264 416 416s-131.264 416-416 416S96 796.736 96 512 227.264 96 512 96z" fill="#E02020" fill-opacity=".148" p-id="13912"></path></svg>',
    ERROR: '<svg t="1677055534489" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16986" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#FA5151" p-id="16987"></path><path d="M557.3 512l113.1-113.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L512 466.7 398.9 353.6c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L466.7 512 353.6 625.1c-12.5 12.5-12.5 32.8 0 45.3 6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4L512 557.3l113.1 113.1c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4c12.5-12.5 12.5-32.8 0-45.3L557.3 512z" fill="#FFFFFF" p-id="16988"></path></svg>',
    SUCCESS: '<svg t="1677055507298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15445" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#07C160" p-id="15446"></path><path d="M466.7 679.8c-8.5 0-16.6-3.4-22.6-9.4l-181-181.1c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l158.4 158.5 249-249c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L489.3 670.4c-6 6-14.1 9.4-22.6 9.4z" fill="#FFFFFF" p-id="15447"></path></svg>',
    LOADING: '<svg class="animate-turn" t="1677055724358" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23750" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#94BFFF" p-id="23751"></path><path d="M771.656 704.254c-63.656 87.816-164.966 135.53-268.148 133.504-166.044-3.264-306.84-139.13-316.776-306.686C176 349.956 322.15 190.156 503.508 186.26c90.964-1.958 185.35 34.574 248.782 100.036 0.306 0.32 0.612 0.646 0.918 0.97 14.864-9.22 27.612-16.276 38.282-21.66 22.828-11.526 45.574 3.72 46.144 29.416 0.714 31.54-0.488 78.908-8.368 141.336-3.218 25.496-27.186 42.844-52.254 37.822-61.356-12.296-106.42-26.166-135.926-36.856-24.05-8.708-31.198-35.228-13.094-53.356 8.654-8.66 19.65-18.824 33.498-30.406a160.624 160.624 0 0 1-1.284-1.484c-39.2-46.806-85.812-74.81-156.698-72.702-130.898 3.894-234.772 121.146-223.98 251.7 9.632 116.72 108.112 210.332 223.98 213.564 71.172 1.986 141.304-29.198 187.386-87.35 13.908-17.546 32.928-31.252 53.292-22.054a135.776 135.776 0 0 1 12.178 6.304 135.548 135.548 0 0 1 11.506 7.452c18.102 13.128 16.94 37.13 3.786 55.264z" fill="#1677FF" p-id="23752"></path></svg>',
    CLOSE: '<svg t="1677055570286" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19204" width="16" height="16"><path d="M512 1015.741935C233.785806 1015.741935 8.258065 790.214194 8.258065 512S233.785806 8.258065 512 8.258065 1015.741935 233.785806 1015.741935 512 790.214194 1015.741935 512 1015.741935z m0-49.548387c250.846968 0 454.193548-203.346581 454.193548-454.193548S762.846968 57.806452 512 57.806452 57.806452 261.153032 57.806452 512 261.153032 966.193548 512 966.193548z" fill="#0069F6" p-id="19205"></path><path d="M512 476.96929l105.108645-105.108645a24.774194 24.774194 0 0 1 35.03071 35.03071L547.03071 512l105.108645 105.108645a24.774194 24.774194 0 0 1-35.03071 35.03071L512 547.03071l-105.108645 105.108645a24.774194 24.774194 0 0 1-35.03071-35.03071L476.96929 512l-105.108645-105.108645a24.774194 24.774194 0 0 1 35.03071-35.03071L512 476.96929z" fill="#5ED7BC" p-id="19206"></path></svg>'
  }

  /**
   * whether support animation
   * @type {Boolean}
   */
  var G_SUPPORT_ANIMATION = supportCss3('animationName');

  var instanceCounter = 0;
  var instanceArr = [];
  var maxNum = G_DEFALUTS.maxNum || 5;

  /**
   * @param {Object} opts: config
   */
  function Msg (opts) {
    var _this = this;
    _this.settings = Object.assign({}, G_DEFALUTS, opts || {});
    _this.instanceId = instanceCounter;
    var timeout = _this.settings.timeout;
    timeout = timeout && parseInt(timeout) >= 0 && parseInt(timeout) <= Number.POSITIVE_INFINITY ? parseInt(timeout) : G_DEFALUTS.timeout;
    _this.timeout = timeout;
    _this.settings.timeout = timeout;
    _this.timer = null;

    var contianerEl = document.createElement('div');
    var svg = G_ICONS[(_this.settings.type || 'INFO').toUpperCase()];
    var contentClass = namespacify('content__'+ _this.settings.type || 'info');
    contentClass += _this.settings.showClose ? ' ' + namespacify('content__close') : '';
    var content = _this.settings.content || '';
    var svgClose = G_ICONS['CLOSE'];
    var closeTpl = _this.settings.showClose ? '<i class="flymsg-icon flymsg-icon-close">' + svgClose + '</i>' : '';
    var spanEl = document.createElement('span');
    if (_this.settings.html) {
      spanEl.innerHTML = content;
    } else {
      spanEl.innerText = content;
    }

    contianerEl.innerHTML = '<div class="flymsg-content">\
    <div class="' + contentClass + (svg ? ('">\
        <i class="flymsg-icon">' + svg + '</i>') : '"') + spanEl.outerHTML + closeTpl +
    '</div>\
    </div>';

    contianerEl.classList.add(namespacify('box'));
    contianerEl.style.textAlign = _this.settings.position;
    var wrapperEl = document.querySelector('.'+G_NAMESPACE);
    var wrapperEl2 = document.querySelector('.'+namespacify('wrapper2'));
    if (!wrapperEl) {
      wrapperEl = document.createElement('div');
      wrapperEl.classList.add(G_NAMESPACE, namespacify('wrapper'));
      document.body.appendChild(wrapperEl);
    }
    if (!wrapperEl2) {
      wrapperEl2 = document.createElement('div');
      wrapperEl2.classList.add(G_NAMESPACE, namespacify('wrapper2'));
      document.body.appendChild(wrapperEl2);
    }
    
    if (_this.settings.animationMode === 'BottomToTop') {
      wrapperEl2.insertBefore(contianerEl, wrapperEl2.children[0]);
      _this.wrapperEl = wrapperEl2;
    } else {
      wrapperEl.appendChild(contianerEl);
      _this.wrapperEl = wrapperEl;
    }
    
    _this.contianerEl = contianerEl;
    
    if (_this.settings.animationMode === 'BottomToTop') {
      setState(_this, 'OPENING2');
    } else {
      setState(_this, 'OPENING');
    }
    
    if (_this.settings.showClose) {
      contianerEl.querySelector('.flymsg-icon-close').addEventListener('click', function () {
        _this.close();
      }.bind(contianerEl))
    }

    contianerEl.addEventListener('animationend', function (e) {
      var target = e.target;
      var animationName = e.animationName;
      if (animationName === G_STATES['CLOSING']) {
        clearInterval(_this.timer);
        _this.destroy();
      }
      target.style.animationName = '';
      target.style.webkitAnimationName = '';
    }.bind(_this));

    if (_this.settings.autoClose) {
      var frequency = 10;
      _this.timer = setInterval(function () {
        _this.timeout -= frequency;
        if (_this.timeout <= 0) {
          clearInterval(_this.timer);
          _this.close();
        }
      }.bind(_this), frequency);

      _this.contianerEl.addEventListener('mouseover', function () {
        clearInterval(_this.timer);
      }.bind(_this));

      _this.contianerEl.addEventListener('mouseout', function () {
        if (_this.state !== 'CLOSING') {
          _this.timer = setInterval(function () {
            _this.timeout -= frequency;
            if (_this.timeout <= 0) {
              clearInterval(_this.timer);
              _this.close();
            }
          }.bind(_this), frequency);
        }
      }.bind(_this));
    }
  }

  /**
   * @description destroy the element and clear instance and timer
   */
  Msg.prototype.destroy = function () {
    this.contianerEl.parentNode && this.contianerEl.parentNode.removeChild(this.contianerEl);
    clearInterval(this.timer);
    FLYMSG.remove(this.instanceId);
  }

  /**
   * @description triggle close animation
   */
  Msg.prototype.close = function () {
    setState(this, 'CLOSING');
    if (!G_SUPPORT_ANIMATION) {
      this.destroy();
    } else {
      FLYMSG.remove(this.instanceId);
    }
    var callback = this.settings.onClose;
    if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
      callback.call(this);
    }
  }

  /**
   * @description Logic for processing message generation
   * @param {Object} opt: Configuration parameters for messages
   */
  function handleMsg (opt) {
    var ins;
    var insIndex = -1;
    for (var i in instanceArr) {
      var insItem = instanceArr[i];
      if (insItem.config === JSON.stringify(opt)) {
        insIndex = i;
        ins = insItem.instance;
        break;
      }
    }
    if (insIndex < 0) {
      instanceCounter++;
      var insItemObj = {};
      insItemObj.instanceId = instanceCounter;
      insItemObj.config = JSON.stringify(opt);
      ins = new Msg(opt);
      ins.instanceId = instanceCounter;
      ins.count = '';
      insItemObj.instance = ins;
      instanceArr[instanceCounter] = insItemObj;
      var len = instanceArr.length;

      if (len > maxNum) {
        var existIndex = 0;
        for (existIndex; existIndex < len - maxNum; existIndex++) {
          instanceArr[existIndex] && instanceArr[existIndex].instance.settings.autoClose && instanceArr[existIndex].instance.close();
        }
      }
    } else {
      ins.count = !ins.count ? 2 : ins.count >= 99 ? ins.count : ins.count+1;
      setInsCount(ins);
    }
    ins.contianerEl.setAttribute('data-count', ins.count);
    return ins;
  }

  var FLYMSG = {
    version: '1.0.0',
    config: function (opt) {
      if (Object.prototype.toString.call(opt) !== '[object Object]') {
        console.warn('param is not a Object type');
        return;
      }
      G_DEFALUTS = Object.assign(G_DEFALUTS, opt);
      maxNum = G_DEFALUTS.maxNum && G_DEFALUTS.maxNum > 0 ? parseInt(G_DEFALUTS.maxNum) : 5;
    },
    custom: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'custom';
      return handleMsg.call(this, config);
    },
    info: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'info';
      return handleMsg.call(this, config);
    },
    warning: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'warning';
      return handleMsg.call(this, config);
    },
    success: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'success';
      return handleMsg.call(this, config);
    },
    error: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'error';
      return handleMsg.call(this, config);
    },
    loading: function (content, opt) {
      var config = mergeOpt(content, opt);
      config.type = 'loading';
      config.autoClose = false;
      return handleMsg.call(this, config);
    },
    remove: function (instanceId) {
      instanceArr[instanceId] && delete instanceArr[instanceId];
    },
    reset: function () {
      for (var i in instanceArr) {
        instanceArr[i] && instanceArr[i].instance.close();
      }
    }
  }

  return FLYMSG;
});