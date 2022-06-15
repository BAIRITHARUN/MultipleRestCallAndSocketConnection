
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text, View
} from 'react-native';

import EventSource from 'react-native-sse';

var axios = require('axios');

const App: FC = () => {

  const [resTime, setResTime] = useState('')

  const [appTime, setAppTime] = useState('')

  const [count, setCount] = useState('')
  
  const [listening, setListening] = useState(false);

  let startApicalls: any

  let ws : WebSocket

  async function getViolations() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log("------Api call-----------", str)

    var config = {
      method: 'get',
      url: 'http://192.168.0.111:3001/test',
      headers: {}
    };

    axios(config)
      .then(function (response: any) {
        let dd = new Date(response.data.time)

        setResTime(dd.toLocaleString())
        console.log("Response Time", dd.toLocaleString())

        console.log("App Time", new Date(Date.now()).toLocaleString())

        console.log("Count", response.data.count)

        setCount((cur) => {return response.data.count})
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  function connectWS () {
    ws = new WebSocket('ws://192.168.0.111:3001')
    ws.onopen = () => {
      console.log('Connected to the server')
      ws.send("Start Ping")
    }

    ws.onclose = (e) => {
      console.log('Disconnected. trying to reconnect')
      
      setTimeout(()=> {
        connectWS()
      }, 500)
    };
    ws.onerror = (e) => {
      console.log(e.message);
    };
    ws.onmessage = (e) => {
      let res = JSON.parse(e.data)
      let cnt = res.count

      let dd = new Date(res.time)

      setResTime(dd.toLocaleString())
      console.log("Response Time", dd.toLocaleString())

      setCount(cnt)
      console.log("Count", cnt);
    };
  }
  
  /* un comment use effect to interact with SSE*/
  
    // useEffect(() => {
  //   if (!listening) {
  
  //     const es = new EventSource<MyCustomEvents>(
  //       "http://192.168.0.111:3001/events"
  //     );

  //     es.addEventListener("open", (event) => {
  //       console.log("Open SSE connection.");
  //     });

  //     es.addEventListener("message", (event: any) => {
  //       let res = JSON.parse(event.data)
  //       let cnt = res.count

  //       let dd = new Date(res.time)

  //       setResTime(dd.toLocaleString())
  //       console.log("Response Time", dd.toLocaleString())

  //       setCount(cnt)
  //       console.log("Count", cnt);
  //     })

  //     es.addEventListener("ping", (event: any) => {
  //       console.log("Received ping with data:", event.data);
  //     });

  //     es.addEventListener("clientConnected", (event: any) => {
  //       console.log("Client connected:", event.data);
  //     });

  //     es.addEventListener("clientDisconnected", (event: any) => {
  //       console.log("Client disconnected:", event.data);
  //     });


  //     setListening(true);
  //   }
  // }, [listening]);

  
  /* un comment use effect to interact with Web Socket*/
  // useEffect(()=> {
    
  //   connectWS()

  //   return(()=> {
  //     ws.close();
  //   })
  // }, [])
  
  /* un comment use effect to make multiple API calls*/

  // useEffect(() => {
  //   startApicalls = setInterval(() => {
  //     getViolations()
  //   }, 1000)

  //   return (() => {
  //     clearInterval(startApicalls)
  //   })
  // }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Number of Violations {count}</Text>
      <Text style={styles.text}>Date and Time of Violations {resTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 32,
    margin: 10,
  },
  date: {
    fontSize: 32
  }

});

export default App;
