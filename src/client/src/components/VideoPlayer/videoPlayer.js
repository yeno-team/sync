import React , { Component } from 'react'
import { Player, ControlBar } from 'video-react';

export default class VideoPlayer extends Component {
    constructor(props) {
        super(props)

        this.state = { source : this.props.src } // Holds 
        // this.play = this.play.bind(this);
        // this.pause = this.pause.bind(this);
        // this.load = this.load.bind(this);
        // this.changeCurrentTime = this.changeCurrentTime.bind(this);
        // this.seek = this.seek.bind(this);
        // this.changePlaybackRateRate = this.changePlaybackRateRate.bind(this);
        // this.changeVolume = this.changeVolume.bind(this);
        // this.setMuted = this.setMuted.bind(this);
    }

    componentDidMount() {
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    }

    setMuted(muted) {
        return () => {
          this.player.muted = muted;
        };
    }

    didOwnerChangeVideoDuration(oldDuration , newDuration) {
        if((newDuration - oldDuration) > 1 || (newDuration - oldDuration) < -1) this.props.manualDurationChangeHandler()
    }

    handleStateChange(state) {  
        if(this.state.player && this.state.player.currentTime) {
            this.didOwnerChangeVideoDuration(this.state.player.currentTime , state.currentTime)
        }

        this.setState({
            player: state
        })
    }
    
    play() {
        this.player.play();
    }
    
    pause() {
        this.player.pause();
    }
    
    load() {
        this.player.load();
    }
    
    changeCurrentTime(seconds) {
        return () => {
          const { player } = this.player.getState();
          this.player.seek(player.currentTime + seconds);
        };
      }
    
    seek(seconds) {
        return () => {
          this.player.seek(seconds);
        };
      }
    
    changePlaybackRateRate(steps) {
        return () => {
          const { player } = this.player.getState();
          this.player.playbackRate = player.playbackRate + steps;
        };
      }
    
    changeVolume(steps) {
        return () => {
          const { player } = this.player.getState();
          this.player.volume = player.volume + steps;
        };
    }
    
    render() {
        return(
            <Player
            ref={player => {
                this.player = player;
            }} {...this.props} 
            >
            <ControlBar autoHide={false} />
        </Player>
        )
    }
}