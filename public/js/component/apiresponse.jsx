import React, {Component} from 'react';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import 'babel-polyfill';
import ReactJson from 'react-json-view';
promise.polyfill();
export default class Test extends React.Component {
    constructor() {
        super();
        this.state = {
            items: '',
            statusCode:''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({items: ''});
        this.setState({statusCode: ''});
        const URL = nextProps.url;

        fetch(URL).then(result => {
            result.json()
                .then(items=> {
                    var response=items;
                    this.setState({statusCode: result.status});
                    this.setState({items: response});
                })
        })
    }

    componentDidMount() {
        const URL = this.props.url;
        fetch(URL).then(result => {
            result.json()
                .then(items=> {
                    var response=items;
                    this.setState({statusCode: result.status});
                    this.setState({items: response});
                })
        })
    }

    render() {
        this.props.status(this.state.statusCode)
        this.props.rawEntry(this.state.items)
        var itemData = <ReactJson src={this.state.items} theme="tomorrow" collapsed = {true} name = {false} collapsed = {2} enableClipboard = {false} displayDataTypes ={false}  />
        return(
            <div>
                {this.state.items ? itemData : null}
            </div>
        )

    }
}