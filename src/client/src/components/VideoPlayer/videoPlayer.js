import React , { Component } from 'react'
import { Player, ControlBar , VolumeMenuButton , FullscreenToggle , CurrentTimeDisplay , DurationDisplay , TimeDivider } from 'video-react';

export class VideoPlayer extends Component {
    constructor(props) {
      super(props)

      this.state = { source : this.props.src }
      this.hideDefaultControls = this.props.hideDefaultControls
    }

    componentDidUpdate(prevProps) {
      if(this.props.hideDefaultControls !== prevProps.hideDefaultControls) {
        this.hideDefaultControls = this.props.hideDefaultControls
      }
    }

    componentDidMount() {
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
        
        if(this.hideDefaultControls) {
          const fullScreenToggle = document.querySelector(".video-react .video-react-fullscreen-control")
          fullScreenToggle.style.marginLeft = "auto";
        }
    }

    setMuted(muted) {
        return () => {
          this.player.muted = muted;
        };
    }

    didOwnerChangeVideoDuration(oldDuration , newDuration) {
        if((newDuration - oldDuration) > 1 || (newDuration - oldDuration) < -1) {
            this.props.manualDurationChangeHandler &&
              this.props.manualDurationChangeHandler(newDuration);
        }
    }

    handleStateChange(state, prevState) {  
        if(this.state.player && this.state.player.currentTime) {
            this.didOwnerChangeVideoDuration(this.state.player.currentTime , state.currentTime)
        }

        this.setState({
            player: state
        });
        
        this.props.handleStateChange && this.props.handleStateChange(state, prevState, this.player);
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
        }
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
            <Player ref={player => { this.player = player;}} {...this.props}>
              <ControlBar disableDefaultControls={this.hideDefaultControls}>
                  { this.hideDefaultControls && <VolumeMenuButton/> }
                  { this.hideDefaultControls && <CurrentTimeDisplay/> }
                  { this.hideDefaultControls && <TimeDivider/> }
                  { this.hideDefaultControls && <DurationDisplay/> }
                  { this.hideDefaultControls && <FullscreenToggle/> }
              </ControlBar>
          </Player>
        )
    }
}