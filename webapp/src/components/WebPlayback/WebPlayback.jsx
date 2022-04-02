import React from 'react';
import {useState, useEffect} from 'react';
import {Button, Image} from '@mantine/core';
const track = {
    name: "",
    album: {
        images: [
            {url: ""}
        ]
    },
    artists:[
        {name: ""}
    ]
}

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    useEffect(()=> {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => {  cb(props.token) },
                volume: 1.0
            });

            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {
                if(!state){
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => {
                    (!state)? setActive(false) : setActive(true)
                });
            }));
            player.connect();

        }
    }, []);


    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>
        )} else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                    <Image radius="md" height = {500} src = {current_track.album.images[0].url} alt=""></Image>
                        {/* <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" /> */}

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            {/* <button className="btn-spotify" onClick={() => { player.previousTrack() }} > */}
                                
                            {/* </button> */}
                            <Button color="green" onClick={() => { player.previousTrack() }}> &lt; </Button>

                            &nbsp;&nbsp;&nbsp;

                            {/* <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button> */}

                            <Button color="green" onClick = {() => {player.togglePlay()}}>
                                {is_paused ? "PLAY" : "PAUSE"}
                            </Button>
                            {/* <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button> */}
                            &nbsp;&nbsp;&nbsp;

                            <Button color="green" onClick = {() => {player.nextTrack()}}> &gt; </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback