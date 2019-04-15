import React from 'react';

import { getColor } from 'utils/colors';
import * as THREE from 'three';
import * as QRCode from 'qrcode.react';

// var QRCode = require('qrcode.react');

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

class ThreePage extends React.Component {
	constructor(props){
		super(props)
		let p = this.props.match.params
		this.state = {
			loading: false,
			code: null
		}
		if(!p.code){
			var code = (Math.ceil(Math.random()*8999) + 1000).toString()
			this.props.history.push('/' + code)
			window.location.reload();
			return 0
		}
		this.state.code = p.code
		// window.addEventListener('deviceorientation', this.handleOrientation.bind(this));




		var ref = app.database().ref().child('three/'+ this.state.code + "/answer");
		ref.on("value",(snap)=>{
			snap = snap.val()
			if(snap){
				console.log("connecting answer")
				this.answer_success(snap)
			}
		})
		this.initConnection()
	} 
	initConnection(){

		var cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]},
    		con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] }

    	this.localConnection = new RTCPeerConnection(cfg, con);


    	this.sendChannel = this.localConnection.createDataChannel("sendChannel");

		this.sendChannel.onopen = e=>{console.log("channel open")};
		this.sendChannel.onclose = e=>{console.log("channel close")};
		this.sendChannel.onmessage = this.onmessage.bind(this);
		document.ch = this.sendChannel

		this.localConnection.onicecandidate = e => {

			var ref = app.database().ref().child('three/'+ this.state.code);
			ref.set({offer: JSON.stringify(this.localConnection.localDescription)})
			.then((e)=>{
				// console.log("offer created")
			})
		}

		this.create_offer()
	}
	create_offer(){
		this.localConnection.createOffer()
		.then(e => {
			this.offer = e
			// Send to fire base
			// console.log(JSON.stringify(e))

			this.localConnection.setLocalDescription(e)

		})
		.catch(e=>{console.log("offer error")});
    }
    answer_success(answer){
		var answerDesc = new RTCSessionDescription(JSON.parse(answer||"{}"))

		this.localConnection.setRemoteDescription(answerDesc)
		.catch(e=>{console.log("answer error", e); this.initConnection()});
    }
    onmessage(e){
    	let {pitch, roll, yaw} = JSON.parse(e.data);
		this.cube.rotation.x = pitch*Math.PI/180.0
		this.cube.rotation.y = roll*Math.PI/180.0
		this.cube.rotation.z = yaw*Math.PI/180.0
    }
	// handleOrientation(e){
	// 	let pitch = e.beta;
	// 	let roll = e.gamma
	// 	let yaw = e.alpha
	// 	this.cube.rotation.x = pitch*Math.PI/180.0
	// 	this.cube.rotation.y = roll*Math.PI/180.0
	// 	this.cube.rotation.z = yaw*Math.PI/180.0
	// }
	

	componentDidMount(){
		if (!this.mount){
			return
		}

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
	render() {
		let {loading, code} = this.state;
		if(loading || !code){
			return (
				<Page className="LoadPage">
					<div style={{width: "100%", height: "100%", left: 0, top: 0, position: "fixed", background: "white"}}>
						<img style={{margin: "auto", marginTop: "30vh", display: "block"}} src="loader.gif" />
					</div>
				</Page>	
			)
		}

		return (
			<Page className="ThreePage" style={{width: "100%", zIndex: 10, marginTop: "100px"}}>
				<QRCode value={code} />
				<div id="mount" style={{ width: '100%', height: '400px' }} ref={(mount) => { this.mount = mount }}/>
			</Page>
		)
	}
}
export default ThreePage;



