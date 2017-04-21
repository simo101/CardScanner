define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";
    return declare("CardScanner.widget.CardScanner", [ _WidgetBase ], {
        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
         if (typeof window.CardIO !== "undefined") {
            window.self = this;
            CardIO.canScan(this.onCardIOCheck);
         }
        },
        
        onCardIOCheck : function (canScan) {
            console.log("card.io canScan? " + canScan);
            var scanBtn = window.document.getElementsByClassName(window.self.btnClass)[0];
            if (!canScan) {
              scanBtn.innerHTML = "Manual entry";
            }
            scanBtn.onclick = function (e) {
              CardIO.scan({
                  "requireExpire":window.self.requireExpiry,
                  "requireCVV":window.self.requireCVV,
                  "requirePostalCode":window.self.requirePostalCode,
                  "suppressManual":window.self.suppressManual,
                  "restrictPostalCodeToNumericOnly":window.self.restrictPostalCodeToNumericOnly,
                  "keepApplicationTheme":window.self.keepApplicationTheme,
                  "requireCardholderName":window.self.requireCardholderName,
                  "scanInstructions":window.self.scanInstructions,
                  "noCamera":window.self.noCamera,
                  "scanExpiry":window.self.scanExpiry,
                  "guideColor":window.self.guideColor,
                  "suppressConfirmation":window.self.suppressConfirmation,
                  "hideCardIOLogo":window.self.hideCardIOLogo,
                  "useCardIOLogo":window.self.useCardIOLogo
                },
                window.self.onCardIOComplete,
                window.self.onCardIOCancel
              );
            }
          },

        onCardIOComplete : function(response) {
            var cardIOResponseFields = [
                "cardType",
                "redactedCardNumber",
                "cardNumber",
                "expiryMonth",
                "expiryYear",
                "cvv",
                "postalCode"
            ];
            console.log("card.io scan complete");
            for (var i = 0, len = cardIOResponseFields.length; i < len; i++) {
              var field = cardIOResponseFields[i];
              if(field == "redactedCardNumber"){
                  window.self._contextObj.set(window.self.cardNumber,response[field]);
              }
            }
          },

        onCardIOCancel: function() {
            console.log("card.io scan cancelled");
          },


        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },
        
        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },
        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
require(["CardScanner/widget/CardScanner"]);
