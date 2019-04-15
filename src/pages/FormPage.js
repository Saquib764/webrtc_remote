import React from 'react';

import { getColor } from 'utils/colors';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';


import {app} from 'base.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faChevronUp, faChevronDown, faBroom, faPlus } from '@fortawesome/free-solid-svg-icons'

import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	CardSubtitle,
	Row,
	Col,
	ListGroup,
	ListGroupItem,
	Badge,
	Button,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	UncontrolledButtonDropdown,
	Input,
	InputGroup,

	Form,
	FormGroup,
	Label,
	FormText,
	FormFeedback,
} from 'reactstrap';

import {
	MdInsertChart,
	MdBubbleChart,
	MdPieChart,
	MdShowChart,
	MdPersonPin,
} from 'react-icons/lib/md';


import Page from 'components/Page';

const iconStyle = {
	marginLeft: '12px',
	cursor: 'pointer'
}

class FormPage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			loading: true,
			name: "",
			type: 'text',
			required: false,
			current: 0,

			typeName: "",
			typeValue: "",

			options: [],
			fields: [],

			create: false
		}

	}

	componentWillMount(){
	}

	componentDidMount() {
		let p = this.props.match.params

		if(!p.id){
			// Generate id and redirect
			this.setState({create: true, loading: false})
			return 
		}
		app.database().ref().child('form/'+p.id + "/fields").once("value")
		.then((fields)=>{
			fields = fields.val()
			if(!fields){
				// Wrong id
				this.props.history.push('/')
				this.setState({loading: false})
				return
			}
			let current = fields.length
			fields.forEach((f)=>{f.options = f.options || []})
			let loading = false

			this.setState({fields, current, loading})
		})
		.catch((e)=>{
			console.log(e)
		})

		// this is needed, because InfiniteCalendar forces window scroll

	}
	renderField(i, field, control = true){
		var render_control = null
		var {fields}  = this.state
		if(control){
			var up = null
			if(i > 0)
				up = <FontAwesomeIcon onClick={this.move.bind(this, fields, i, -1, "fields")} style={iconStyle} icon={faChevronUp}/>
			var down = null
			if(i < fields.length - 1)
				down = <FontAwesomeIcon onClick={this.move.bind(this, fields, i, 1, "fields")} style={iconStyle} icon={faChevronDown}/>
			
			render_control = <div className="control" style={{position: "absolute", right: "10px"}}>
					<FormGroup>	
							<FontAwesomeIcon onClick={this.edit.bind(this, i)} style={iconStyle} icon={faEdit}/>
							<FontAwesomeIcon onClick={this.delete.bind(this, fields, i, "fields")} style={iconStyle} icon={faTrash}/>
							{up}
							{down}
					</FormGroup>
				</div>
		}

		var row = <div className="previewRow" key={i} style={{display: "flex"}}>
				<div style={{width: '100%'}}>
					<FormGroup>	
						<Label for="Name">{field.name}</Label>												  
						<Input type={field.type} />
					</FormGroup>
				</div>
				{render_control}
			</div>


		if(field.type == "select"){
			var options = []
			for(var k=0; k<field.options.length; k++){
				var op = field.options[k]
				options.push(<option key={k} value={op.value}>{op.name}</option>)
			}
			row = <div className="previewRow" key={i} style={{display: "flex"}}>
					<div style={{width: '100%'}}>
						<FormGroup>
						  <Label for="exampleEmail">{field.name}</Label>
							<select className="form-control">
								{options}
							</select>

						</FormGroup>
					</div>
					{render_control}
				</div>
		}

		if(field.type == "radio"){
			var options = []
			for(var k=0; k<field.options.length; k++){
				var op = field.options[k]
				options.push(<FormGroup key={k} check><Label check>
						<Input type="radio" name="radifo" value={op.value}/><span>{op.name}</span>
					</Label></FormGroup>)
			}
			row = <div className="previewRow" key={i} style={{display: "flex"}}>
					<div style={{width: '100%'}}>
						<FormGroup tag="fieldset">
								<Label >
									{field.name}</Label>
							{options}
							
						</FormGroup>
					</div>
					{render_control}
				</div>
		}

		if(field.type == "checkbox"){
			row = <div className="previewRow" key={i} style={{display: "flex"}}>
					<div style={{width: '100%', marginBottom: "20px"}}>
						<FormGroup check>
							<Label check>
								<Input style={{height: "18px", width: "18px"}} type="checkbox" />
								{field.name}</Label>
						</FormGroup>
					</div>
					{render_control}
				</div>
		}

		return row
	}
	edit(current){
		let {typeName, typeValue, fields} = this.state;
		let {name, type, required, options} = fields[current]
		typeValue = ""
		typeName = ""
		this.setState({typeName, typeValue, type, name, required, current, options})
	}
	addField(){
		let {name, required, type, fields, options, current} = this.state;

		if(current >= fields.length){
			fields.push({name, required, type, options})
		}
		current = fields.length
		name = ""
		type = "text"
		options = []
		required = false
		this.setState({name, required, type, fields, options, current})

		if(this.state.create){
			var ref = app.database().ref().child('form');
			ref.push({fields})
			.then((e)=>{
				this.props.history.push('/' + e.key)
				this.setState({create: false})
			})
			return 0
		}

		let {id} = this.props.match.params
		app.database().ref().child('form/' + id).set({fields})
		.then((e)=>{
		})
	}
	delete(array, i, key, e){
		array.splice(i, 1)
		this.setState({key: array})
	}

	addOption(){
		let {typeName, typeValue, options} = this.state;
		options.push({name: typeName, value: typeValue})
		typeName = ""
		typeValue = ""
		this.setState({typeValue, typeName, options})
	}

	getPreview(){
		var {fields, name, type, required, options, current} = this.state
		var render = []

		for(var i = 0; i < fields.length; i ++){
			render.push(this.renderField(i, fields[i]))
		}
		if(current >= fields.length && name)
			render.push(this.renderField(i, {fields, name, type, options}, false))
		render.push(<Button style={{marginBottom: "30px"}}>Submit</Button>)

		return render
	}
	move(array, ind, dir, key){
		var item = array.splice(ind, 1)
		array.splice(ind+dir, 0, item[0])
		if(key == "fields"){
			let {fields} = this.state
			let {id} = this.props.match.params
			app.database().ref().child('form/' + id).set({fields})
			.then((e)=>{
			})
			this.clear()
		}
		this.setState({key: array})
	}
	renderOptions(){
		var {options} = this.state
		var render = []

		for(var i = 0; i < options.length; i ++){
			var r = options[i]
			var up = null
			if(i > 0)
				up = <FontAwesomeIcon onClick={this.move.bind(this, options, i, -1, "options")} style={iconStyle} icon={faChevronUp}/>
			var down = null
			if(i < options.length - 1)
				down = <FontAwesomeIcon onClick={this.move.bind(this, options, i, 1, "options")} style={iconStyle} icon={faChevronDown} />
			var rows = 
				<Row key={i}>
					<Col xl={4}>
						<FormGroup>													  
							<Input
								value = {r.name}
								onChange={(e)=>{r.name = e.target.value; this.setState({options})}}
								type="text"
								name="name"
								placeholder="Name"
							/>
						</FormGroup>
					</Col>
					<Col xl={4}>
						<FormGroup>													  
							<Input
								value={r.value}
								onChange={(e)=>{r.value = e.target.value; this.setState({options})}}
								type="text"
								name="name"
								placeholder="Value"
							/>
						</FormGroup>

					</Col>

					<Col xl={4}>
						<FormGroup>
							<FontAwesomeIcon onClick={this.delete.bind(this, options, i, 'options')} style={iconStyle} icon={faTrash} />
							{up}
							{down}
						</FormGroup>

					</Col>
				</Row>
			render.push(rows)
		}
		return render
	}
	update(option){
		let {type, name, required, current, fields, options} = this.state;
		if(current < fields.length){
			for(var key in option)
				fields[current][key] = option[key]
			this.setState({fields})
		}

		this.setState(option)
		
	}
	clear(){
		var {fields, name, type, required, options, current} = this.state
		current = fields.length
		name = ""
		type = "text"
		options = []
		required = false
		this.setState({name, required, type, options, current})
	}

	render() {
		if(this.state.loading){
			return (
				<Page className="LoadPage">
					<div style={{width: "100%", height: "100%", left: 0, top: 0, position: "fixed", background: "white"}}>
						<img style={{margin: "auto", marginTop: "30vh", display: "block"}} src="loader.gif" />
					</div>
				</Page>	
			)
		}
		let {typeName, typeValue, type, name, required, current, fields, options} = this.state;

		const primaryColor = getColor('primary');
		const secondaryColor = getColor('secondary');

		let text = "Add Field"
		if(current < fields.length)
			text = "Update Field"

		let additional_input = null;

		let display = this.getPreview();

		if(type == "select" || type == "radio"){
			let heading = "Dropdown"
			if(type == "radio")
				heading = "Radio"
			var existing_options = this.renderOptions()
			additional_input = 
				<Row>
					<Col xl={12}>
						<Card style={{ backgroundColor: '#F9FAFC'}}>
							<CardHeader style={{ backgroundColor: '#F9FAFC'}}><b>{heading}</b></CardHeader>
							<CardBody>
								{existing_options}
								<Row>
									<Col xl={4}>
										<FormGroup>													  
											<Input
												value={typeName}
												onChange={(e)=>{this.setState({typeName: e.target.value})}}
												type="text"
												name="name"
												placeholder="Name"
											/>
										</FormGroup>
									</Col>
									<Col xl={4}>

										<FormGroup>													  
											<Input
												value={typeValue}
												onChange={(e)=>{this.setState({typeValue: e.target.value})}}
												type="text"
												name="name"
												placeholder="Value"
											/>
										</FormGroup>

									</Col>
								</Row>

								<Row>
									<Col xl={12}>
										<Button color="primary" onClick={this.addOption.bind(this)} >Add Option <FontAwesomeIcon style={iconStyle} icon={faPlus} /></Button>
									</Col>
								</Row>

							</CardBody>
						</Card>
					</Col>
				</Row>
		}

		return (
			<Page className="FormPage" style={{width: "100%", zIndex: 10, marginTop: "100px"}}>

				<Row>
					<Col xl={6}>
					  <Card>
						<CardHeader><b>Form Builder</b></CardHeader>
						<CardBody>
						  <Form>
							<Row>
								<Col xl={4}>
									<FormGroup>
										<Label for="Name">Name of Field</Label>
											  
										<Input
											value={name}
											onChange={(e)=>{this.update.bind(this,{name: e.target.value})()}}
											type="text"
											name="name"
											placeholder="Field name"
										/>
									</FormGroup>
								</Col>
								<Col xl={4}>
									<FormGroup>
									  <Label for="exampleEmail">Type of Field</Label>
										<select className="form-control" value={type}
											onChange={(e)=>{this.update.bind(this, {type: e.target.value})()}}>
											<option value="text">Text</option>
											<option value="select">Dropdown</option>
											<option value="radio">Radio Button</option>
											<option value="checkbox">Toggle (checkbox)</option>
											<option value="number">Number</option>
											<option value="url">Url</option>
											<option value="phone">Phone</option>
											<option value="email">Email</option>
										</select>
									</FormGroup>
								</Col>
								<Col xl={4}>
									<FormGroup>
									  <Label>Required</Label>
										<br/>
									  <input
									  	checked={required}
									  	onChange={(e)=>{this.update.bind(this, {required: e.target.checked})()}}
									  	style={{height: "38px", width: "25px"}} type="checkbox" />
									</FormGroup>
								</Col>
							</Row>
							{additional_input}

							<Row>
								<Col xl={12}>
									<Button color="success" style={{marginRight: 10}} onClick={this.addField.bind(this)} >{text} <FontAwesomeIcon style={iconStyle} icon={faEdit}/></Button>
									<Button color="danger" onClick={this.clear.bind(this)} >Clear <FontAwesomeIcon style={iconStyle} icon={faBroom}/></Button>
								</Col>
							</Row>

						  </Form>
						</CardBody>
					  </Card>
					</Col>
				</Row>

				<div style={{position: "absolute", left: '60%', top: "60px", width: "auto", paddingLeft: "40px", paddingRight: "13px", marginTop: "93px", height: "545px", overflowY: "scroll", width: "330px", overflowX: "hidden"}}>
					<div style={{marginLeft: "-12px", width: "300px", padding: "15px", backgroundColor: 'black', color: "white", marginBottom: "5px"}}>Form Preview</div>
					{display}
				</div>
				<img style={{position: "absolute", left: '60%', top: "70px", width: "350px", zIndex: -1}} src="phone.png" />
			</Page>
		)
	}
}
export default FormPage;



