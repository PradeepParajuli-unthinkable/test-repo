(function () {
    if (window.location.search.indexOf('mythdebug') !== -1) console.log('Current path: ', window.location.pathname);

    function debugLog(message) {
        if (window.location.search.indexOf('mythdebug') !== -1) {
            console.log(message)
        }
    }

    // Signal R
    class SignalRMythDev {
        static isSignalREnabled = true;
        static serverURL = "http://localhost:5099";
        //static serverURL = "https://ingest.myth.ad";
        static signalRAutoReconnect = [0, 2000, 5000, 10000];
        static connection = null;
        static messageQueue = [];
        static isConnected = false;
        static connectionId = null;

        init() {
            if (!SignalRMythDev.isSignalREnabled) return;

            window.signalRtag = window.signalRtag || { cmd: [] };

            let signalRUrl = SignalRMythDev.serverURL + "/adhub";
            // Connection
            SignalRMythDev.connection = new signalR.HubConnectionBuilder()
                .withUrl(signalRUrl)
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect(SignalRMythDev.signalRAutoReconnect)
                .build();

            // Start Connection
            SignalRMythDev.connection.start().then(() => {
                SignalRMythDev.isConnected = true;
                this.setSessionDetails();
                //this.flushQueue();
                console.warn("Success");
            }).catch((err) => {
                console.error("SignalR Error Log: ", err.toString());
            });

            // Set session and connection Ids.
            this.receiveMessage("ReceiveIdentifiers", (identifiers) => {
                this.setSignalRSessionInfo(identifiers.sessionId, identifiers.connectionId);
                this.flushQueue();
            });

            // DisconnectReason
            SignalRMythDev.connection.onclose(error => {
                debugLog();
                console.error("Disconnected. Reason:", error?.message || "Unknown");
            });

            this.receiveMessage("updateconnectioncount", (count) => {
                console.warn(`UpdateConnectionCount: ${count}`);
            });


        }

        async loadSignalRScript() {
            // if is already loaded, don't load again
            if (window.signalRtag) {
                return;
            }

            return new Promise((resolve, reject) => {
                let signalRScript = document.createElement('script');
                signalRScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.5/signalr.min.js';
                signalRScript.addEventListener('load', resolve);
                signalRScript.addEventListener('error', reject);
                document.head.appendChild(signalRScript);
            });
        }

        setSignalRSessionInfo(sessionId, connectionId) {
            // set connectionID
            SignalRMythDev.connectionId = connectionId || crypto.randomUUID();

            // set sessionId
            const now = Date.now();
            const maxAge = 24 * 60 * 60 * 1000; // 1 day in ms
            const data = JSON.parse(localStorage.getItem("myth_signalr_session_id") || "{}");

            if (!data || !data.createdAt || now - data.createdAt > maxAge) {
                const now = Date.now();
                localStorage.setItem("myth_signalr_session_id", JSON.stringify({
                    sessionId,
                    createdAt: now
                }));
            }
        }

        getSignalRSessionInfo() {
            const data = JSON.parse(localStorage.getItem("myth_signalr_session_id") || "{}");
            return (data) ? data.sessionId || crypto.randomUUID() : crypto.randomUUID();
        }

        flushQueue() {
            while (SignalRMythDev.messageQueue.length > 0) {
                const { event, data } = SignalRMythDev.messageQueue.shift();

                data.connectionId = SignalRMythDev.connectionId;
                data.sessionId = this.getSignalRSessionInfo();

                SignalRMythDev.connection
                    .invoke(event, data)
                    .catch(err => {
                        console.error("Retry failed:", err);
                        SignalRMythDev.messageQueue.unshift({ event, data });
                    });
            }
        }

        getSlotSize(slot) {
            const sizes = slot?.getSizes();
            if (sizes && sizes.length > 0) {
                return sizes[0].width + 'x' + sizes[0].height;
            }
            return 'Unknown';
        }

        getDeviceType() {
            const ua = navigator.userAgent;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const isTouchEnabled = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

            if (navigator.userAgentData) {
                const uaData = navigator.userAgentData;

                if (uaData.mobile) {
                    if (Math.min(screenWidth, screenHeight) >= 600 && Math.max(screenWidth, screenHeight) >= 768) {
                        return 'tablet';
                    }
                    return 'mobile';
                }

                const platform = uaData.platform ? uaData.platform.toLowerCase() : '';

                if (platform.includes('windows') || platform.includes('mac') || platform.includes('linux') || platform.includes('cros')) {
                    return 'desktop';
                }
                if (platform.includes('android')) {
                    if (Math.min(screenWidth, screenHeight) >= 600) {
                        return 'tablet';
                    }
                    return 'mobile';
                }
                if (platform.includes('ios')) {
                    if (/iPad/i.test(ua)) {
                        return 'tablet';
                    }
                    return 'mobile';
                }
                if (isTouchEnabled && Math.max(screenWidth, screenHeight) < 1024) {
                    return 'tablet';
                }
            }

            if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
                if (/iPad/i.test(ua)) {
                    return 'tablet';
                }
                if (Math.max(screenWidth, screenHeight) >= 768 && Math.min(screenWidth, screenHeight) >= 480) {
                    if (/(Android)/i.test(ua) && Math.min(screenWidth, screenHeight) >= 600) {
                        return 'tablet';
                    }
                }
                return 'mobile';
            }

            if (/Tablet|Nexus 7|Nexus 10|Kindle Fire|SM-T\d+|GT-P\d+|Android [3-9]\.\d|Windows Phone OS 7\.\d|Silk|SCH-I800/i.test(ua)) {
                return 'tablet';
            }

            if (/SmartTV|TV|Xbox|PlayStation|NintendoSwitch|KaiOS|AppleTV|CrOS/i.test(ua)) {
                return 'desktop';
            }

            if (isTouchEnabled) {
                if (Math.max(screenWidth, screenHeight) > 1024) {
                    return 'desktop';
                } else {
                    return 'tablet';
                }
            }

            if (/Win|Mac|Linux|X11/i.test(ua)) {
                return 'desktop';
            }

            return 'desktop';
        }
        
        setSessionDetails() {
            const sessionDetails = {
                connectionId: SignalRMythDev.connectionId,
                sessionId: this.getSignalRSessionInfo(),
                connectionOn: new Date(),
                deviceType: this.getDeviceType(),
                loadTimestamp: new Date().toISOString(),
                domainName: location.host,
                pagePath: location.pathname,
                navigatedFrom: document.referrer,
            };
            console.log("SignalR connected - session stored:", sessionDetails);
            sessionStorage.setItem('jornaldiaSessionDetails', JSON.stringify(sessionDetails));
            this.sendMessage("SetSessionDetails", sessionDetails);
        }

        clearSessionDetails() {
            sessionStorage.removeItem('jornaldiaSessionDetails');
            console.log("SignalR disconnected - session cleared");
        }


        sendMessage(event, data) {
            if (SignalRMythDev.isConnected) {
                SignalRMythDev.connection.invoke(event, data).catch(err => {

                    SignalRMythDev.messageQueue.push({ event, data });
                });
            } else {
                SignalRMythDev.messageQueue.push({ event, data });
            }
        }

        receiveMessage(event, callback) {
            SignalRMythDev.connection.on(event, callback);
        }

        createAdEventModel(event, slotType) {            
            let adSlotId = event?.slot?.getAdUnitPath();
            let adType = adSlotId.includes('/') ? adSlotId.split('/').pop() : '';
            let slot = event?.slot;

            const adEvent = {
                connectionId: SignalRMythDev.connectionId,
                sessionId: this.getSignalRSessionInfo(),
                eventTime: new Date().toISOString(),
                adType: adType,
                adSlotId: adSlotId,
                adSlotType: slotType,
                click: false,

                // Slot info
                slotId: slot?.getSlotElementId(),
                slotName: slot?.getAdUnitPath().split('/').pop(),
                adUnitPath: slot?.getAdUnitPath(),
                slotSize: this.getSlotSize(slot),

                // Default values
                isEmpty: 0,
                visibilityPercentage: 0,
                creativeId: '',
                lineItemId: '',

                // Metrics
                impressionCount: 0,
                viewableImpressionCount: 0,
            };

            return adEvent;
        }
        
        impressionViewableEvent(event, slotType) {
            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.eventType = "ImpressionViewableEvent";
            signalRModel.viewableImpressionCount = 1;
            signalRModel.adExposed = true; // have to remove after update.
            //signalRModel.validImpression = (event && !event.isEmpty) ? true : false;

            this.sendMessage("MonitorEventLog", signalRModel);
        }

        slotRenderEndedEvent(event, slotType)
        {
            if (!event || !event.slot) {
                debugLog("slotRenderEndedEvent skipped—no slot");
                return;
            }

            let signalRModel = this.createAdEventModel(event, slotType);  
            signalRModel.eventType = "SlotRenderEndedEvent";
            signalRModel.isEmpty = event.isEmpty ? 1 : 0;

            if (!event.isEmpty) {
                signalRModel.creativeId = event.creativeId || '';
                signalRModel.lineItemId = event.lineItemId || '';
            }

            signalRModel.lostImpression = (event && !event.isEmpty) ? false : true; // have to remove after update.
            signalRModel.validImpression = (event && !event.isEmpty) ? true : false; // have to remove after update.

            this.sendMessage("MonitorEventLog", signalRModel);
        } 

        adSlotVisibleEvent(event, slotType) {
            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.eventType = "SlotVisibilityChangedEvent";
            signalRModel.visibilityPercentage = event.visibilityPercentage || 0;
            signalRModel.adExposed = true; // have to remove after update.

            this.sendMessage("MonitorEventLog", signalRModel);
        }

        adSlotHiddenEvent(event, slotType, elapsedDuration) {

            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.eventType = "SlotVisibilityChangedEvent";
            signalRModel.visibilityPercentage = event.visibilityPercentage || 0;
            signalRModel.adHidden = true;
            signalRModel.adExposedDuration = elapsedDuration;

            this.sendMessage("MonitorEventLog", signalRModel);
        }

        slotOnloadEvent(event, slotType) {
            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.eventType = "SlotOnloadEvent";

            this.sendMessage("MonitorEventLog", signalRModel);
        }

        slotRequestedEvent(event, slotType) {
            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.impressionCount = 1;
            signalRModel.eventType = "SlotRequestedEvent";

            this.sendMessage("MonitorEventLog", signalRModel);
        }

        slotResponseReceivedEvent(event, slotType) {
            let signalRModel = this.createAdEventModel(event, slotType);
            signalRModel.isEmpty = event.isEmpty ? 1 : 0;

            if (!event.isEmpty) {
                signalRModel.creativeId = event.creativeId || '';
                signalRModel.lineItemId = event.lineItemId || '';
            }
            signalRModel.eventType = "SlotResponseReceivedEvent";

            this.sendMessage("MonitorEventLog", signalRModel);
        }
    }

    // GPT
    class GPTLoader {
        static domain = 'jornaldia.com.br';
        //static contentSlots = [{ "id": 1003, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_1", "display": "/22794149020/jornaldia/jornaldia_content1", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1004, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_2", "display": "/22794149020/jornaldia/jornaldia_content2", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1005, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_3", "display": "/22794149020/jornaldia/jornaldia_content3", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1006, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_4", "display": "/22794149020/jornaldia/jornaldia_content4", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1007, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_5", "display": "/22794149020/jornaldia/jornaldia_content5", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1008, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_6", "display": "/22794149020/jornaldia/jornaldia_content6", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1009, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_7", "display": "/22794149020/jornaldia/jornaldia_content7", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1010, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_8", "display": "/22794149020/jornaldia/jornaldia_content8", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1011, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_9", "display": "/22794149020/jornaldia/jornaldia_content9", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1012, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_10", "display": "/22794149020/jornaldia/jornaldia_content1", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1013, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_11", "display": "/22794149020/jornaldia/jornaldia_content2", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1014, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_12", "display": "/22794149020/jornaldia/jornaldia_content3", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1015, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_13", "display": "/22794149020/jornaldia/jornaldia_content4", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1016, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_14", "display": "/22794149020/jornaldia/jornaldia_content5", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1017, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_15", "display": "/22794149020/jornaldia/jornaldia_content6", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1018, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_16", "display": "/22794149020/jornaldia/jornaldia_content7", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1019, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_17", "display": "/22794149020/jornaldia/jornaldia_content8", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        //{ "id": 1020, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_18", "display": "/22794149020/jornaldia/jornaldia_content9", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }];

        static contentSlots = [{ "id": 1003, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_1", "display": "/22794149020/jornaldia/jornaldia_content1", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1004, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_2", "display": "/22794149020/jornaldia/jornaldia_content2", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1005, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_3", "display": "/22794149020/jornaldia/jornaldia_content3", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1006, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_4", "display": "/22794149020/jornaldia/jornaldia_content4", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1007, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_5", "display": "/22794149020/jornaldia/jornaldia_content5", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1008, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_6", "display": "/22794149020/jornaldia/jornaldia_content6", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1009, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_7", "display": "/22794149020/jornaldia/jornaldia_content7", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }, { "id": 1010, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_8", "display": "/22794149020/jornaldia/jornaldia_content8", "sizesMobile": ["fluid", "336x280", "300x250", "320x100"], "sizesTablet": ["fluid", "336x280", "300x250", "320x100"], "sizes": ["fluid", "336x280", "300x250", "250x250"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 },
        { "id": 1011, "mobile": true, "tablet": true, "desktop": true, "slot": "ad_paragraph_9", "display": "/22794149020/jornaldia/jornaldia_content9", "sizesMobile": ["fluid", "300x250", "336x280", "320x100"], "sizesTablet": ["fluid", "300x250", "336x280", "320x100"], "sizes": ["fluid", "250x250", "300x250", "336x280"], "autoTargeting": false, "refreshIndividually": true, "refresh": true, "refreshTime": 30000, "mythValue": 0.01 }
        ];

        static customSlots = [];
        static fallbackPaths = [];
        static avoids = [];
        static targetting = [];
        static interstitial = { "display": "/22794149020/jornaldia/jornaldia_interstitial", "mythValue": 0.01 };
        static stick = { "display": "/22794149020/jornaldia/jornaldia_stick", "mythValue": 0.01 };
        static usedAdSlots = {};
        static disableCssSizing = false;
        static hideAfterMaxFails = false;
        static categoryAndUserTargeting = false;
        //static imageAds = [{"id":1101, "name": "in-image", "content": "/22794149020/uainoticias/uainoticias_inimage", "target": ".size-large img", "type": 1, "refreshIndividually": true, "refresh": true, "refreshTime": 20000, "mythValue": 0.01 }];

        static imageAds = [
            {
                "id": 1101,
                "name": "in-image-1",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1102,
                "name": "in-image-2",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1103,
                "name": "in-image-3",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1104,
                "name": "in-image-4",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1105,
                "name": "in-image-5",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1106,
                "name": "in-image-6",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1107,
                "name": "in-image-7",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1108,
                "name": "in-image-8",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            },
            {
                "id": 1109,
                "name": "in-image-9",
                "content": "/22794149020/uainoticias/uainoticias_inimage",
                "type": 1,
                "refreshIndividually": true,
                "refresh": true,
                "refreshTime": 20000,
                "mythValue": 0.01
            }
        ];

        static refreshTime = 30000;
        static enableTruvidScript = true;
        static truvidTarget = '.wp-post-image';
        static truvidCode = `<div class="truvidPos"><script async type="text/javascript" src="https://cnt.trvdp.com/js/1646/11775.js"></script></div>`;
        static enableTaboolaScript = false;
        static taboolaScriptId = '';
        static taboolaTarget = '';
        static startTimeout = 1000;
        static enableIngest = true;
        static pageInitTime = Date.now();

        static enableLatestNews = false; // Read more button.
        static latestNewsParagraphId = 2; // After the n number of paragraph readmore button should be added.
        static latestNewsSpacementStyle = 'pixel' || 'pixel';
        static latestNewsSpacementValue = parseInt('50') || 0;
        static latestNewsDivName = 'taboola-latest-news' || '';
        static latestNewsDivColor = '#4CAF50' || '#4CAF50';
        static latestNewsDivSwapColors = ('false' == 'true') ?? false;
        static sentTracing = [];
        static enableIndividualSlotRefresh = true; // Individual Slot Refresh
        static TIMEOUT_FOR_SLOT_REFRESH = 7000;
        static IN_IMAGE_AD_QUERIES = ['figure.aligncenter.size-large img', 'figure.aligncenter.size-full img'];

        constructor() {
            this.MAX_RETRIES = 3; // Maximum number of retries for the original content
            this.TOTAL_WORDS_LENGTH = 50;
            this.slotsRefreshCount = {}; // Stores the refresh count for each slot
            this.fallbackAttemptedSlots = new Set(); // Keeps track of throttled slots
            this.MAX_FALLBACKS = GPTLoader.fallbackPaths.length; // Maximum number of fallbacks based on the number of defined paths
            this.slotsFallbackCount = {}; // Stores the fallback count for each slot

            this.adState = {}; // Per-slot state tracker
            this.minValidTime = 1000; // 1 second
            this.minValidPercent = 80;

            // Update the slot refreshIndividually based on global variable.
            GPTLoader.contentSlots.forEach(slot => { slot["refreshIndividually"] = GPTLoader.enableIndividualSlotRefresh; });

        }

        static location() {
            let url = window.location.origin + window.location.pathname;
            if (url.startsWith('https://')) {
                url = url.substring(8);
            } else if (url.startsWith('http://')) {
                url = url.substring(7);
            }

            if (url.startsWith('www.')) {
                url = url.substring(4);
            }

            return url;
        }

        stringToNumber(str) {
            let hash = 5381;
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) + hash + str.charCodeAt(i);
            }
            let val = hash >>> 0;
            return val.toString();
        }

        async sendTracingData(data) {
            if (!GPTLoader.enableIngest) return;
            if (data.SlotId == null) return;
            if (data.MythValue == null) return;

            // if time elapsed since page load is more than 10 minutes, don't send the data
            let elapsedTime = Date.now() - GPTLoader.pageInitTime;
            if (elapsedTime > 10 * 60 * 1000) return;

            let key = `${data.SlotId}_${data.State}`;
            if (GPTLoader.sentTracing[key]) return;

            GPTLoader.sentTracing[key] = true;

            let url = 'https://analytics.mythneural.com/ingest';
            let device = this.getDevice();

            data.Url = GPTLoader.location();
            data.Device = device;
            data.Domain = GPTLoader.domain;

            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            let result = await response.json();
            return result.message == 'success';
        }

        getDevice() {
            let size = window.innerWidth;
            if (size <= 520) {
                return 'mobile';
            } else if (size <= 820) {
                return 'tablet';
            } else {
                return 'desktop';
            }
        }

        getCurrentPageSkips() {
            // if variable window.adSkips exists, return it
            if (typeof window.adSkips !== 'undefined') {
                return {
                    wholePage: window.adSkips >= 95 ? 1 : 0,
                    skips: window.adSkips
                };
            }
        }

        async init() {
            try {

                let exceptions = [];

                window.googletag = window.googletag || { cmd: [] };

                // Auto-detect divs and insert ad slots
                let shouldSkip = exceptions.find((exception) => exception.path === window.location.pathname);
                let currentPage = this.getCurrentPageSkips();
                if ((shouldSkip && shouldSkip.wholePage === 1) || (currentPage && currentPage.wholePage === 1)) {
                    return;
                }

                googletag.cmd.push(() => {
                    googletag.pubads().enableLazyLoad({
                        fetchMarginPercent: 70,  // Fetch ads when n viewport heights away.
                        renderMarginPercent: 70, // Render ads when n viewport heights away.
                        mobileScaling: 1.5,       // Adjust scaling for mobile devices.
                    });

                    for (let target of GPTLoader.targetting) {
                        let allowed = false; // Disabled targating.
                        if (target.condition && target.condition == 1) {
                            let pageUrl = window.location.href;
                            if (pageUrl.indexOf(target.conditionValue) == -1) {
                                allowed = false;
                            }
                        }

                        if (allowed) {
                            googletag
                                .pubads()
                                .setTargeting(target.key, target.value)
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));
                        }
                    }

                    if (GPTLoader.categoryAndUserTargeting == true) {
                        if (typeof __postCategories != 'undefined') {
                            googletag
                                .pubads()
                                .setTargeting('myth-tracking-category', __postCategories[0])
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));
                        }
                        if (typeof __postAuthor != 'undefined') {
                            googletag
                                .pubads()
                                .setTargeting('myth-tracking-author', __postAuthor)
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));
                        }
                    }

                    googletag
                        .pubads()
                        .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                    // Define out-of-page slots (interstitial and anchor)
                    let anchorSlot, interstitialSlot;
                    if (GPTLoader.interstitial != null) {
                        interstitialSlot = googletag.defineOutOfPageSlot(GPTLoader.interstitial.display, googletag.enums.OutOfPageFormat.INTERSTITIAL);
                        if (interstitialSlot) {
                            interstitialSlot
                                .setTargeting('refresh', 'false')
                                .addService(googletag.pubads())
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                            if (GPTLoader.enableIngest)
                                interstitialSlot.setTargeting('myth_value', GPTLoader.interstitial.mythValue);

                            GPTLoader.interstitial.div = interstitialSlot.getSlotElementId();
                        }
                    }

                    if (GPTLoader.stick != null) {
                        anchorSlot = googletag.defineOutOfPageSlot(GPTLoader.stick.display, googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR);
                        if (anchorSlot) {
                            anchorSlot
                                .setTargeting('refresh', 'true')
                                .addService(googletag.pubads())
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                            if (GPTLoader.enableIngest)
                                anchorSlot.setTargeting('myth_value', GPTLoader.stick.mythValue);

                            GPTLoader.stick.div = anchorSlot.getSlotElementId();
                        }
                    }

                    this.configureCustomSlots();
                    this.configureContentSlots();
                    this.configureImageSlots();

                    //googletag.pubads().enableLazyLoad();
                    //googletag.pubads().enableLazyLoad({ fetchMarginPercent: 70 }); // 0.7 start loading when they are 1.5 viewport heights away from becoming visible.
                    // Enable lazy loading with specific configuration (method-1)


                    //googletag.pubads().enableSingleRequest();
                    googletag.enableServices();

                    googletag.pubads().collapseEmptyDivs(false);

                    if (window.googletag && window.googletag.apiReady) {
                        googletag.pubads().addEventListener('slotRenderEnded', event => {
                            window.mythSignalR.slotRenderEndedEvent(event, this.getSlotType(event));
                            this.handleSlotRenderEnded(event);
                        });
                        googletag.pubads().addEventListener('slotOnload', event => {
                            window.mythSignalR.slotOnloadEvent(event, this.getSlotType(event));
                            this.handleSlotLoadEnded(event);
                        });
                        googletag.pubads().addEventListener('slotVisibilityChanged', event => {
                            this.sendSlotVisibilityChangeBySignalR(event);
                            this.handleSlotVisibilityChanged(event);
                        });
                        googletag.pubads().addEventListener('slotRequested', event => {
                            window.mythSignalR.slotRequestedEvent(event, this.getSlotType(event));
                        });
                        googletag.pubads().addEventListener('slotResponseReceived', event => {
                            window.mythSignalR.slotResponseReceivedEvent(event, this.getSlotType(event));
                        });
                    } else {
                        console.error('GPT API is not ready when trying to set up event listeners.');
                    }

                    if (anchorSlot) {
                        this.executeDisplaySlot(anchorSlot);
                    }

                    if (interstitialSlot) {
                        this.executeDisplaySlot(interstitialSlot);
                    }

                    if (GPTLoader.enableTruvidScript) {
                        this.initTruvidScript();
                    }

                    if (GPTLoader.enableTaboolaScript) {
                        window.addEventListener('load', () => {
                            this.initTaboolaScript();
                        });
                    }

                    this.desplayAllAdSlots();

                    // Auto-refresh ad slots
                    googletag.pubads().addEventListener('impressionViewable', (event) => {
                        window.mythSignalR.impressionViewableEvent(event, this.getSlotType(event));

                        let slot = event.slot;
                        if (window.location.search.indexOf('mythdebug') !== -1) console.log(slot.getSlotElementId() + " is viewable");
                        let isContent = GPTLoader.contentSlots.find(e => e.slot === slot.getSlotElementId());
                        let refreshTime = GPTLoader.refreshTime;

                        let contentSlot = GPTLoader.contentSlots.find(e => e.slot === slot.getSlotElementId());
                        if (contentSlot && contentSlot.refreshIndividually) {
                            if (contentSlot.refresh == false) return;
                            refreshTime = contentSlot.refreshTime;
                        }

                        let imageSlot = GPTLoader.imageAds.find(e => e.div?.id === slot.getSlotElementId());
                        if (imageSlot && imageSlot.refreshIndividually) {
                            if (imageSlot.refresh == false) return;
                            refreshTime = imageSlot.refreshTime;
                        }

                        let customSlot = GPTLoader.customSlots.find(e => e.target === slot.getSlotElementId());
                        if (customSlot && customSlot.refreshIndividually) {
                            if (customSlot.refresh == false) return;
                            refreshTime = customSlot.refreshTime;
                        }

                        setTimeout(() => {
                            googletag.pubads().refresh([slot]);
                            slot.refreshCount++;

                            if (imageSlot) {
                                let element = document.getElementById(`${imageSlot.div.id}`);
                                if (element) {
                                    this.updateOverlayDiv(element, document.querySelector(imageSlot.target));
                                }
                            }
                        }, refreshTime); // Refresh after 20 seconds
                    });

                });

            } catch (error) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.error('[GPTLoader] Failed to initialize GPT:', error);
            }
        }

        initTruvidScript() {
            let element = document.querySelector(GPTLoader.truvidTarget);
            if (!element) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.warn('Failed to find Truvid target element:', GPTLoader.truvidTarget);
                return;
            }

            // let script = document.createElement('div');
            // script.innerHTML = GPTLoader.truvidCode;
            // script.async = true;
            // script.type = 'text/javascript';

            // element.appendChild(script);

            // just add the code directly
            element.innerHTML += GPTLoader.truvidCode;
        }

        initTaboolaScript() {
            let header = document.querySelector('head');
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = `
                window._taboola = window._taboola || [];
                _taboola.push({article:'auto'});
                !function (e, f, u, i) {
                    if (!document.getElementById(i)){
                    e.async = 1;
                    e.src = u;
                    e.id = i;
                    f.parentNode.insertBefore(e, f);
                    }
                }(document.createElement('script'),
                document.getElementsByTagName('script')[0],
                '//cdn.taboola.com/libtrc/${GPTLoader.taboolaScriptId}/loader.js',
                'tb_loader_script');
                if(window.performance && typeof window.performance.mark == 'function')
                    {window.performance.mark('tbl_ic');}
            `;

            header.appendChild(script);

            let element = document.querySelector(GPTLoader.taboolaTarget);
            if (!element) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.warn('Failed to find Taboola target element:', GPTLoader.taboolaTarget);
            } else {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = `
                    window._taboola = window._taboola || [];
                    _taboola.push({
                        mode: 'alternating-thumbnails-a',
                        container: '${GPTLoader.taboolaTarget.replace('#', '').replace('.', '')}',
                        placement: 'Below Article Thumbnails',
                        target_type: 'mix'
                    });
                `;

                element.appendChild(script);
            }

            let body = document.querySelector('body');
            let scriptEnd = document.createElement('script');
            scriptEnd.type = 'text/javascript';
            scriptEnd.innerHTML = `
                window._taboola = window._taboola || [];
                _taboola.push({flush: true});
            `;

            body.appendChild(scriptEnd);
        }

        getSlotDetails(slot) {
            let contentSlot = GPTLoader.contentSlots.find(e => e.slot === slot.getSlotElementId());
            let stickSlot = GPTLoader.stick && GPTLoader.stick.div === slot.getSlotElementId();
            let interstitialSlot = GPTLoader.interstitial && GPTLoader.interstitial.div === slot.getSlotElementId();
            let imageSlot = GPTLoader.imageAds.find(e => e.div?.id === slot.getSlotElementId());
            let customSlot = GPTLoader.customSlots.find(e => e.target === slot.getSlotElementId());
            let slotType = contentSlot ? contentSlot.slot : stickSlot ? 'stick' : interstitialSlot ? 'interstitial' : imageSlot ? `image-${imageSlot.name}` : customSlot ? `custom-${customSlot.type}-${customSlot.originalTarget}` : null;
            return slotType;
        }

        getSlotType(event) {
            if (event && !event.isEmpty) {
                return this.getSlotDetails(event.slot);
            }
            return '';
        }

        getSlotMythValue(slot) {
            let contentSlot = GPTLoader.contentSlots.find(e => e.slot === slot.getSlotElementId());
            let stickSlot = GPTLoader.stick && GPTLoader.stick.div === slot.getSlotElementId();
            let interstitialSlot = GPTLoader.interstitial && GPTLoader.interstitial.div === slot.getSlotElementId();
            let imageSlot = GPTLoader.imageAds.find(e => e.div?.id === slot.getSlotElementId());
            let customSlot = GPTLoader.customSlots.find(e => e.target === slot.getSlotElementId());

            let mythValue = contentSlot ? contentSlot.mythValue : stickSlot ? GPTLoader.stick.mythValue : interstitialSlot ? GPTLoader.interstitial.mythValue : imageSlot ? imageSlot.mythValue : customSlot ? customSlot.mythValue : null;
            return mythValue;
        }

        // Check if the ad slot is currently visible in the viewport
        isElementInView(elementId) {
            let element = document.getElementById(elementId);
            if (!element) {
                return false;
            }
            let rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        async loadGPTScript() {
            // if is already loaded, don't load again
            if (window.googletag && window.googletag.apiReady) {
                return;
            }

            return new Promise((resolve, reject) => {
                let gptScript = document.createElement('script');
                gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
                gptScript.addEventListener('load', resolve);
                gptScript.addEventListener('error', reject);
                document.head.appendChild(gptScript);
            });
        }

        createAdSlot(elName, type = 'div', position = 'beforeBegin') {
            let customId = elName;
            if (type == 'class') {
                customId = elName + '_' + Math.floor(Math.random() * 10000000000000000);
                let element = document.getElementsByClassName(elName)[0];
                if (element) {
                    element.id = customId;
                } else {
                    console.warn(`No element found with class: ${elName}`);
                    return;
                }
            }

            let element = document.getElementById(customId);
            if (!element) {
                console.warn(`No element found with ID: ${customId}`);
                return;
            }

            let newId = customId + '_' + Math.floor(Math.random() * 10000000000000000);
            let newElement = document.createElement('div');
            newElement.id = newId;
            newElement.setAttribute('class', 'ad-wrapper-div');
            if (!GPTLoader.disableCssSizing) newElement.setAttribute('auto-height', 'true');
            newElement.style.textAlign = 'center';
            if (!GPTLoader.disableCssSizing) newElement.style.height = '280px';

            if (position == 'beforeBegin') {
                element.insertAdjacentElement('beforebegin', newElement);
            } else if (position == 'afterEnd') {
                element.insertAdjacentElement('afterend', newElement);
            }

            return newId;
        }

        async configureCustomSlots() {
            let device = this.getDevice();
            for (let i = 0; i < GPTLoader.customSlots.length; i++) {
                // console.log(`loading custom slot ${i}`, GPTLoader.customSlots[i], device);
                let active = GPTLoader.customSlots[i]?.[device];
                if (!active) {
                    continue;
                }

                let id = GPTLoader.customSlots[i].id;
                let slotConfig = GPTLoader.customSlots[i];
                let elName = slotConfig.target;
                let display = slotConfig.display;
                let customCSS = slotConfig.css;
                let slotType = slotConfig.position;
                let type = slotConfig.type;
                let mythValue = slotConfig.mythValue;
                // let sizes = slotConfig.sizes;
                let sizes = device === 'mobile' ? slotConfig.sizesMobile : device === 'tablet' ? slotConfig.sizesTablet : slotConfig.sizes;

                sizes = sizes.map((size) => {
                    if (size.indexOf('x') !== -1) {
                        return size.split('x').map((s) => parseInt(s));
                    } else {
                        return size;
                    }
                });

                slotConfig.originalTarget = elName;

                if (elName && display) {
                    switch (slotType) {
                        case "insideContent":
                            slotConfig.target = this.configureAdSlots(elName, display, sizes, '', type, true, false, customCSS, mythValue);
                            slotConfig.targetElement = document.getElementById(elName);
                            break;
                        case "beforeBegin":
                            elName = this.createAdSlot(elName, type, 'beforeBegin');
                            slotConfig.type = 'div';
                            slotConfig.target = this.configureAdSlots(elName, display, sizes, '', 'div', true, false, customCSS, mythValue);
                            slotConfig.targetElement = document.getElementById(elName);
                            break;
                        case "afterEnd":
                            elName = this.createAdSlot(elName, type, 'afterEnd');
                            slotConfig.type = 'div';
                            slotConfig.target = this.configureAdSlots(elName, display, sizes, '', 'div', true, false, customCSS, mythValue);
                            slotConfig.targetElement = document.getElementById(elName);
                            break;
                        // to be handled other types...
                    }
                }

                slotConfig.target = elName;
                GPTLoader.usedAdSlots[elName] = `custom-${id}`
            }
        }

        // configure content slots
        async configureContentSlots() {
            let device = this.getDevice();
            for (let i = 0; i < GPTLoader.contentSlots.length; i++) {
                let active = GPTLoader.contentSlots[i]?.[device] || true;
                if (!active) {
                    continue;
                }

                if (window.location.search.indexOf('mythdebug') !== -1) console.log("GPTLoader.contentSlots[i].slot: ", GPTLoader.contentSlots[i].slot);
                let elName = GPTLoader.contentSlots[i].slot;
                let divElement = document.getElementById(elName);
                let autoTargeting = GPTLoader.contentSlots[i].autoTargeting;
                // Check if div with the current ID exists
                if (!divElement) {
                    if (window.location.search.indexOf('mythdebug') !== -1) console.warn(`No element found with ID: ${elName}`);
                    continue;
                }
                let display = GPTLoader.contentSlots[i].display;
                // let sizes = GPTLoader.contentSlots[i].sizes;
                let sizes = device === 'mobile' ? GPTLoader.contentSlots[i].sizesMobile : device === 'tablet' ? GPTLoader.contentSlots[i].sizesTablet : GPTLoader.contentSlots[i].sizes;
                sizes = sizes.map((size) => {
                    if (size.indexOf('x') !== -1) {
                        return size.split('x').map((s) => parseInt(s));
                    } else {
                        return size;
                    }
                });

                let mythValue = GPTLoader.contentSlots[i].mythValue;

                if (elName && display) {
                    this.configureAdSlots(elName, display, sizes, undefined, undefined, undefined, autoTargeting, undefined, mythValue);

                    GPTLoader.usedAdSlots[elName] = `slot-${GPTLoader.contentSlots[i].id}`
                }
            }
        }

        // configure content slots
        async desplayAllAdSlots() {
            let exceptions = [];
            let shouldSkip = exceptions.find((exception) => exception.path === window.location.pathname);
            let currentPage = this.getCurrentPageSkips();
            if ((shouldSkip && shouldSkip.wholePage === 1) || (currentPage && currentPage.wholePage === 1)) {
                return;
            }

            for (let slot of GPTLoader.imageAds) {
                if (!document.querySelector(slot.target)) continue;

                if (slot.div && googletag.pubads().getSlots().some(s => s.getSlotElementId() === slot.div.id)) {
                    this.executeDisplaySlot(slot.div.id);
                } else {
                    if (window.location.search.includes("mythdebug"))
                        console.warn(`[GPT] Skipping display for image ad ${slot.div?.id} — slot not defined yet.`);
                }
            }

            for (let i = 0; i < GPTLoader.customSlots.length; i++) {
                let elName = GPTLoader.customSlots[i].target;
                // let divElement = document.getElementById(elName);
                let divElement;
                if (GPTLoader.customSlots[i].type === 'div') {
                    divElement = document.getElementById(elName);
                } else {
                    divElement = document.getElementsByClassName(elName)[0];
                }
                if (elName && divElement) {
                    this.executeDisplaySlot(divElement.id);
                }
            }

            let device = this.getDevice();
            for (let i = 0; i < GPTLoader.contentSlots.length; i++) {
                let active = GPTLoader.contentSlots[i]?.[device] || true;
                if (!active) {
                    continue;
                }

                let elName = GPTLoader.contentSlots[i].slot;
                let divElement = document.getElementById(elName);
                if (elName && divElement) {
                    this.executeDisplaySlot(elName);
                }
            }
        }

        configureImageSlot(slot) {
            if (!googletag.pubads().getSlots().find(adSlot => adSlot.getSlotElementId() == slot.div.id)) {
                googletag.cmd.push(() => {
                    if (slot.type == 1) {
                        let device = (window.innerWidth <= 768) ? 'mobile' : 'desktop';
                        let slotElement, sizes;
                        if (device == 'mobile') {
                            let targetElement = document.querySelector(slot.target);
                            let slotWidth = targetElement.getBoundingClientRect().width;

                            // sizes = [[slotWidth, 50], [slotWidth, 100], slotWidth >= 320 && [320, 50], [100, 100], slotWidth >= 300 && [300, 50], slotWidth >= 250 && [250, 50], slotWidth >= 200 && [200, 50], slotWidth >= 160 && [160, 50], slotWidth >= 120 && [120, 50]];
                            let sizes = [[slotWidth, 50], [slotWidth, 100]];
                            if (slotWidth >= 320) sizes.push([320, 50]);
                            if (slotWidth >= 300) sizes.push([300, 50]);
                            if (slotWidth >= 250) sizes.push([250, 50]);
                            if (slotWidth >= 200) sizes.push([200, 50]);
                            if (slotWidth >= 160) sizes.push([160, 50]);
                            if (slotWidth >= 120) sizes.push([120, 50]);

                            slotElement = googletag.defineSlot(slot.content, sizes, slot.div.id);
                        } else {
                            let slotHeight = Math.floor(slot.div.parentElement.getBoundingClientRect().height / 10) * 10;
                            sizes = [[300, slotHeight], [200, slotHeight], [160, slotHeight], [120, slotHeight]];
                            slotElement = googletag.defineSlot(slot.content, sizes, slot.div.id);
                        }

                        let mapping = googletag.sizeMapping().addSize([0, 0], sizes).build();

                        if (slotElement && mapping !== null) {
                            slotElement = slotElement.defineSizeMapping(mapping);
                        }

                        if (slotElement) {
                            slotElement
                                .setCollapseEmptyDiv(true)
                                .addService(googletag.pubads())
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                            if (GPTLoader.enableIngest)
                                slotElement.setTargeting('myth_value', slot.mythValue);
                        }
                    }
                });
            }
        }

        async configureImageSlots() {
            for (let slot of GPTLoader.imageAds) {
                if (!document.querySelector(slot.target)) continue;
                this.configureImageSlot(slot);
            }
        }

        // configure slots
        configureAdSlots(elName, display, sizes = ['fluid', [250, 250], [300, 250], [336, 280]], customCSS = '', type = 'div', isCustomSlot = false, autoTargeting = false, css = '', mythValue = 0.01) {
            if (!googletag.pubads().getSlots().find(slot => {
                let element = document.getElementById(slot.getSlotElementId());

                return (
                    (type == 'div' && slot.getSlotElementId() === elName) ||
                    (type == 'class' && element && element.classList.contains(elName))
                )
            })) {
                let customId = elName;
                if (type == 'class') {
                    customId = elName + '_' + Math.floor(Math.random() * 10000000000000000);
                    let element = document.getElementsByClassName(elName)[0];
                    if (element) {
                        element.id = customId;
                    } else {
                        console.warn(`No element found with class: ${elName}`);
                        return;
                    }
                }

                googletag.cmd.push(() => {
                    let mapping = googletag.sizeMapping().addSize([0, 0], sizes).build();

                    if (isCustomSlot) {
                        let element = document.getElementById(customId);
                        if (!element) return;

                        this.configureCustomSlot(element);
                    }

                    let slot = googletag.defineSlot(display, sizes.filter(e => e != 'fluid'), customId);
                    // foreach targetting
                    if (autoTargeting && typeof __postCategories != 'undefined') {
                        if (__postCategories.length > 0) {
                            slot
                                .setTargeting('category', __postCategories[0])
                                .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));
                        }

                        slot
                            .setTargeting('author', __postAuthor)
                            .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));
                    }
                    if (slot && mapping !== null && googletag !== null) {
                        slot = slot.defineSizeMapping(mapping);
                    }

                    if (slot) {
                        slot
                            .setCollapseEmptyDiv(true)
                            .addService(googletag.pubads())
                            .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                        if (GPTLoader.enableIngest)
                            slot.setTargeting('myth_value', mythValue);
                        // slot.addService(googletag.pubads());
                    }

                    // Set custom CSS class if provided
                    if (customCSS) {
                        let slotElement = document.getElementById(customId);
                        if (slotElement) {
                            slotElement.classList.add(customCSS);
                        }
                    }

                    if (css && css.length > 0) {
                        let slotElement = document.getElementById(customId);
                        if (slotElement) {
                            // slotElement.style.cssText = css;
                            // add it instead of replacing
                            slotElement.style.cssText += css;
                        }
                    }
                });

                return customId;
            }
        }

        configureCustomSlot(element) {
            if (!element) return;

            element.style.textAlign = 'center';
            if (!GPTLoader.disableCssSizing) element.style.height = '280px';
        }

        // handle slot rendering
        async handleSlotRenderEnded(event) {
            let slot = event.slot;
            let elementId = slot.getSlotElementId();
            let element = document.getElementById(elementId);
            if (!element) return;

            // if (element && element.style && element.style.display === 'none' && element.getAttribute('auto-height')) {
            //     let parent = element.parentElement;
            //     if (parent) {
            //         parent.style.display = 'none';
            //     }
            // }

            const isInImageSlot = GPTLoader.imageAds?.some(e => e.div?.id === elementId);
            if (isInImageSlot && window.location.search.indexOf('mythdebug') !== -1) console.log("image slot", slot);

            try {

                // Initialize refresh and fallback counts for the slot if they haven't been set
                this.slotsRefreshCount[elementId] = this.slotsRefreshCount[elementId] || 0;
                this.slotsFallbackCount[elementId] = this.slotsFallbackCount[elementId] || 0;

                if (event.isEmpty) {
                    setTimeout(() => {
                        if (this.slotsRefreshCount[elementId] < this.MAX_RETRIES) {
                            this.slotsRefreshCount[elementId]++;
                            if (window.location.search.indexOf('mythdebug') !== -1) console.log(`${elementId} slot is empty, retrying (${this.slotsRefreshCount[elementId]}/${this.MAX_RETRIES})`);
                            try {
                                googletag.pubads().refresh([slot]);
                            } catch (error) {
                                if (window.location.search.indexOf('mythdebug') !== -1) console.error(`Failed to reload ad slot ${elementId}:`, error);
                            }
                        } else if (this.slotsFallbackCount[elementId] < this.MAX_FALLBACKS) {
                            // Exclude Stick and Interstitial slots from fallback mechanism
                            if (elementId.includes("Stick") || elementId.includes("Interstitial")
                                || elementId.includes("stick") || elementId.includes("interstitial")) {
                                if (window.location.search.indexOf('mythdebug') !== -1) console.log(`No fallback for ${elementId} as it's a Stick or Interstitial slot.`);
                            } else {
                                if (window.location.search.indexOf('mythdebug') !== -1) console.log(`${elementId} slot is still empty after ${this.MAX_RETRIES} retries, attempting fallback.`);
                                this.slotsFallbackCount[elementId]++;
                                this.loadFallbackContent(slot, elementId);
                            }
                        } else {
                            if (window.location.search.indexOf('mythdebug') !== -1) console.log(`No more fallbacks available for ${elementId}.`);

                            if (GPTLoader.hideAfterMaxFails) {
                                let parent = element.parentElement;
                                if (parent) {
                                    parent.style.display = 'none';
                                }
                            }

                            let slotType = this.getSlotDetails(slot);
                            let mythValue = this.getSlotMythValue(slot);

                            this.sendTracingData({
                                SlotId: slotType,
                                State: 'Empty',
                                FallbackCallsCount: this.slotsFallbackCount[elementId],
                                MythValue: mythValue,
                            });
                        }

                        if (!GPTLoader.hideAfterMaxFails) {
                            element.style.display = '';
                        }
                    }, GPTLoader.TIMEOUT_FOR_SLOT_REFRESH);
                } else {
                    if (window.location.search.indexOf('mythdebug') !== -1) console.log(`Ad slot ${elementId} loaded successfully.`);

                    let imageAd = GPTLoader.imageAds.find(ad => (ad.div ? ad.div.id : '') === elementId);
                    if (imageAd) {
                        imageAd.div.style.display = 'flex';
                        imageAd.div.style.justifyContent = 'end';
                        imageAd.div.style.alignItems = 'center';

                        // find iframe and set height to 100%
                        let iframe = imageAd.div.querySelector('iframe');
                        if (iframe) {
                            // iframe.style.height = '100%';
                        }

                        let closeButton = document.getElementById(`${elementId.replace('__ad-element', '__wrapper-close')}`);
                        if (closeButton) {
                            closeButton.style.display = 'flex';
                        }

                        let wrapper = document.getElementById(`${elementId.replace('__ad-element', '__wrapper')}`);
                        if (wrapper) {
                            wrapper.style.opacity = 1;
                        }
                    }
                }
            } catch (ex) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.error(`Error in handleSlotRenderEnded, elementId: ${elementId}`);
            }
        }

        async loadFallbackContent(slot, elementId) {
            let fallbackIndex = this.slotsFallbackCount[elementId] - 1; // -1 because the count has already been incremented

            let fallbackPath = GPTLoader.fallbackPaths[fallbackIndex];
            if (fallbackPath) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.log(`Loading fallback content for ${elementId}: ${fallbackPath}`);
                try {
                    let currentId = GPTLoader.usedAdSlots[elementId];
                    if (currentId && (fallbackPath.exceptions.includes(currentId) || (currentId.startsWith('custom-') && fallbackPath.exceptions.includes('allcustom')))) {
                        if (window.location.search.indexOf('mythdebug') !== -1) console.log(`Skipping fallback for ${elementId} as it has been marked as exception.`);
                        return;
                    }
                    // console.log('Loading fallback content for ', elementId, ': ', fallbackPath.content, fallbackPath.exceptions)
                    // console.log(GPTLoader.usedAdSlots[elementId])
                    // Clear the original ad slot
                    googletag.destroySlots([slot]);

                    // Define a new slot for the fallback content

                    // let sizes = fallbackPath.sizes;
                    let device = this.getDevice();
                    let sizes = device === 'mobile' ? fallbackPath.sizesMobile : device === 'tablet' ? fallbackPath.sizesTablet : fallbackPath.sizes;
                    sizes = sizes.map((size) => {
                        if (size.indexOf('x') !== -1) {
                            return size.split('x').map((s) => parseInt(s));
                        } else {
                            return size;
                        }
                    });

                    googletag
                        .defineSlot(fallbackPath.content, sizes.filter(e => e != 'fluid'), elementId)
                        .addService(googletag.pubads())
                        .setTargeting('page_unique_id', this.stringToNumber(GPTLoader.location()));

                    if (GPTLoader.enableIngest)
                        googleTag.setTargeting('myth_value', fallbackPath.mythValue)

                    googletag.display(elementId);
                    googletag.pubads().refresh([slot]);
                } catch (error) {
                    if (window.location.search.indexOf('mythdebug') !== -1) console.error(`Failed to load fallback content for ${elementId}:`, error);
                }
            } else {
                if (window.location.search.indexOf('mythdebug') !== -1) console.error(`No fallback path defined for index ${fallbackIndex}`);
            }
        }

        // display slots
        async executeDisplaySlot(elName) {
            googletag.display(elName);
        }

        applyHeight(elementId) {
            let element = document.getElementById(elementId);
            if (!element) return;

            let parent = element.parentElement;
            if (!parent) return;

            let isAutoHeight = parent.getAttribute('auto-height');
            if (isAutoHeight) {
                let currentHeight = parent.style.height;
                currentHeight = currentHeight ? parseInt(currentHeight.replace('px', '')) : 0;
                parent.style.height = 'auto';

                // now get the height
                let dom = parent.getBoundingClientRect();

                // use math max to get the max height, current or previous
                let height = Math.max(dom.height, currentHeight);
                // if height <= 10, set timeout to try again
                if (height <= 10) {
                    setTimeout(() => {
                        this.applyHeight(elementId);
                    }, 1000);
                    return;
                }

                parent.style.height = Math.max(dom.height, currentHeight) + 'px';

                // parent.style.backgroundColor = 'green';
            }
        }

        handleSlotVisibilityChanged(event) {
            let slot = event.slot;
            let slotType = this.getSlotDetails(slot);
            let mythValue = this.getSlotMythValue(slot);
            let elementId = slot.getSlotElementId();
            let isVisible = event.inViewPercentage > 0;

            if (isVisible) {
                this.sendTracingData({
                    SlotId: slotType,
                    State: 'ShownToUser',
                    FallbackCallsCount: 0,
                    MythValue: mythValue,
                });
            }
        }

        async handleSlotLoadEnded(event) {
            let slot = event.slot;
            window.globalxd = slot;
            let elementId = slot.getSlotElementId();
            if (window.location.search.indexOf('mythdebug') !== -1) console.log(`${elementId} slot loaded successfully.`);
            this.applyHeight(elementId);

            let slotType = this.getSlotDetails(slot);
            let mythValue = this.getSlotMythValue(slot);

            this.sendTracingData({
                SlotId: slotType,
                State: 'Loaded',
                FallbackCallsCount: this.slotsFallbackCount[elementId],
                MythValue: mythValue,
            });
        }

        getElementOffset(el) {
            // set position to absolute and to 0px 0px
            el.style.position = 'absolute';
            el.style.top = '0px';
            el.style.left = '0px';

            // get rect
            let rect = el.getBoundingClientRect();

            // add to it the scroll position
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX
            };
        }

        updateOverlayDiv(element, targetElement) {
            let dom = targetElement.getBoundingClientRect();
            let scrollWidth = window.innerWidth - document.documentElement.clientWidth;
            let offset = this.getElementOffset(element);
            element.style.left = (dom.left + window.scrollX - offset.left) + 'px';
            element.style.top = (dom.top + window.scrollY - offset.top) + 'px';
            element.style.height = dom.height + 'px';
            element.style.width = dom.width + 'px';

            // add offset
            let iframe = element.querySelector('iframe');
            if (!iframe) return;
            let parentElement = iframe.parentElement.parentElement;
            let parentDom = parentElement.getBoundingClientRect();
            let iframeDom = iframe.getBoundingClientRect();

            // height
            if (Math.abs(iframeDom.height - parentDom.height) > 7) {
                let computedStyle = window.getComputedStyle(iframe);
                let currentScale = parseFloat(computedStyle.scale);
                if (isNaN(currentScale)) currentScale = 1;
                let newScale = parentDom.height / iframeDom.height * currentScale;
                iframe.style.scale = newScale;
            }

            iframeDom = iframe.getBoundingClientRect();
            parentDom = parentElement.getBoundingClientRect();

            if (iframeDom.width - parentDom.width > 7) {
                let computedStyle = window.getComputedStyle(iframe);
                let currentScale = parseFloat(computedStyle.scale);
                if (isNaN(currentScale)) currentScale = 1;
                let newScale = parentDom.width / iframeDom.width * currentScale;
                iframe.style.scale = newScale;
            }
        }

        createOverlayDiv(target) {
            // console.log('creating overlay div for ', target);
            let targetElement = document.querySelector(target);
            if (!targetElement) {
                console.warn(`No element found with selector: ${target}`);
                return;
            }

            let parent = targetElement.parentElement;
            let elementName = target.slice(1);
            while (elementName.indexOf(' ') != -1) elementName = elementName.replace(' ', '-');

            let id = `${elementName}__wrapper`;
            if (document.getElementById(id)) {
                // console.log(`Overlay div with ID ${id} already exists.`);
                // console.log(document.getElementById(id));
            } else {
                // console.log(`Creating overlay div with ID: ${id}`);
            }

            // wrapper
            let element = document.createElement('div');
            element.id = id;
            element.style.position = 'absolute';
            // element.style.width = '100%';
            element.style.height = '100%';
            element.style.display = 'flex';
            element.style.opacity = 0;
            element.style.justifyContent = 'end';
            // document.body.append(element);
            // append to parent
            parent.append(element);

            let insideWrapper = document.createElement('div');
            element.append(insideWrapper);
            insideWrapper.style.position = 'absolute';
            insideWrapper.style.height = '100%';

            // close button
            let closeButton = document.createElement('div');
            closeButton.innerHTML = '&#10005;';
            closeButton.style.cursor = 'pointer';
            closeButton.style.position = 'absolute';
            closeButton.style.background = '#575757';  // Updated background color
            closeButton.style.top = '3px';
            closeButton.style.left = '3px';
            closeButton.style.width = '30px';
            closeButton.style.height = '30px';
            closeButton.style.justifyContent = 'center';
            closeButton.style.alignItems = 'center';
            closeButton.style.fontSize = '14px';  // Updated font size
            closeButton.style.borderRadius = '50%';  // Added border-radius
            closeButton.style.color = '#fff';  // Added color
            closeButton.style.opacity = '0.6';
            closeButton.style.display = 'none';
            closeButton.id = `${elementName}__wrapper-close`;

            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                element.style.display = 'none';
                return false;
            });

            // ad element
            let adElement = document.createElement('div');
            adElement.id = `${elementName}__ad-element`;
            adElement.style.backgroundColor = 'rgba(65, 65, 65, 0.8)';
            adElement.style.height = '100%';
            adElement.classList.add('in-image-wrapper');
            insideWrapper.append(adElement);
            insideWrapper.append(closeButton);

            this.updateOverlayDiv(element, targetElement);
            setInterval(this.updateOverlayDiv.bind(this), 5000, element, targetElement);
            window.addEventListener('resize', this.updateOverlayDiv.bind(this, element, targetElement));
            window.addEventListener('scroll', this.updateOverlayDiv.bind(this, element, targetElement));

            return adElement;
        }

        loadLatestNewsDiv() {
            if (!GPTLoader.enableLatestNews) {
                return
            };

            let element = document.getElementById(`ad_paragraph_${GPTLoader.latestNewsParagraphId}`);
            if (!element) return console.warn(`No element found with ID: ad_paragraph_${GPTLoader.latestNewsParagraphId}`);

            let insertedElement = null;

            if (GPTLoader.latestNewsSpacementStyle == 'pixel') {
                let div = document.createElement('div');
                div.style.marginTop = `${GPTLoader.latestNewsSpacementValue}px`;
                div.style.height = '90px';
                div.id = GPTLoader.latestNewsDivName;
                element.parentElement.insertAdjacentElement('afterend', div);
                insertedElement = div;
            } else {
                let paragraphs = element.parentElement.parentElement.children;
                let filteredParagraphs = [];
                let found = false;
                for (let p of paragraphs) {
                    if (found && p.tagName == 'P') {
                        filteredParagraphs.push(p);
                    }
                    if (p == element || p == element.parentElement || p == element.parentElement.parentElement) {
                        found = true;
                    }
                }

                // if there are no paragraphs after the current paragraph, return
                if (filteredParagraphs.length == 0) return console.warn('No paragraphs found after the current paragraph');

                // count words in the paragraphs, after it reaches GPTLoader.latestNewsSpacementValue, insert the div.
                let totalWords = 0;
                let insertAfter = null;

                for (let p of filteredParagraphs) {
                    let words = p.textContent.trim().split(/\s+/);
                    totalWords += words.length;
                    if (totalWords >= GPTLoader.latestNewsSpacementValue) {
                        insertAfter = p;
                        break;
                    }
                }

                if (insertAfter) {
                    let div = document.createElement('div');
                    div.id = GPTLoader.latestNewsDivName;
                    insertAfter.insertAdjacentElement('afterend', div);
                    div.style.marginTop = '5px';
                    div.style.marginBottom = '5px';
                    div.style.paddingTop = '5px';
                    insertedElement = div;
                } else {
                    console.warn('No paragraph found to insert the div');
                }
            }

            if (insertedElement) {
                // Button CONTINUAR LENDO
                insertedElement.innerHTML = `<div id="latest-news-button-center"><button id="latest-news-button">CONTINUAR LENDO</button></div>`;
                // add style 
                document.head.innerHTML += `<style>
                    #latest-news-button {
                        background-color: white;
                        border: none;
                        color: ${GPTLoader.latestNewsDivSwapColors ? '#ffffff' : GPTLoader.latestNewsDivColor};
                        box-shadow: 0 1px 2px #cecece;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 13px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 5px;
                        font-weight: 700;
                        transition: background-color 0.3s;
                    }

                    #latest-news-button:hover {
                        background-color: ${GPTLoader.latestNewsDivSwapColors ? GPTLoader.latestNewsDivColor : '#ffffff'};
                    }
                    
                    #latest-news-button-center {
                        display: flex;
                        justify-content: center;
                        padding-block: 1rem;
                        background: #f6f6f6;
                        border-top: 1px solid #dedede;
                        border-bottom: 1px solid #dedede;
                        position: absolute;
                        left: 50%;
                        width: min(100%, 1600px);
                        transform: translateX(-50%);
                    }
                </style>`;

                // get all content inside parent div that is after the inserted element
                let elementsAfter = [];
                let parent = insertedElement.parentElement;
                let found = false;

                for (let i = 0; i < parent.children.length; i++) {
                    let child = parent.children[i];
                    if (found) {
                        elementsAfter.push(child);
                    }
                    if (child == insertedElement) {
                        found = true;
                    }
                }

                // hide all elements after the inserted element
                for (let el of elementsAfter) {
                    el.style.display = 'none';
                }

                // on click, show all elements after the inserted element
                document.getElementById('latest-news-button').addEventListener('click', () => {
                    for (let el of elementsAfter) {
                        el.style.display = '';
                    }
                    this.placeInImageAds();
                    this.desplayAllAdSlots();
                    insertedElement.style.display = 'none';
                });
            }
        }

        autoDiv() {
            let paragraphs = document.getElementsByTagName('p');
            let currentId = 1;
            let totalWords = 0;
            let skipId = 1;
            let paragraphCounter = 0; // Counter for the paragraphs
            let device = this.getDevice();
            let exceptions = [];

            for (let i = 0; i < paragraphs.length; i++) {
                let paragraph = paragraphs[i];
                let paragraphText = paragraph.textContent.trim();
                let words = paragraphText.split(/\s+/);

                totalWords += words.length;

                if (totalWords < this.TOTAL_WORDS_LENGTH) {
                    continue;
                }

                totalWords = 0;

                // Check if the paragraph is within footer or sidebar
                let isInFooter = this.isDescendantOf(paragraph, 'footer');
                let isInSidebar = this.isDescendantWithClass(paragraph, 'sidebar');

                // ignore inside avoids
                let isInsideAvoid = false;
                for (let j = 0; j < GPTLoader.avoids.length; j++) {
                    let avoid = GPTLoader.avoids[j];
                    if (avoid.type == 'class') {
                        if (this.isDescendantWithClass(paragraph, avoid.selector)) {
                            isInsideAvoid = true;
                            break;
                        }
                    } else if (avoid.type == 'id') {
                        if (this.isDescendantOfId(paragraph, avoid.selector)) {
                            isInsideAvoid = true;
                            break;
                        }
                    }
                }
                if (isInsideAvoid) {
                    continue;
                }

                // if (isInFooter || isInSidebar) {
                //     continue; // Skip paragraphs in footer or sidebar
                // }

                let shouldSkip = exceptions.find((exception) => exception.path === window.location.pathname && skipId <= exception.skip);
                let currentPage = this.getCurrentPageSkips();
                shouldSkip = shouldSkip || (currentPage && currentPage.skips > skipId);
                if (shouldSkip) {
                    if (window.location.search.indexOf('mythdebug') !== -1) console.log('Skipping paragraph: ', i);
                    skipId++;
                    continue;
                }

                let wrapperDiv = document.createElement('div');
                wrapperDiv.setAttribute('class', 'ad-wrapper-div');
                wrapperDiv.style.textAlign = 'center';

                // Create Advertisment title
                let adTitle = document.createElement('p');
                adTitle.innerText = 'Advertisment';
                wrapperDiv.appendChild(adTitle);

                let divId = 'ad_paragraph_' + currentId;
                // console.log('creating paragraph ' + divId)

                let div = document.createElement('div');
                if (window.location.search.indexOf('mythdebug') !== -1) console.log('creating div with id: ', divId);
                div.setAttribute('id', divId);
                wrapperDiv.setAttribute('auto-height', 'true');
                // div.setAttribute('style', 'text-align: center; height: 320px;');
                wrapperDiv.style.textAlign = 'center';
                if (!GPTLoader.disableCssSizing) wrapperDiv.style.height = '280px';
                // wrapperDiv.style.backgroundColor = 'red';
                div.innerHTML = '';

                // Append the dynamic div to the wrapper div
                wrapperDiv.appendChild(div);

                // Insert the wrapper div after the current paragraph
                let isActive = GPTLoader.contentSlots[currentId - 1]?.[device] || true;
                if (isActive && currentId < GPTLoader.contentSlots.length) {
                    paragraph.insertAdjacentElement('afterend', wrapperDiv);
                }

                currentId++;

                // Use IntersectionObserver for lazy loading (method-2)
                //let observer = new IntersectionObserver((entries) => {
                //    entries.forEach((entry) => {
                //        if (entry.isIntersecting) {
                //            let adDiv = entry.target;
                //            this.executeDisplaySlot(adDiv.id);
                //            observer.unobserve(adDiv);
                //        }
                //    });
                //}, { threshold: 0.1 });

                // observer.observe(div);
            }
        }

        placeInImageAds() {
            // auto content images
            let contentImageAds = GPTLoader.imageAds.filter(e => e.type == 1);

            if (contentImageAds.length > 0) {
                let contentElementOptions = ['.entry-content'];
                let contentElements = [];
                for (let el of contentElementOptions) {
                    let contentElement = document.querySelectorAll(el)

                    if (contentElement.length > 0) {
                        contentElements = contentElements.concat(Array.from(contentElement));
                    }
                }

                if (contentElements && contentElements.length > 0) {
                    let images = []
                    for (let contentElement of contentElements) {
                        if (GPTLoader.IN_IMAGE_AD_QUERIES && GPTLoader.IN_IMAGE_AD_QUERIES.length > 0) {
                            GPTLoader.IN_IMAGE_AD_QUERIES.forEach((query) => {
                                images = images.concat(Array.from(contentElement.querySelectorAll(query)));
                            });
                        }
                    }

                    let i = 0;
                    for (let image of images) {
                        if (contentImageAds.length == 0) break;

                        let imageAd = (contentImageAds.length > i) ? contentImageAds[i] : contentImageAds[0];
                        let id = `auto-image-${i}`;
                        if (image.id) {
                            id = image.id;
                        } else {
                            image.id = id;
                        }

                        if (document.getElementById(`${id}__wrapper`)) {
                            continue;
                        }

                        let div = this.createOverlayDiv(`#${id}`);
                        imageAd.id = (contentImageAds.length > i) ? imageAd.id : imageAd.id + i;
                        imageAd.div = div;
                        imageAd.target = `#${image.id}`;
                        imageAd.content = (contentImageAds.length > i) ? imageAd.content : imageAd.content + `_${id}`;
                        imageAd.type = 1;

                        i += 1;
                    }
                }
            }

            for (let slot of GPTLoader.imageAds) {
                if (slot.div) continue;
                slot.div = this.createOverlayDiv(slot.target);
            }
        }

        // Function to check if an element is within a specified parent tagName
        isDescendantOf(element, parentTagName) {
            while (element !== null && element.tagName.toLowerCase() !== 'body') {
                if (element.tagName.toLowerCase() === parentTagName) {
                    return true;
                }
                element = element.parentNode;
            }
            return false;
        }

        isDescendantOfId(element, parentId) {
            while (element !== null && element.tagName.toLowerCase() !== 'body') {
                if (element.id === parentId) {
                    return true;
                }
                element = element.parentNode;
            }
            return false;
        }

        // Function to check if an element has a descendant with a specified class name
        isDescendantWithClass(element, className) {
            while (element !== null && element.tagName.toLowerCase() !== 'body') {
                if (element.classList) {
                    // Check if any class in element's classList contains 'sidebar'
                    for (let i = 0; i < element.classList.length; i++) {
                        if (element.classList[i].split(' ').includes(className)) {
                            return true;
                        }
                    }
                }
                element = element.parentNode;
            }
            return false;
        }

        sendSlotVisibilityChangeBySignalR(event) {
            const slotId = event.slot.getAdUnitPath();
            const inView = event.inViewPercentage;
            const now = performance.now();

            if (!this.adState[slotId]) {
                this.adState[slotId] = {
                    visibleSince: null,
                    hasLoggedValid: false,
                    lastVisibleStart: null
                };
            }

            const state = this.adState[slotId];

            // Start timing if visibility is above threshold
            if (inView >= this.minValidPercent) {
                if (!state.visibleSince) {
                    state.visibleSince = now;
                } else {
                    const elapsed = now - state.visibleSince;
                    if (elapsed >= this.minValidTime && !state.hasLoggedValid) {
                        //state.hasLoggedValid = true;

                        console.log(`visible: slotId ${slotId}`);
                        window.mythSignalR.adSlotVisibleEvent(event, this.getSlotType(event));

                    }
                }

                // Track continuous visibility duration
                if (!state.lastVisibleStart) {
                    state.lastVisibleStart = now;
                }

            } else {
                // Start is broken due to drop below threshold
                state.visibleSince = null;
            }

            if (inView === 0) {
                if (state.lastVisibleStart) {
                    const elapsedDuration = (state.lastVisibleStart) ? (now - state.lastVisibleStart) / 1000 : 0;
                    console.log(`hidden: slotId ${slotId}`);
                    window.mythSignalR.adSlotHiddenEvent(event, this.getSlotType(event), Math.round(elapsedDuration));                
                }

                // Reset for next cycle
                state.visibleSince = null;
                state.lastVisibleStart = null;
                state.hasLoggedValid = false;
            }
        }

        // Add custom styling for the ads wrapper in the header.
        addCustomStyling() {
            const style = document.createElement('style');
            style.innerHTML = `
                .ad-in-image-element {
                  position: absolute;
                  display: flex;
                  justify-content: flex-end;
                  align-items: flex-end;
                  z-index: 10;
                }

                .ad-wrapper-div {
                    background-color: #FAF9F9 !important;
                    border: 2px solid #F5F5F5 !important;
                    box-sizing: content-box;
                    float: none !important;
                    line-height: 0px;
                    margin: 15px auto !important;
                    max-width: 100% !important;
                    min-height: 250px;
                    min-width: 100%;
                    height: auto !important;
                    width: auto !important;
                    padding: 10px 0 !important;
                    text-align: center !important;
                }

                .ad-wrapper-div p {
                    font-size: 12px;
                    padding-bottom: 2px;
                    display: block;
                    text-align: center;
                    line-height: 15px;
                }

                @media only screen and (min-width: 1024px) {
                    .ad-wrapper-div {
                        min-width: 728px;
                        min-height: 280px;
                    }
                }

                @media only screen and (min-width: 768px) and (max-width: 1023px) {
                    .ad-wrapper-div {
                        min-width: 468px;
                        min-height: 250px;
                        overflow: visible;
                    }
                }

                @media only screen and (max-width: 767px) {
                    .ad-wrapper-div {
                        min-width: 100%;
                        min-height: 250px;
                        padding-top: 5px !important;
                        padding-bottom: 5px !important;
                        overflow: visible;
                    }

                    .ad-wrapper-div p {
                        font-size: 10px;
                        line-height: 13px;
                    }
                }
            `;
            document.head.appendChild(style);
        }


        async start() {
            try {
                await this.init();
            } catch (error) {
                if (window.location.search.indexOf('mythdebug') !== -1) console.error('[GPTLoader] Failed to load GPT script:', error);
            }
        }
    }

    window.gptLoader = new GPTLoader();

    window.mythSignalR = new SignalRMythDev();
    window.mythSignalR.loadSignalRScript();

    // Load custom styling.
    window.gptLoader.addCustomStyling();

    // Initialize GPT library
    window.gptLoader.loadGPTScript();

    // Start the GPTLoader after the DOM has fully loaded
    document.addEventListener("DOMContentLoaded", function async() {

        window.gptLoader.autoDiv();
        window.gptLoader.loadLatestNewsDiv();
        window.gptLoader.placeInImageAds();
        setTimeout(function () {
            window.mythSignalR.init();
            window.addEventListener('beforeunload', () => {
                if (SignalRMythDev.messageQueue.length > 0) {
                    try {
                        const payload = SignalRMythDev.messageQueue.map(m => m.data);
                        let url = SignalRMythDev.serverURL + '/signalr/finalize';
                        navigator.sendBeacon(url, JSON.stringify(payload));
                        console.log("[Beacon] Sent", payload.length, "events to /signalr/finalize");
                    } catch (err) {
                        console.warn("[Beacon] Failed to send logs on unload:", err);
                    }
                }
            });
            window.gptLoader.start();
        }, GPTLoader.startTimeout); // Wait for 1 second before calling the start() function
    });
})();
