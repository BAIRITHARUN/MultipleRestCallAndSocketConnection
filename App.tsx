
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text, View
} from 'react-native';

var axios = require('axios');

const App: FC = () => {

  const [resTime, setResTime] = useState('')

  const [appTime, setAppTime] = useState('')

  const [count, setCount] = useState('')

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

  // useEffect(()=> {
    
  //   connectWS()

  //   return(()=> {
  //     ws.close();
  //   })
  // }, [])

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
