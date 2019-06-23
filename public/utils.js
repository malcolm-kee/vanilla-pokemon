var utils = (function() {
  function noop() {}

  function ajax(url, options) {
    var opts = options || {};
    var onSuccess = opts.onSuccess || noop;
    var onError = opts.onError || noop;
    var dataType = opts.dataType || 'json';
    var method = opts.method || 'GET';

    var request = new XMLHttpRequest();
    request.open(method, url);
    if (dataType === 'json') {
      request.overrideMimeType('application/json');
      request.responseType = 'json';
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    }

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        onSuccess(request.response);
      } else {
        onError(request.response);
      }
    };

    request.onerror = onError;

    request.send(opts.body);
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function addClass($el, className) {
    $el && $el.classList.add(className);
  }

  function toggleClass($el, className) {
    $el && $el.classList.toggle(className);
  }

  function removeClass($el, className) {
    $el && $el.classList.remove(className);
  }

  function remove($els) {
    if ($els) {
      Array.prototype.forEach.call($els, function(node) {
        node.parentNode.removeChild(node);
      });
    }
  }

  return {
    noop,
    ajax,
    $,
    addClass,
    toggleClass,
    removeClass,
    remove
  };
})();
