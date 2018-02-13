import React, {Component} from 'react';
import Highlight from 'react-highlight';
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
        return(
            <div>
                <Highlight className='json'>{this.state.items ? JSON.stringify(this.state.items, null, 2) : null}</Highlight>
            </div>
        )

    }
}
