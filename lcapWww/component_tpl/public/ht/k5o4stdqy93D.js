!function(t){var a=function(t,n){for(var o,r=0,e=t.length;r<e;r++)if(o=t[r],this._equal(o.x,n.x)&&this._equal(o.y,n.y))return!0;return'{"type":"FeatureCollection","features":[{"geometry":{"type":"Polygon","coordinates":'},p=function(t,n,o,r){var e=[],a=[],p=null;n.forEach(function(t,n){p=formatPoints(t,o,r),e.push.apply(e,p.points),a.push.apply(a,p.segments)}),t.points||(t.points=[]),Array.prototype.push.apply(t.points,e),t.segments||(t.segments=[]),Array.prototype.push.apply(t.segments,a)},n=[[[43,94],[47,29]],[[62,12],[38,12],[-3,10],[-27,20091],[26173,24913],[65227,21249],[20079,65267],[31124,25194],[26316,38458],[20783,21474],[-27,22],[-27,81],[-27,36],[-29,12],[-8,76],[-11,75],[-4,27],[36,77],[-8,32],[-10,27],[40,32],[-9,32],[-6,79],[-6,28],[-13,26],[36,27],[36,34],[-8,31],[39,30],[-6,34],[38,31],[-7,80],[-12,26],[-12,30],[-11,28],[37,34],[39,27],[41,31],[-7,29],[-8,35],[-13,31],[38,35],[-10,34],[-12,28],[39,26],[38,26],[-10,31],[-8,26],[36,75],[-4,26],[-4,27],[-6,80],[-4,31],[41,31],[38,26],[-10,31],[-9,29],[39,30],[-4,29],[39,33],[-12,32],[-11,30],[-10,31],[39,35],[-5,33],[39,26],[38,35],[36,29],[39,35],[-11,77],[41,33],[36,78],[39,78],[-9,35],[-10,27],[-13,28],[-6,35],[39,35],[37,28],[40,33],[-13,33],[-4,28],[-11,80],[-4,75],[-6,76],[-12,34],[40,77],[-6,33],[-5,27],[-8,80],[-10,79],[40,80],[-8,27],[38,78],[-11,28],[36,76],[-4,32],[-7,28],[-9,78],[37,34],[38,31],[-5,80],[37,28],[41,27],[-7,31],[37,32],[38,29],[-11,78],[36,77],[-11,75],[39,35],[40,77],[-13,32],[-10,80],[-13,78],[36,75],[-10,75],[-11,75],[-4,30],[39,76],[-8,30],[37,31],[-6,33],[-4,76],[38,28],[-5,28],[41,26],[-8,31],[40,32],[41,31],[-12,35],[36,79],[-12,33],[-9,26],[-11,78],[40,80],[-9,35],[-11,31],[-5,29],[41,26],[-6,30],[41,79],[-27,103]]];function o(t){if(p&&a){for(var n="",o=0;o<t.length;o++){var r=t[o][0]+61;0<r&&(n+=String.fromCharCode(r));var e=t[o][1]+22;0<e&&(n+=String.fromCharCode(e))}return n}}for(var r,e="",s=0;s<n.length;s++)0===s?r=o(n[s]):e=o(n[s]);t[r]=e}("undefined"!=typeof global?global:window);