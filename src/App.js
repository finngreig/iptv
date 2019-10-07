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
import Splash from "./components/Splash";

// these channels are excluded as their CORS policies don't allow them to load
const excludedChannels = [
    "PRIME",
    "Choice TV",
    "HGTV",
    "Chinese TV28",
    "Chinese TV29",
    "APNA Television",
    "Panda TV"
];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            selected: null
        };
        this.chooseChannel = this.chooseChannel.bind(this);
    }

    componentDidMount() {
        axios.get('https://i.mjh.nz/nz/raw-tv.m3u8')
            .then(res => {
                this.setState({
                    channels: this.m3uToObj(res.data)
                })
            })
    }

    m3uToObj(m3u) {
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
            })
            .filter(ch => !excludedChannels.includes(ch.title));
    }

    chooseChannel(e, channel) {
        e.preventDefault();
        this.setState({
            selected: channel
        })
    }

    render() {
        const channels = this.state.channels.map(ch => (
            <NavDropdown.Item key={ch.id} onClick={(e) => this.chooseChannel(e, ch)}>{ch.title}</NavDropdown.Item>));

        return (
            <Container fluid style={{backgroundColor: 'black'}}>
                <Navbar bg="dark" variant="dark">
                    <NavbarBrand>Freeview NZ</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavDropdown id="channelDropdown" title="Channels">
                            {channels}
                        </NavDropdown>
                    </Nav>
                    {this.state.selected ?
                        <Navbar.Text>
                            Currently Playing: {this.state.selected.title}
                        </Navbar.Text>
                    : null}
                </Navbar>
                <ReactPlayer className="player-wrapper" url={this.state.selected ? this.state.selected.streaming_url : ''} controls playing width='100%'
                             height='100%'/>
                {this.state.selected === null ? <Splash/> : null}
            </Container>
        );
    }
}

export default App;
