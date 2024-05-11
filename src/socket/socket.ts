
const { rtConnect, rtDisconnect, rtSubscribe, rtUnsubscribe, rtFeed, historical, formatTime, isSocketConnected } = require('truedata-nodejs')

const user = 'FYERS2018'
const pwd = 'Ngj1VZmn'

const symbols = ['CRUDEOIL'];

rtConnect(user, pwd, symbols, 8082);

rtFeed.on('touchline', touchlineHandler); // Receives Touchline Data
rtFeed.on('tick', tickHandler); // Receives Tick data
rtFeed.on('greeks', greeksHandler); // Receives Greeks data
rtFeed.on('bidask', bidaskHandler); // Receives Bid Ask data if enabled
rtFeed.on('bidaskL2', bidaskL2Handler); // Receives level 2 Bid Ask data only for BSE exchange
rtFeed.on('bar', barHandler); // Receives 1min and 5min bar data
rtFeed.on('marketstatus', marketStatusHandler); // Receives marketstatus messages
rtFeed.on('heartbeat', heartbeatHandler); // Receives heartbeat message and time

function touchlineHandler(touchline:any){
	console.log(touchline)
}

function tickHandler(tick:any){
	console.log(tick)
}

function greeksHandler(greeks:any){
	console.log(greeks)
}

function bidaskHandler(bidask:any){
	console.log(bidask)
}

function bidaskL2Handler(bidaskL2:any){
	console.log(bidaskL2)
}

function barHandler(bar:any){
	console.log(bar)	
}

function marketStatusHandler(status:any) {
  console.log(status);
}
function heartbeatHandler(heartbeat:any) {
  console.log(heartbeat);
}


