import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter  } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Grid,Paper,Card,Button, Dialog,DialogTitle,DialogActions,Avatar} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Web3 from 'web3';
import { MIA_ABI,MIA_ADDRESS } from './config';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Loader from "react-loader-spinner";
import Moment from 'react-moment';
import 'moment-timezone';
import Photos from './Photos';

const Filestorage = require('@skalenetwork/filestorage.js');

String.prototype.trunc = function(n){ return this.substr(0,n-1)+(this.length>n?'...':''); };

function Index() {
const [files, setFiles] = useState([]);
const [myaccount, setMyaccount] = useState('');
const [guer, setGuer] = useState('');
const [mymia, setMymia] = useState('');
const [web3, setWeb3] = useState('');
const [openhelpmodal, setOpenhelpmodal] = useState(false);
const [usage, setUsage] = useState('Personal');
const [isActive1, setActive1] = useState(false);
const [isActive2, setActive2] = useState(false);
const [keystorefile, setKeystorefile] = useState('');
const [encryptpass, setEncryptpass] = useState('');
const [connecting, setConnecting] = useState(true);
const [keystorecheck, setKeystorecheck] = useState(true);
const [rendercheat,setRendercheat] = useState(false);
const [opensharemodal, setOpensharemodal] = useState(false);
const [modalname, setModalname] = useState(false);
const [waiting, setWaiting] = useState(false);

const inputFile = useRef(null);
let temparray = [];


const handleChange = (event) => {
    console.log(event.target.value);
    setUsage(event.target.value);
  };

const handleClose = () => {
    setOpenhelpmodal(false)
    setOpensharemodal(false)
}

const onButtonClick = () => {
   inputFile.current.click();
  };

  const skalecheck = async () => {
    if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        try {
            await window.ethereum.enable()
              await web3.eth.getAccounts((error, accounts) => {
                if (error) {
                  console.error(error);
                }
                setMyaccount(accounts[0]);
                let switchToSKALE = {
                  chainId: "0xaeb7ad5602fe",
                  chainName: "SKALE Network",
                  rpcUrls: ["https://dappnet-api.skalenodes.com/v1/handsome-zuben-elakrab"],
                  nativeCurrency: {
                    name: "SKALE ETH",
                    symbol: "skETH",
                    decimals: 18
                  },
                  blockExplorerUrls: [
                    "https://expedition.dev/?rpcUrl=https://dappnet-api.skalenodes.com/v1/handsome-zuben-elakrab"
                  ]
                };
                window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: [switchToSKALE, accounts[0]]
                })
                .then(() => {
                })
                .catch((error) => console.log(error.message));
            })
  
            ;
          } catch (error) {
            alert("You need to allow access to your metamask to use the app.");
        }
    }
}

const web3Check = async () => {
    if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        try {
            await window.ethereum.enable()
              await web3.eth.getAccounts((error, accounts) => {
                if (error) {
                  console.error(error);
                }
                setMyaccount(accounts[0]);
                let switchToSKALE = {
                  chainId: "0xaeb7ad5602fe",
                  chainName: "SKALE Network",
                  rpcUrls: ["https://dappnet-api.skalenodes.com/v1/handsome-zuben-elakrab"],
                  nativeCurrency: {
                    name: "SKALE ETH",
                    symbol: "skETH",
                    decimals: 18
                  },
                  blockExplorerUrls: [
                    "https://expedition.dev/?rpcUrl=https://dappnet-api.skalenodes.com/v1/handsome-zuben-elakrab"
                  ]
                };
                window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: [switchToSKALE, accounts[0]]
                })
                .then(() => {     
                guer.methods.createNFT().send({
                    from: myaccount
                })
                .then(function(result){
                    //console.log(result);
                    window.location.reload(false);
                }).catch(function(error){
                    console.log(error);
                });

                })
                .catch((error) => console.log(error.message));
            })
  
            ;
          } catch (error) {
            alert("You need to allow access to your metamask to use the app.");
        }
    }
}

if (web3 === ''){
    setWeb3(new Web3(Web3.givenProvider));
}

const keystore = async (e) => {
    setWaiting(true);
    const data = new FormData();
    data.append("encryptpass", encryptpass);

    fetch('/api/keystore', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(res => {
        setKeystorefile(res);
        guer.methods.doAddKeystore(mymia, res).send({
                from: myaccount
            })
            .then(function(result){
                setActive2(true);
            })
            .catch(function(error){
                console.log(error);
            });
    })
    .catch(error => error.message)
    setWaiting(false);
}

const encrypt = (e) => {
    setWaiting(true);
    const data = new FormData();
    const file = document.getElementById("data_file").files[0];
    data.append("filename", file.name);

    data.append("file", file);
    data.append("keystorefile", keystorefile);
    data.append("encryptpass", encryptpass);    
    data.append("type", file.type);

    fetch('/api/encrypt', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(res => {
        guer.methods.doAddEncrypted(mymia, res.file, file.name, file.type, res.companion, usage).send({
            from: myaccount
            })
            .then(function(result){
                setWaiting(false);
                window.location.reload(); 
            }).catch(function(error){
                console.log(error);
            });

    })
    .catch(error => error.message)
    setWaiting(false);
}

const decrypt = async (f,c,t,n) => {
    setWaiting(true);
    let filedata = '';
    const data = new FormData();

    data.append("companionfile", c);
    data.append("keystorefile", keystorefile);
    data.append("encryptedfile", f);
    data.append("encryptpass", encryptpass);    

    fetch('/api/decrypt', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (t === "image/png") {
            filedata = "data:image/png;base64," + res;
        } else if  (t === "image/jpeg") {
            filedata = "data:image/jpeg;base64," + res;
        } else if (t === "text/plain") {
            filedata = "data:text/plain;base64," + res;
        } else if (t === "image/gif") {
            filedata = "data:image/gif;base64," + res;
        } else if (t === "image/webp") {
            filedata = "data:image/webp;base64," + res;
        } else if (t === "application/pdf") {
            filedata = "data:application/pdf;base64," + res;
        }
        var FileSaver = require('file-saver');
        var blob = new Blob([atob(res)], {type: t});
        FileSaver.saveAs(blob, n);
    })
    .catch(error => error.message)
    setWaiting(false);
}

useEffect(() => {
    const loadEthereumData = async () => {
        if (myaccount === '') {
            const account = await web3.eth.getAccounts();
            setMyaccount(account[0]);
            const guerABI = await new web3.eth.Contract(MIA_ABI, MIA_ADDRESS);
            setGuer(guerABI);
            const miaArray = await guerABI.methods.getUserNFTs().call({from:account[0]});
            if (miaArray.length > 0) {

                const miainfoblock = await guerABI.methods.getNFTInfo(miaArray[0]).call({from:account[0]});
                if (miainfoblock) {
                console.log(String(miainfoblock));
                    setMymia(miainfoblock[0]);    
                    setConnecting(false);
                    setActive1(true);
                }
                const getkeystore = await guerABI.methods.getKeystore(miaArray[0]).call({from:account[0]});
                if (getkeystore !== '') {
                    setKeystorefile(getkeystore);
                    setKeystorecheck(false);
                    setActive2(true);
                }

                console.log('c');

                const ecount = await guerABI.methods.doGetEncryptedCount(miaArray[0]).call({from:account[0]})

                for (let i = 1;i <= ecount;i++){
                await guerABI.methods.doGetEncrypted(miaArray[0], i).call({from:account[0]})
                    .then(function(result){
                        temparray.push(result);
                    }).catch(function(error){
                        console.log(error);
                    });
                    setFiles(temparray);
                }
                setRendercheat(true);

            }
            setConnecting(false);
            setKeystorecheck(false);

        }
        } 
    loadEthereumData();
},[web3,myaccount,mymia,rendercheat,waiting,temparray]);

return(
<BrowserRouter>
    <div className="App white-background">
    <header className="App-header">
        <h1><a href="/" style={{color:'white'}}>Guer.Secure</a></h1>
        <h5 style={{margin:'0px 0px 0px 10px'}}>A demonstration of storing important data, publically, safely</h5>
        {/*
        <Button style={{backgroundColor:'#1D3557',border:'1px solid white', borderRadius:'8px',padding:'2px 5px',width:'100px',color:'white'}} onClick={() => setOpenhelpmodal(true)}>INFO / HELP</Button>
        */}
    </header>
    <Dialog
        fullWidth
        open={openhelpmodal}
        onClose={handleClose}>
        <DialogTitle style={{padding:'20px',textAlign:'center'}}>What is this?</DialogTitle>
            <div style={{fontSize:'1.25em'}}>This is a demonstration of a site that manages the data you store decentralzied on IPFS/Ethereum/SKALE/GUER.
            <br/><br/>This is currently running on the SKALE testnet, and you will need to configure your metamask, and get some SKALE test coins to use it. 
            <br/><br/>This site allows you to claim your ethereum address in the Guer contract (you do not need to input your name/email/mobile/profile picture).
            <br/><br/>You can then edit your profile, upload images to your decentralized storage, add 'friends' to your contract, and other in-progress items are coming soon.
            <br/><br/>For more information, please visit <a style={{color:'white'}} href="https://guer.co" target="_blank" rel="noopener noreferrer">guer.co</a>
            <br/><br/><span style={{color:'red'}}>This is purely a demonstration, do not store any important data as it may be lost, do not send ethereum to any addresses found on this site or it will be lost</span>
            </div>
        <DialogActions>
        <Button onClick={() => handleClose()} >
            close
        </Button>
        </DialogActions>
    </Dialog> 
    <Grid container align="center" alignItems="center" justifyContent="center" direction="column">
            <Grid item>
                <br/>
                <Card className={(!isActive1) ? "white-paper" : "white-paper-collapsed"} >
                    <div>
                        {connecting ? 
                        <>Searching for your security anft 
                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={50}
                            width={50}
                            //timeout={3000} //3 secs
                        />
                        <Button variant="contained" color="primary"size="small" onClick={() => skalecheck()}>Connect to chain</Button>
                        </> 
                        : mymia
                        ? <>sNFT Found! <VerifiedUserIcon style={{color:'green'}} fontSize="large"/><Button variant="contained" color="primary" onClick={() => {}}>TEST</Button></>
                        : <>Create a new security NFT <br/><Button variant="contained" color="primary" onClick={() => {web3Check();}}>Create sNFT</Button></>}
                    </div>
                </Card>
            </Grid>
            <Grid item>
                <br/>
                {mymia ?
                <Card className={(!isActive2) ? "white-paper" : "white-paper-collapsed"} >
                    {!waiting ? 
                    <div>{keystorecheck ?                     
                    <>Searching for your keystore file
                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={50}
                            width={50}
                        />
                        </>  : keystorefile
                        ? <>Keystore Found <VerifiedUserIcon style={{color:'green'}} fontSize="large"/>&nbsp;<a target="_blank" rel="noopener noreferrer" href={"https://cloudflare-ipfs.com/ipfs/" + keystorefile}>[link]</a></>
                        : <>Create a keystore file<br/>
                                        <input id="placeholder password" label="Required" placeholder="Encrypt password" style={{color:'black'}} onChange={e => {setEncryptpass(e.target.value);}}/>
                             <br/>
                             <Button variant="contained" color="primary" disabled={encryptpass.length < 2} onClick={() => {keystore();}}>Go</Button></>}
                    </div>
                    : <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={50}
                    width={50}
                   />
                    }
                </Card>
                : ''}
            </Grid>
            <Grid item>
            <br/>
            {mymia ?
            <Paper  
            style={{minHeight:'200px',display: 'flex',flexDirection:'column'}}  
            className={"white-paper"} 
            >
                {!waiting ?
                <div>
                    <input
                        id="data_file"
                        multiple
                        type="file"
                        style={{display:'none'}}
                        ref={inputFile}
                    onChange={() => {encrypt();setWaiting(true);setActive2(!isActive2)}}
                    />
                <div>Upload a file!                         <img alt="test" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAmCAYAAACGeMg8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMXSURBVFhH7VZBaxpBFPYv+AckYCAk1BoKaUNockg8SKmyUFCapKSRWFACKcUGLxoFC00C2uYmlIDxopCL4KkXL7l58uSPyB/w9nVmdmd9O67atNVuxMOHO+97b/d9772Z0eXz+TCIZ/BrXxEoNvD6qoFXX77jxfZznds4wsv8LULlnwhd1bD94Qj+p2o8Q3gXvdMQzontfD+OXmKHPa/j7vQjumHiz1BPSNsOurk47rYIvxXCfW4Xdfbcf0+fHyLkX4AnQ5PV1zIBkYyRmOBJonzNRdFkxVrywpe+e32SQhiMD/YEWBK8SyQ5XQzhaazRNcl3w7wQqvA+P1khCnji9/vrttxY8MSVUaWYnhBRQWXufxt6d0YVYeJ7RLZeHw87P3voe4JA2dwqpjpak8RciNMwF+I0zIU4DXMhToPL4/FgFjAX4jTMqhA/AsEmqtkuGtk2LoMHWLLwzoUpZGn1ApcpJiDVRHLVP7CmQU6Ey+M9QDLWxm26hcxmGF6LwzLWNm9QTndRjV0g4KXcaGhnFdSLSVtuEnClTrqoHWawtmDvILAQxvvDNhqffiBgxzMki3VUzjRzPUkh/Fv83fKX21zfcnw/6BUPLi4PBHkX46Jj3KeRayKu8BJTE6LlUbnOQxNrDfnrCvKaEMKS877BXqSFWraDciSNDT5C1Pa2wMaqAOGrvpghf80qU5coIclsUoiomsGVjkkcT0iJ4fbBOD1RGTesYLoQw9ivfge3okslhFZkl4YL4bD9AElerM1KJlGiCR6XTO5BcRxGhyxCJILRNqrRuMX2R0LoaIkOWLtlciLBIRyJo35qrK2QQIQJiRxYbH8tRE3WHCvrCI2Ks4qy8v9NCPWlGCnE8mzlXXvv2H5QLj1ViLwca7ECnhg2FQ8RoldWmXUD44UM2SPqpcePYFPIyMtSgUiOj0i/6sMTYuAbnI6W4TsujheMnn7Sv/9fi116UeO4rX7uoHbSQjWjH8cjL8tpw+jAwD2iOnpX0sgkWEcSN4iaR6+zwLvCuyB/uW1AyGPFXIjTMDtC3G43Hj/c+AWb+PTJKLjyWAAAAABJRU5ErkJggg=="/>
</div>
                
                <div>
                    <label style={{fontSize:'16px'}}>
                    Nature of File?&nbsp;&nbsp;
                    <select value={usage} onChange={handleChange}>            
                    <option value="Personal">Personal</option>
                    <option value="Public">Public</option>
                        <option value="Medical">Medical</option>
                        <option value="State">State</option>
                        <option value="Federal">Federal</option>
                        <option value="International">International</option>
                    </select>
                    </label>
                </div>
                <div style={{width:'50%'}}>
                    <input id="placeholder password" label="Required" placeholder="Encrypt password" style={{color:'black',marginTop:'10px'}} onChange={e => {setEncryptpass(e.target.value);}}/>
                    <Button disabled={encryptpass.length < 2} variant="contained" color="primary" onClick={onButtonClick} style={{marginTop:'10px'}}>
                    <label htmlFor="data_file">
                        <div>Select file...</div>
                        </label>
                    </Button>
                </div>
                </div>
                : <Loader
                type="Puff"
                color="#00BFFF"
                height={50}
                width={50}
               />
                }
            </Paper>
            : ''}
            </Grid>
            <Grid item>
                <br/><br/>
                {mymia ?
                <TableContainer component={Paper} className={"white-table"}>
                    <Table aria-label="simple table" style={{color:'black'}}>
                        <TableHead>
                        <TableRow>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Name</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Uploaded</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Type</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">For?</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Link (encrypted)</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Decrypt</TableCell>
                            <TableCell style={{color:'black',fontWeight:'bold'}} align="center">Share</TableCell>

                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {files.map((f,k) => (
                            <TableRow key={k}>
                                <TableCell style={{color:'black'}} component="th" scope="row">{f[1].trunc(15)}</TableCell>
                                <TableCell style={{color:'black'}} align="center"><Moment format="MM/DD/YY" tz="America/Los_Angeles" unix>{f[2]}</Moment></TableCell>
                                <TableCell style={{color:'black'}} align="center">{f[3].includes("image") ? "Image" : "Doc"}</TableCell>
                                <TableCell style={{color:'black'}} align="center">{f[5]}</TableCell>
                                <TableCell style={{color:'black'}} align="center"><a target="_blank" rel="noopener noreferrer" href={"https://cloudflare-ipfs.com/ipfs/" + f[0]}><Button variant="contained">Link</Button></a></TableCell>
                                <TableCell style={{color:'black'}} align="center"><Button color="secondary" style={{color:'blue',fontWeight:'bold'}} onClick={() => {decrypt(f[0],f[4],f[3],f[1])}}>Decrypt</Button></TableCell>
                                <TableCell style={{color:'black'}} align="center"><Button variant="contained" color="primary" style={{color:'white',fontWeight:'bold'}} onClick={() => {setOpensharemodal(true);setModalname(f[1])}}>Share</Button></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : ''}
            </Grid>
            <br/>
    </Grid>
    </div>
    <Dialog
        open={opensharemodal}
        onClose={handleClose}>
        <DialogTitle style={{padding:'20px',textAlign:'center'}}>Who can access {modalname}</DialogTitle>
            <Table aria-label="simple table" style={{color:'black'}}>
                <TableHead>
                <TableRow>
                    <TableCell style={{color:'black'}} align="center"></TableCell>
                    <TableCell style={{color:'black'}} align="center">Address</TableCell>
                    <TableCell style={{color:'black'}} align="center">Who</TableCell>
                    <TableCell style={{color:'black'}} align="center">Status</TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow >
                        <TableCell style={{color:'black'}} component="th" scope="row"><Avatar style={{backgroundColor:'lightpurple'}}>D</Avatar></TableCell>
                        <TableCell style={{color:'black'}} align="center">0x123</TableCell>
                        <TableCell style={{color:'black'}} align="center">DMV</TableCell>
                        <TableCell style={{color:'black'}} align="center"><CheckCircleIcon style={{color:'green'}} fontSize="medium"/></TableCell>
                        <TableCell style={{color:'black'}} align="center"></TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{color:'black'}} component="th" scope="row"><Avatar style={{backgroundColor:'lightgreen'}}>M</Avatar></TableCell>
                        <TableCell style={{color:'black'}} align="center">0x456</TableCell>
                        <TableCell style={{color:'black'}} align="center">Doctor</TableCell>
                        <TableCell style={{color:'black'}} align="center"><CancelIcon style={{color:'red'}} fontSize="medium"/></TableCell>
                        <TableCell style={{color:'black'}} align="center"></TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{color:'black'}} component="th" scope="row"><Avatar style={{backgroundColor:'lightblue'}}>F</Avatar></TableCell>
                        <TableCell style={{color:'black'}} align="center">0x789</TableCell>
                        <TableCell style={{color:'black'}} align="center">Friend</TableCell>
                        <TableCell style={{color:'black'}} align="center"><CancelIcon style={{color:'red'}} fontSize="medium"/></TableCell>
                        <TableCell style={{color:'black'}} align="center"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        <DialogActions>
        <Button onClick={() => handleClose()} >
            close
        </Button>
        </DialogActions>
    </Dialog> 
</BrowserRouter>
)}

export default Index;
ReactDOM.render(
    <>
        <CssBaseline />
        <Index/>
    </>,
    document.getElementById('root')
);

