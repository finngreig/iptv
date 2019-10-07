import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Nav from "react-bootstrap/Nav";
import axios from 'axios';
import ReactPlayer from "react-player";
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            selected: ''
        };
        this.chooseChannel = this.chooseChannel.bind(this);
    }

    componentWillMount() {
        axios.get('https://i.mjh.nz/nz/raw-tv.m3u8')
            .then(res => {
                this.setState({
                    channels: this.m3uToObj(res.data)
                })
            })
    }

    m3uToObj(m3u) {
        console.log(m3u);
        return m3u
            .replace('#EXTM3U', '')
            .split('#EXTINF:-1 ')
            .slice(1)
            .map(function (str, index) {
                const line = str.split(',');
                const info = line[1].split('\n');

                return {
                    "id": index + 1,
                    "title": info[0],
                    "streaming_url": info[1],
                };
            });
    }

    chooseChannel(e, channel) {
        e.preventDefault();
        this.setState({
            selected: channel.streaming_url
        })
    }

    render() {
        const channels = this.state.channels.map(ch => (
            <NavDropdown.Item onClick={(e) => this.chooseChannel(e, ch)}>{ch.title}</NavDropdown.Item>));
        return (
            <Container fluid style={{backgroundColor: 'black'}}>
                <Navbar bg="dark" variant="dark">
                    <NavbarBrand>IPTV</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavDropdown id="channelDropdown" title="Channels">
                            {channels}
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <ReactPlayer className="player-wrapper" url={this.state.selected} controls playing width='100%'
                             height='100%'/>
            </Container>
        );
    }
}

export default App;
