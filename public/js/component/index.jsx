import Api_reponse from './apiresponse.jsx';
import config from '../../../config/default.js';
import ReactJson from 'react-json-view';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import 'babel-polyfill';
import $ from 'jquery';
promise.polyfill();
var mainTitle, subTitle, entryTitle,divider,HostName,envName;
class APIResources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            url: "",
            api_endpoint: "",
            urlParams: [],
            globalParams: [],
            statusCode: "",
            responseBody: "",
            isLoading:false,
            rawData:''
        };
        this.getData = this.getData.bind(this);
        this.getRawEntry = this.getRawEntry.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setParamsInURLByName = this.setParamsInURLByName.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        mainTitle = nextProps.mainTitle
        envName=nextProps.envName
        subTitle = nextProps.subTitle
        entryTitle = nextProps.entryTitle
        divider = nextProps.divider
        this.setState({urlParams:[]})
        this.setState({responseBody:""})
        this.setState({isLoading:false})
        fetch(config.host + '/content_types/console/entries/' + nextProps.entry_uid + '?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+envName+'&include[]=code_snippets_for_different_languages.language&include[]=url_parameters.data_type&include[]=headers.type')
            .then(result=>result.json())
            .then(items=> {
                this.setState({items: items.entry});
                var url_string = items.entry.api_endpoint;
                this.setState({api_endpoint: url_string})
                this.setState({urlParams: items.entry.url_parameters})
                var len = this.state.urlParams.length;
                if (len > 0) {
                    var urlParameters="";
                    var updatedURL=url_string.split("?");
                    var mainURL=updatedURL[0];
                    this.state.urlParams.map((item, index)=> {
                        var parameter_key = item.key
                        var urlParam=updatedURL[1];
                        urlParam=urlParam.split("&");
                        for(var k=0;k<urlParam.length;k++){
                            var paramKey=urlParam[k].split("=");
                            if(paramKey[0]== parameter_key){
                                urlParameters=urlParameters+paramKey[0]+"="+item.value+"&"
                            }
                        }

                        var key1="{"+parameter_key+"}";
                        mainURL=mainURL.replace(key1,item.value)

                       /* var key = "{" + parameter_key + "}"
                        url_string = url_string.replace(key, item.value)
                        this.setState({url: url_string})*/
                    })
                    //var finalURL=updatedURL[0]+"?"+urlParameters;
                    var finalURL=mainURL+"?"+urlParameters;
                    var index_position=finalURL.lastIndexOf("&");
                    finalURL=finalURL.substring(0,index_position)
                    this.setState({url: finalURL})
                } else {
                    this.setState({url: url_string})
                }
                if(items.entry){
                    $('.consoleContent').addClass('show').removeClass('hide');
                    $('.loader').addClass('hide').removeClass('show');
                }

            }
        )
    }

    componentDidMount() {
        mainTitle = this.props.mainTitle
        envName= this.props.envName;
        subTitle = this.props.subTitle
        entryTitle = this.props.entryTitle
        divider = this.props.divider
        // Fetch call for global parameters
        fetch(config.host+'/content_types/global/entries?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+envName)
            .then(result=>result.json())
            .then(obj=>{
                this.setState({globalParams: obj.entries})
            })

        // Fetch call for entry parameters and values
        fetch(config.host+'/content_types/console/entries/'+this.props.entry_uid + '?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+envName+'&include[]=code_snippets_for_different_languages.language&include[]=url_parameters.data_type&include[]=headers.type')
            .then(result=>result.json())
            .then(items=> {
                this.setState({items: items.entry});
                var url_string = items.entry.api_endpoint;
                this.setState({api_endpoint: url_string})
                this.setState({urlParams: items.entry.url_parameters})
                var len = this.state.urlParams.length;
                if (len > 0) {
                    var urlParameters="";
                    var updatedURL=url_string.split("?");
                    var mainURL=updatedURL[0];
                    this.state.urlParams.map((item, index)=> {
                        var parameter_key = item.key
                        var urlParam=updatedURL[1];
                        urlParam=urlParam.split("&");
                        for(var k=0;k<urlParam.length;k++){
                            var paramKey=urlParam[k].split("=");
                            if(paramKey[0]== parameter_key){
                                urlParameters=urlParameters+paramKey[0]+"="+item.value+"&"
                            }
                        }

                        var key1="{"+parameter_key+"}";
                        mainURL=mainURL.replace(key1,item.value)

                    })

                   // var finalURL=updatedURL[0]+"?"+urlParameters;   //old code only for url parameters
                    var finalURL=mainURL+"?"+urlParameters;
                    var index_position=finalURL.lastIndexOf("&");
                    finalURL=finalURL.substring(0,index_position)
                    this.setState({url: finalURL})
                } else {
                    this.setState({url: url_string})
                }


                if(items.entry){
                    $('.consoleContent').addClass('show').removeClass('hide');
                    $('.loader').addClass('hide').removeClass('show');
                }
            }
        )
        $(".closeBtn , .slide-arrow").on("click",function(){
            $('.sideColumExampleConsole').animate({
                right: -700
            });
            $("#main").removeClass("content-slide");
            $(".slide-arrow").removeClass("show");
            $(".api_links").removeClass("apiLink");
        });

        $('.scrollbar').scroll(function() {
            if ($('.scrollbar').scrollTop() > 0) {
                $(".breadcrum").addClass("dark");
            } else{
                $(".breadcrum").removeClass("dark");
            }
        });

        $('.closeBtn').on("click",function(){
            $(".breadcrum").removeClass("dark");
        });

        $(".raw").on('click', function () {
            $(this).addClass('act').siblings('.pretty').removeClass('act');
            $(this).parents('.responseHead').siblings('#scroll_sec').find('.rawData').show().siblings('.prettData').hide();
        });
        $(".pretty").on('click', function () {
            $(this).addClass('act').siblings('.raw').removeClass('act');
            $(this).parents('.responseHead').siblings('#scroll_sec').find('.prettData').show().siblings('.rawData').hide();
        });

        var clipboardSnippets = new Clipboard('.copy-btn', {
            target: function(trigger) {
                return trigger.nextElementSibling;

            }
        });
        clipboardSnippets.on('success', function(e) {
            e.trigger.classList.add("copied");
            e.clearSelection();
            setTimeout(function () {
                e.trigger.classList.remove("copied");
            },1000);
        });
        clipboardSnippets.on('error', function(e) {
            //showTooltip(e.trigger, fallbackMessage(e.action));
        });

        var resclipboard = new Clipboard('.prettyCopy-btn');

        resclipboard.on('success', function(e) {
            e.trigger.classList.add("copied");
            e.clearSelection();
            setTimeout(function () {
                e.trigger.classList.remove("copied");
            },1000);
        });
        resclipboard.on('error', function(e) {
        });

    var showParam = $('.showParamdtls'),
        paramList = $('.parametersList');
        showParam.click(function () {
        paramList.slideToggle('2000', function () {});
        showParam.toggleClass('hideList');
    });

  $('.article a').click(function() {
        if(paramList.css('display') == 'block')
        {
            showParam.removeClass('hideList');
            paramList.css('display', 'none');
        }
    });


    }

    getData(value) {
        if (value) {
            this.setState({isLoading: false})
            this.setState({statusCode: value})
        }
    }
    getRawEntry(entry){
        if(entry){
            this.setState({rawData: entry})
        }
    }
    onClick() {
        this.setState({isLoading: true});
        this.setState({statusCode: ''});
        this.setState({rawData: ''});
        var url = HostName + this.state.url;
        this.state.responseBody = <Api_reponse rawEntry= {this.getRawEntry} status={this.getData} url={url}/>
        this.forceUpdate();
    }


    setParamsInURLByName(name, value) {
        var sURL = this.state.url;

        var old_url = this.state.api_endpoint;
        var arrParams = sURL.split("?");
        var main = old_url.split("?")
        var new_index = arrParams[0].split("/")
        var old_index = main[0].split("/")
        var final_index = old_index.indexOf("{" + name + "}")
        if (final_index) {
            new_index[final_index] = value;
            var final_url = new_index.join("/")
            arrParams[0] = final_url;
            var last_url = arrParams.join("?")
            this.setState({url: last_url})
        }
        var arrURLParams = arrParams[1].split("&");
        for (var i = 0; i < arrURLParams.length; i++) {
            var sParam = arrURLParams[i].split("=");
            if (sParam[0] == name) {
                var old_value = sParam[1];
                sURL = sURL.replace(name + '=' + old_value, name + '=' + value)
                this.setState({url: sURL})

            }
        }
    }

    onChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setParamsInURLByName(name, value);
        this.forceUpdate();
    }

    render() {
        const renderHTML = (escapedHTML:string) => React.createElement("div", {dangerouslySetInnerHTML: {__html: escapedHTML}});
        var itemsData = this.state.items;
        var dummyResponse;
        var isLoading = this.state.isLoading;
        if (itemsData.response_body) {
            dummyResponse = <ReactJson src={JSON.parse(itemsData.response_body)} theme="tomorrow" collapsed = {true} name = {false} collapsed = {2} enableClipboard = {false} displayDataTypes ={false}  />
        }
        var parameters, global, parametersINFO,headers,headersParam;
        var method = itemsData.method;
        var url = itemsData.api_endpoint;

        // mapping for global parameter
        if(this.state.globalParams){
            global = this.state.globalParams.map((param, index) => {
                if(param.title == "Host"){
                    HostName = param.value
                    return (HostName)
                }
            })
        }
        if (itemsData.url_parameters) {
            parametersINFO = this.state.urlParams.map((item, index) => {
                return (
                    <div key={index} className="consoleKitRow">
                        <div className="pull-left parameterText">{item.key}<span>{item.required_parameter ? "(required)" : "(optional)" }</span>
                        </div>
                        <div className="pull-left Inputfield"><input type="text" className="parameterInput" name={item.key}
                                                                     placeholder="null" defaultValue={item.value} onChange={this.onChange}/></div>
                    </div>
                )
            })
            parameters = this.state.urlParams.map((item, index) => {
                return (

                    <li key={index} className="parameter required">
                        <div className="parameterRow">
                            <div className="parameterColumn parameterKeyColumn">
                                <div className="parameterKey">{item.key} <span
                                    className="">{item.required_parameter ? "(required)" : "(optional)" }</span>
                                </div>
                            </div>

                            <div className="parameterColumn parameterDescriptionColumn">
                                <div className="parameterDescription">
                                    <p>{renderHTML(item.description)}</p>
                                    <em className="parameterExampleText">Example: <code
                                        className="parameterExampleValue">{item.value}</code></em>
                                </div>
                            </div>

                        </div>
                    </li>
                )
            })
        }
        return (
            <div className="docColum">
                <div className="show loader">
                    <span id="loaderr"></span>
                </div>
                <div className="hide consoleContent">
                    <div className="breadcrum col-md-12">
                        <span id="slide" className="closeBtn pullLeft">X</span>
                        <div className="breadcrumContainer">
                            <span>{mainTitle}</span>
                            <span className="divider">{divider}</span>
                            <span>{subTitle}</span>
                            <span className="divider">{divider}</span>
                            <span>{entryTitle}</span>
                        </div>
                    </div>

                    <div className="breadCrumColum col-md-12">
                        <div className="link"><p><span className="get font">{itemsData.method}</span>
                            {HostName}{this.state.api_endpoint}</p>
                        </div>
                    </div>

                    <div className="parametersColumTable  col-md-12 ">
                        <div className="showParamdtls"><span></span></div>
                        <ul className="parametersList">
                            <h2 className="prameterTitle font ">Parameters</h2>
                            {parameters}
                        </ul>
                    </div>

                    <div className="requestColum  col-md-12">
                        <h2 className="prameterTitle font ">Sample Request</h2>
                        <div className="link"><p><span className="get font">{itemsData.method}</span>
                            {HostName}{this.state.url}
                        </p>
                        </div>
                        <div className="requstPrmterContainer">
                            <div className="requstPrmterColum">
                                <ul className="requstPrmtermenu">
                                    <li className="current"><a href="#tab-1">URI Parameters</a></li>
                                </ul>
                            </div>
                            <div className="prameters-row">
                                {parametersINFO}
                            </div>
                            <div className="btns-container">
                                <button className="callResorcBtn" bsStyle="primary" disabled={isLoading}
                                        onClick={()=> this.onClick()}> {isLoading ? 'Trying...' : 'Try'} </button>
                            </div>
                        </div>

                        <div className="responseColm">
                            <div className="responseHead">
                                <h2 className="prameterTitle">Response <span className=""> {this.state.statusCode} </span></h2>
                                <h4>Body</h4>
                                <div className="change-view">
                                    <span className="pretty act">Pretty</span>
                                    <span className="raw">Raw</span>
                                </div>
                            </div>
                            <div id="scroll_sec">
                                <div className="responseBox">
                                    <div className="prettData">
                                        <a className="prettyCopy-btn" data-clipboard-text={this.state.responseBody? JSON.stringify(this.state.rawData, null, 2) : itemsData.response_body}><span></span></a>
                                        <div className="pretty-text">
                                            {this.state.responseBody? this.state.responseBody : dummyResponse}
                                        </div>
                                    </div>
                                    <div className="rawData">
                                        <a className="copy-btn"><span></span></a>
                                        <div className="raw-text">
                                            {this.state.responseBody? JSON.stringify(this.state.rawData, null, 2) : itemsData.response_body}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function loadReactDom() {
    var mainTitle = this.getAttribute('mainTitle');
    var envName= this.getAttribute('envName');
    var subTitle = this.getAttribute('subTitle');
    var entryTitle = this.getAttribute('entryTitle');
    var entryUid = this.getAttribute('entryUid');
    var divider ='/';
    $('.consoleContent').addClass('hide').removeClass('show');
    $('.loader').addClass('show').removeClass('hide');
    $('.actionName').on("click",function(){
        $(".breadcrum").removeClass("dark");
    });
    var rightBox = $('.sideColumExampleConsole');
    rightBox.animate({
        right: 0
    },function() {
        ReactDOM.render(
            <APIResources mainTitle={mainTitle} envName={envName} subTitle={subTitle} entryTitle={entryTitle} entry_uid={entryUid}
                          divider={divider}/>,
            document.getElementById('documentationColum')
        );
    });
}

var button = document.getElementsByClassName('actionName');
for (var i = 0; i < button.length; i++) {
    button[i].addEventListener('click', loadReactDom);
}


function _loadReactDom(node) {
    var mainTitle = node.getAttribute('mainTitle');
    var envName= node.getAttribute('envName');
    var subTitle = node.getAttribute('subTitle');
    var entryTitle = node.getAttribute('entryTitle');
    var entryUid = node.getAttribute('entryUid');
    var divider ='/';
    $('.consoleContent').addClass('hide').removeClass('show');
    $('.loader').addClass('show').removeClass('hide');
    $('.actionName').on("click",function(){
        $(".breadcrum").removeClass("dark");
    });
    var rightBox = $('.sideColumExampleConsole');
    rightBox.animate({
        right: 0
    },function() {
        ReactDOM.render(
            <APIResources mainTitle={mainTitle} envName={envName} subTitle={subTitle} entryTitle={entryTitle} entry_uid={entryUid}
                          divider={divider}/>,
            document.getElementById('documentationColum')
        );
    });
}

window.onload = function() {
    var _location = location.href;
    var _locationIndex = _location.substring(_location.indexOf('#') + 1);
    var anchorLinks = document.getElementsByClassName('actionName');
    for (var k = 0; k < anchorLinks.length; k++) {
        var _anchorHref = (anchorLinks[k].href);
        var _anchorHrefIndex = _anchorHref.substring(_anchorHref.indexOf('#') + 1);
        if (_locationIndex == _anchorHrefIndex) {
            _loadReactDom(anchorLinks[k]);
            $("#main").addClass("content-slide");
            $(".slide-arrow").addClass("show");
            $(".api_links").addClass("apiLink");
        }
    }
};