"use strict";

const {components, Cc, Ci} = require( "chrome" );

var { ActionButton } = require( "sdk/ui/button/action" ),
	tabs = require( "sdk/tabs" ),
	observerService = Cc[ "@mozilla.org/observer-service;1" ].getService( Ci.nsIObserverService ),
	button, observeHandler, btnClickHandler;


btnClickHandler = function( state ) {
	observerService.addObserver( observeHandler, "http-on-examine-response", false );
	tabs.activeTab.reload();
	
	tabs.activeTab.on( "close", function() {
		observerService.removeObserver( observeHandler, "http-on-examine-response" );
	});	
};

observeHandler = {
	observe: function( subject, topic, data ) {
		if ( topic === "http-on-examine-response" ) {
			var httpChannel = subject.QueryInterface( Ci.nsIHttpChannel );			
			httpChannel.setResponseHeader( "Access-Control-Allow-Origin", "*", false );
			httpChannel.setResponseHeader( "Access-Control-Allow-Methods", "POST,GET", false );
		}
	}
};

button = ActionButton({
	id: "Button-Disable-CORS",
	label: "Disable CORS",
	icon: "./disable-cors.svg",
	onClick: btnClickHandler
});
