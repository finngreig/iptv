/* eslint-disable no-undef */
import React, { Component } from 'react';

class CastButton extends Component {

    constructor(props) {
        super(props);
        this.castSession = null;
        this.player = null;
        this.playerController = null;

        this.scriptLoaded = this.scriptLoaded.bind(this);
    }

    componentDidMount() {
        document.getElementById('cast-button-container').appendChild(document.createElement('google-cast-launcher'));

        const script = document.createElement("script");
        script.src = "//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
        script.async = true;
        script.onload = () => this.scriptLoaded();
        document.body.appendChild(script);
    }

    scriptLoaded() {
        window['__onGCastApiAvailable'] = function(isAvailable) {
            if (isAvailable) {
                cast.framework.CastContext.getInstance().setOptions({
                    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
                });
                this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            }
        }.bind(this);
    }

    playMedia(mediaURL, mimeType) {
        if (this.castSession) {
            const mediaInfo = new chrome.cast.media.MediaInfo(mediaURL, mimeType);
            const request = new chrome.cast.media.LoadRequest(mediaInfo);
            this.castSession.loadMedia(request).then(
                () => console.log(`Casted media at ${mediaURL}`)
            ).catch(
                () => console.error(`Could not cast media at ${mediaURL}`)
            );

            this.player = new cast.framework.RemotePlayer();
            this.playerController = new cast.framework.RemotePlayerController(this.player);
        }
    }

    play() {
        if (this.player.isPaused) {
            this.playerController.playOrPause();
        }
    }

    pause() {
        if (!this.player.isPaused) {
            this.playerController.playOrPause();
        }
    }

    stop() {
        this.playerController.stop();
    }

    render() {
        return (
            <div id="cast-button-container" style={{height: '25px', width: '25px'}}></div>
        )
    }
}

export default CastButton;
