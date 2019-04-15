import React from 'react';

import { getColor } from 'utils/colors';
import * as THREE from 'three';

import QrReader from 'react-qr-reader'

import {app} from 'base.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faChevronUp, faChevronDown, faBroom, faPlus } from '@fortawesome/free-solid-svg-icons'

import {
	Row,
	Col,

} from 'reactstrap';


import Page from 'components/Page';

const iconStyle = {
	marginLeft: '12px',
	cursor: 'pointer'
}

class ControllerPage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			code: null
		}
		let p = this.props.match.params
		if(p.code){
			this.state.code = p.code
		}
		window.addEventListener('deviceorientation', this.handleOrientation.bind(this));


		var cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]},
			con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] }

		this.remoteConnection = new RTCPeerConnection(cfg, con);
		this.remoteConnection.ondatachannel = this.receiveChannelCallback.bind(this);


		var ref = app.database().ref().child('three/'+ this.state.code + "/offer");
		ref.on("value", (snap)=>{
			snap = snap.val()
			if(snap){
				this.remoteConnection = new RTCPeerConnection(cfg, con);
				this.remoteConnection.ondatachannel = this.receiveChannelCallback.bind(this);
				console.log("Acceting offer")
				this.accept_offer(snap)
			}
		})

	} 
	receiveChannelCallback(event) {
		console.log("receiveChannel set")
		this.receiveChannel = event.channel;
		document.ch = event.channel
		this.receiveChannel.onmessage = (e) => {console.log(e.data)};
		this.receiveChannel.onopen = (e) => {console.log("open")};
		this.receiveChannel.onclose = (e) => {console.log("close")};
		this.messenger = this.receiveChannel
	 }
	accept_offer(offer){
		var offerDesc = new RTCSessionDescription(JSON.parse(offer||"{}"))
		this.remoteConnection.setRemoteDescription(offerDesc)
		.then(() => this.remoteConnection.createAnswer())
		.then(e => {
			var answer = e
			this.remoteConnection.setLocalDescription(answer)


			var ref = app.database().ref().child('three/'+ this.state.code);
			ref.update({answer: JSON.stringify(answer)})
			.then((e)=>{
				console.log("answer created")
			})
		})
		.catch(e=> {console.log("erroe accepting offer")});
	}
	smooth(degree){
		return (degree + 360)%360
	}
	handleOrientation(e){
		let {code} = this.state
		if(!code)
			return
		let pitch = this.smooth(e.beta);
		let roll = this.smooth(e.gamma)
		let yaw = this.smooth(e.alpha)

		this.cube.rotation.x = pitch*Math.PI/180.0
		this.cube.rotation.y = roll*Math.PI/180.0
		this.cube.rotation.z = yaw*Math.PI/180.0
		// Send message
		if(this.messenger)
			this.messenger.send(JSON.stringify({pitch, roll, yaw}))
	}
	

	componentDidMount(){
		if (!this.mount){
			return
		}
		this.initThree()
	}
	initThree(){
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight
		//ADD SCENE
		this.scene = new THREE.Scene()
		//ADD CAMERA
		this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 )
		this.camera.position.z = 4
		//ADD RENDERER
		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setClearColor('#ffffff')
		this.renderer.setSize(width, height)
		this.mount.appendChild(this.renderer.domElement)
		//ADD CUBE
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const material = new THREE.MeshLambertMaterial({ color: '#433F81'     })
		this.cube = new THREE.Mesh(geometry, material)
		this.scene.add(this.cube)

		// Add light
		var alight = new THREE.AmbientLight( 0xffffff ); // soft white light
		this.scene.add( alight );
		var light = new THREE.PointLight( 0xffffff, 1, 0, 1 );
		light.position.set( 0, 0, 2 );
		this.scene.add( light );


		this.start()
	}
	componentWillUnmount(){
		this.stop()
		this.mount.removeChild(this.renderer.domElement)
	}
	start = () => {
		if (!this.frameId) {
			this.frameId = requestAnimationFrame(this.animate)
		}
	}
	stop = () => {
		cancelAnimationFrame(this.frameId)
	}
	animate = () => {
	   // this.cube.rotation.x += 0.01
	   // this.cube.rotation.y += 0.01
	   // this.camera.position.y += 0.01
	   this.renderScene()
	   this.frameId = window.requestAnimationFrame(this.animate)
	}
	renderScene = () => {
		this.renderer.render(this.scene, this.camera)
	}
	handleScan = data => {
		if (data) {
		  this.setState({
			code: data
		  })
		  this.initThree()
		}
	}
	handleError = err => {
		console.error(err)
	}
	render() {
		let {loading, code} = this.state;
		if(loading){
			return (
				<Page className="LoadPage">
					<div style={{width: "100%", height: "100%", left: 0, top: 0, position: "fixed", background: "white"}}>
						<img style={{margin: "auto", marginTop: "30vh", display: "block"}} src="loader.gif" />
					</div>
				</Page>	
			)
		}
		if(!code){
			return (
				<Page className="ControllerPage" style={{width: "100%", zIndex: 10, marginTop: "100px"}}>
					<QrReader
					  delay={300}
					  onError={this.handleError}
					  onScan={this.handleScan}
					  style={{ width: '100%' }}
					/>
			
				</Page>
			)
		}

		return (
			<Page className="ControllerPage" style={{width: "100%", zIndex: 10, marginTop: "100px"}}>
				<p>{this.state.code}</p>
				<div id="mount" style={{ width: '100%', height: '400px' }} ref={(mount) => { this.mount = mount }}/>
			</Page>
		)
	}
}
export default ControllerPage;



