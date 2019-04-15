

import {app, base} from './base'

var root_url = "http://manage.plakc.com"

var API = {

	allCampaigns: root_url + "/campaigns",
	campaign: root_url + "/campaign",

	allAdvertisers: root_url + "/advertisers",
	advertiser: root_url + "/advertiser",

	allPublishers: root_url + "/publishers",
	publisher: root_url + "/publisher",

	// manage.plakc.com/campaignstats/1292?from=01-02-2019&to=28-02-2019
	campaignStats: root_url + "/campaignstats",

	dashboardStats: root_url + "/dashboard",
}

let bearer = null
app.auth().onAuthStateChanged((user) => {
	if(!user)
		return 0
	user.getIdToken()
	.then((id)=>{
		bearer = id;
	})
})

function AJAX(url, option){

	var t = false
	if(url.indexOf('dashboard')!=-1)
		t = true

	option = option? option: {};

	var opt = {
		method: option.method || "GET",
	}
	if(option.body)
		opt.body = JSON.stringify(option.body)

	if(option.params){
		url = new URL(url)
		url.search = new URLSearchParams(option.params)
	}

	opt.headers={
		'Content-Type': 'application/json',
	}

	if(bearer){
		// console.log("bearer-", bearer)
		opt.headers["Authorization"] = bearer
	}
	// console.log(url, opt)
	return fetch(url, opt).then(res => res.json())
}

export {
	API,
	AJAX
}